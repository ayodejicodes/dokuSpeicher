
using AutoMapper;
using doku_speicher_api.Models;
using doku_speicher_api.Models.Dto.DocumentDto;
using doku_speicher_api.Services.BlobStorageService;
using doku_speicher_api.Services.DocumentService;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace doku_speicher_api.Controllers
{

    [Route("api/documentShareLink")]
    [ApiController]
    public class DocumentShareLinkController : ControllerBase
    {
        private readonly IDocumentService _documentService;
        private readonly IDocumentShareLinkService _documentShareLinkService;
        private readonly ILogger<DocumentShareLinkController> _logger;
        private readonly IMapper _mapper;
        private readonly IBlobStorageService _blobStorageService;

        public DocumentShareLinkController(IDocumentService documentService, IDocumentShareLinkService documentShareLinkService, ILogger<DocumentShareLinkController> logger, IMapper mapper, IBlobStorageService blobStorageService)
        {
            _documentService = documentService;
            _documentShareLinkService = documentShareLinkService;
            _logger = logger;
            _mapper = mapper;
            _blobStorageService = blobStorageService;
            _blobStorageService = blobStorageService;
        }

     

        [HttpPost("create/{documentId:Guid}")]
        public async Task<ActionResult<ApiResponse<DocumentShareLinkDto>>> CreateShareLink(Guid documentId, [FromBody] CreateDocumentShareLinkRequest request)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(documentId);
                if (document == null)
                {
                    return NotFound(ApiResponse<DocumentShareLinkDto>.Failure(new List<string> { "Document not found" }));
                }

                var shareLink = await _documentShareLinkService.CreateShareLinkAsync(documentId, request.ExpiryDateTime);
                if (shareLink == null)
                {
                    throw new InvalidOperationException("Failed to create a share link.");
                }

               
                var shareLinkDto = _mapper.Map<DocumentShareLinkDto>(shareLink);

                return Ok(ApiResponse<DocumentShareLinkDto>.Success(shareLinkDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating the share link.");
                return StatusCode(500, ApiResponse<DocumentShareLinkDto>.Failure(new List<string> { "An error occurred while creating the share link." }, HttpStatusCode.InternalServerError));
            }
        }


      

        [HttpGet("access/{uniqueToken}")]
        public async Task<IActionResult> AccessDocumentByShareLink(string uniqueToken)
        {
            try
            {
                var documentShareLink = await _documentShareLinkService.GetShareLinkByLinkAsync(uniqueToken);
                if (documentShareLink == null)
                {
                    return NotFound("Share link not found");
                }
                else if (documentShareLink.ExpiryDateTime < DateTime.UtcNow)
                {
                    return NotFound("Expired share link");
                }

                var document = await _documentService.GetDocumentByIdAsync(documentShareLink.DocumentId);
                if (document == null)
                {
                    return NotFound("Document not found");
                }

             
                Uri blobUri = new Uri(document.FilePath);
                string blobName = blobUri.Segments.Last(); 

                var stream = await _blobStorageService.GetBlobAsync(blobName);
                if (stream == null)
                {
                    return NotFound("File not found in the blob storage.");
                }

         
                document.DownloadCount += 1;
                await _documentService.UpdateDocumentAsync(document.DocumentId, document);

            
                string contentType = "application/octet-stream";
            
                string fileName = document.Name;

           
                return File(stream, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while accessing the document by share link.");
                return StatusCode(500, "An error occurred while accessing the document.");
            }
        }





    }
}

