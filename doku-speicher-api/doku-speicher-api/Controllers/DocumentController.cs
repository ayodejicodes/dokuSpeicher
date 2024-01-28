using AutoMapper;
using doku_speicher_api.Models;
using doku_speicher_api.Models.Dto.DocumentDto;
using doku_speicher_api.Services.BlobStorageService;
using doku_speicher_api.Services.DocumentService;
using doku_speicher_api.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog.Sinks.File;
using System.IO.Compression;
using System.Net;
using System.Security.Claims;

namespace doku_speicher_api.Controllers
{

    [Route("api/document")]
    [ApiController]
    public class DocumentController : ControllerBase
    {

        private readonly IDocumentService _documentService;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public DocumentController(IDocumentService documentService, IBlobStorageService blobStorageService, IMapper mapper, ILogger<DocumentController> logger, UserManager<ApplicationUser> userManager)
        {
            _documentService = documentService;
            _blobStorageService = blobStorageService;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Document>>>> GetAllDocuments()
        {
            var documents = await _documentService.GetAllDocumentsAsync();
            return Ok(ApiResponse<IEnumerable<Document>>.Success(documents));
        }

        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<ApiResponse<Document>>> GetDocument(Guid id)
        {
            var document = await _documentService.GetDocumentByIdAsync(id);
            if (document == null)
            {
                return NotFound(ApiResponse<Document>.Failure(new List<string> { "Document not found" }));
            }

            return Ok(ApiResponse<Document>.Success(document));
        }




        [HttpPost("upload")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<IEnumerable<Document>>>> CreateDocuments([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(ApiResponse<IEnumerable<Document>>.Failure(new List<string> { "No files attached" }));
            }

            try
            {
               
                var userId = _userManager.GetUserId(User);
                if (string.IsNullOrEmpty(userId))
                {
                    _logger.LogError("User ID cannot be found. The user might not be authenticated.");
                    return Unauthorized("User not Authorized!");
                }

                var documents = new List<Document>();

                foreach (var file in files)
                {
                    if (file == null || file.Length == 0)
                    {
                       
                        continue;
                    }

                   
                    var fileName = Path.GetFileName(file.FileName);

                 
                    var fileExtension = Path.GetExtension(file.FileName).TrimStart('.');

                    var fileSize = file.Length;

                    var filePath = await _blobStorageService.UploadBlobAsync(file);
                    var document = _mapper.Map<Document>(new DocumentCreateDto()); 
                    document.UploadDateTime = DateTime.Now;
                    document.Name = fileName;
                    document.FilePath = filePath;
                    document.UserId = userId;
                    document.Type = fileExtension;
                    document.FileSize = fileSize;

                    var createdDocument = await _documentService.CreateDocumentAsync(document);
                    documents.Add(createdDocument);
                }

                return CreatedAtAction(nameof(GetAllDocuments), ApiResponse<IEnumerable<Document>>.Success(documents));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating documents.");
                return StatusCode(500, ApiResponse<IEnumerable<Document>>.Failure(new List<string> { "An error occurred while creating documents." }, HttpStatusCode.InternalServerError));
            }
        }




        [HttpPut("edit/{id:Guid}")]
        public async Task<ActionResult<ApiResponse<Document>>> UpdateDocument(Guid id, [FromBody] DocumentUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<Document>.Failure(new List<string> { "Invalid data" }));
            }

            try
            {
                var existingDocument = await _documentService.GetDocumentByIdAsync(id);
                if (existingDocument == null)
                {
                    return NotFound(ApiResponse<Document>.Failure(new List<string> { "Document not found" }));
                }

               
                var fileExtension = Path.GetExtension(existingDocument.Type);

                _mapper.Map(updateDto, existingDocument);
                existingDocument.Name = $"{updateDto.Name}{fileExtension}";

                existingDocument.LastEditedTime = DateTime.Now;

                existingDocument = await _documentService.UpdateDocumentAsync(id, existingDocument);

                return Ok(ApiResponse<Document>.Success(existingDocument));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the document.");
                return StatusCode(500, ApiResponse<Document>.Failure(new List<string> { "An error occurred while updating the document." }));
            }
        }



        [HttpDelete("delete/{id:Guid}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteDocument(Guid id)
        {
            try
            {
                var document = await _documentService.GetDocumentByIdAsync(id);
                if (document == null)
                {
                    return NotFound(ApiResponse<bool>.Failure(new List<string> { "Document not found" }));
                }

                if (!string.IsNullOrEmpty(document.FilePath))
                {
                    
                    var blobName = FileUtility.ExtractBlobNameFromPath(document.FilePath);
                    var blobDeleted = await _blobStorageService.DeleteBlobAsync(blobName);
                    if (!blobDeleted)
                    {
                        _logger.LogWarning($"Failed to delete the blob for document ID '{id}'");
                        return StatusCode(500, ApiResponse<Document>.Failure(new List<string> { "Failed to delete document." }));
                    }
                }

                await _documentService.DeleteDocumentAsync(id);
                return Ok(ApiResponse<bool>.Success(true));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting the document with ID '{id}'.");
                return StatusCode(500, ApiResponse<bool>.Failure(new List<string> { "An error occurred while deleting the document." }));
            }
        }



        [HttpGet("download")]
        public async Task<IActionResult> DownloadDocuments([FromQuery] List<string>? blobNames = null)
        {
            try
            {
                if (blobNames == null || blobNames.Count == 0)
                {
                    return BadRequest("No documents selected for download.");
                }

                if (blobNames.Count == 1)
                {
                  
                    var blobName = blobNames[0];
                    var document = await _documentService.GetDocumentByBlobNameAsync(blobName);
                    if (document == null)
                    {
                        return NotFound("Document not found.");
                    }

                    var stream = await _blobStorageService.GetBlobAsync(blobName);
                    if (stream == null)
                    {
                        return NotFound("File not found in the blob storage.");
                    }

                  
                    document.DownloadCount += 1;
                    await _documentService.UpdateDocumentAsync(document.DocumentId, document);

                    string contentType = "application/octet-stream";
                    return File(stream, contentType, document.Name);
                }
                else
                {
                   
                    var documents = new List<Document>();
                    var memoryStream = new MemoryStream();

                    using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
                    {
                        foreach (var blobName in blobNames)
                        {
                            var document = await _documentService.GetDocumentByBlobNameAsync(blobName);
                            if (document != null)
                            {
                                var stream = await _blobStorageService.GetBlobAsync(blobName);
                                if (stream != null)
                                {
                                  
                                    document.DownloadCount += 1;
                                    await _documentService.UpdateDocumentAsync(document.DocumentId, document);

                                    var entry = zipArchive.CreateEntry(document.Name);
                                    using (var entryStream = entry.Open())
                                    {
                                        await stream.CopyToAsync(entryStream);
                                    }
                                    documents.Add(document);
                                }
                            }
                        }
                    }

                    memoryStream.Seek(0, SeekOrigin.Begin);
                    var contentType = "application/zip";
                    var archiveName = "downloaded_documents.zip";

                    return File(memoryStream, contentType, archiveName);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while attempting to download documents.");
                return StatusCode(500, "An error occurred while attempting to download documents.");
            }
        }






    }
}
