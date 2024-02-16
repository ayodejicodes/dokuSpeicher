using doku_speicher_api.Models;

namespace doku_speicher_api.Services.DocumentService
{
    public interface IDocumentService
    {
        Task<Document> GetDocumentByIdAsync(Guid id);
        Task<IEnumerable<Document>> GetAllDocumentsAsync();
        Task<Document> CreateDocumentAsync(Document document);
        Task<Document> UpdateDocumentAsync(Guid id, Document document);
        Task<bool> DeleteDocumentAsync(Guid id);
        Task<Document> GetDocumentByBlobNameAsync(string blobName);
        Task<IEnumerable<Document>> GetDocumentsByIdsAsync(List<Guid> documentIds);
    }
}
