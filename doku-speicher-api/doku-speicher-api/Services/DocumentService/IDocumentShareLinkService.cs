using doku_speicher_api.Models;

namespace doku_speicher_api.Services.DocumentService
{
    public interface IDocumentShareLinkService
    {
        Task<DocumentShareLink> CreateShareLinkAsync(Guid documentId, DateTime expiryDateTime);
        Task<DocumentShareLink> GetShareLinkByLinkAsync(string shareLink);
    }
}
