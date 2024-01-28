using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using doku_speicher_api.Models;
using Microsoft.Extensions.Logging;

namespace doku_speicher_api.Services.BlobStorageService
{
    public class BlobStorageService: IBlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName;
        private readonly ILogger<BlobStorageService> _logger;

        public BlobStorageService(IConfiguration configuration, ILogger<BlobStorageService> logger)
        {
            _blobServiceClient = new BlobServiceClient(configuration["AzureBlobStorage:ConnectionString"]);
            _containerName = configuration["AzureBlobStorage:ContainerName"];
            _logger = logger;
        }


        public async Task<string> UploadBlobAsync(IFormFile file)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobName = Guid.NewGuid().ToString() + "-" + file.FileName;
                var blobClient = containerClient.GetBlobClient(blobName);

                var blobHttpHeaders = new BlobHttpHeaders
                {
                    ContentType = file.ContentType
                };

                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = blobHttpHeaders });
                }

                return blobClient.Uri.ToString();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during blob upload.");
                return "";
            }
        }

        public async Task<bool> DeleteBlobAsync(string blobName)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(blobName);
                var response = await blobClient.DeleteIfExistsAsync();
                return response.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during blob deletion."); 
                return false;
            }
        }

        public async Task<Stream> GetBlobAsync(string blobName)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
                var blobClient = containerClient.GetBlobClient(blobName);
                var blobDownloadInfo = await blobClient.DownloadAsync();
                return blobDownloadInfo.Value.Content;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during blob retrieval.");
                return null;
            }
        }

    }
}
