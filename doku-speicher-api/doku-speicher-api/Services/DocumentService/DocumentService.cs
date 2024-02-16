using doku_speicher_api.Data;
using doku_speicher_api.Models;
using Microsoft.EntityFrameworkCore;

namespace doku_speicher_api.Services.DocumentService
{
    public class DocumentService : IDocumentService
    {
        private readonly ApplicationDbContext _context;

        public DocumentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Document> GetDocumentByIdAsync(Guid id)
        {
            return await _context.Documents.FindAsync(id);
        }

        public async Task<IEnumerable<Document>> GetAllDocumentsAsync()
        {
            return await _context.Documents.ToListAsync();
        }

        public async Task<Document> CreateDocumentAsync(Document document)
        {
            if (document == null) throw new ArgumentNullException(nameof(document));

            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();
            return document;
        }

        public async Task<Document> UpdateDocumentAsync(Guid id, Document document)
        {
            if (document == null) throw new ArgumentNullException(nameof(document));

            var existingDocument = await _context.Documents.FindAsync(id);
            if (existingDocument == null)
            {
                return null;
            }

          
            existingDocument.Name = document.Name;
            existingDocument.Type = document.Type;
            existingDocument.FilePath = document.FilePath;
            existingDocument.PreviewImagePath = document.PreviewImagePath;


            _context.Documents.Update(existingDocument);
            await _context.SaveChangesAsync();
            return existingDocument;
        }

        public async Task<bool> DeleteDocumentAsync(Guid id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return false;
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Document> GetDocumentByBlobNameAsync(string blobName)
        {
            
            return await _context.Documents
                                 .FirstOrDefaultAsync(d => d.FilePath.EndsWith(blobName));
        }

        public async Task<IEnumerable<Document>> GetDocumentsByIdsAsync(List<Guid> documentIds)
        {
            return await _context.Documents
                                 .Where(d => documentIds.Contains(d.DocumentId))
                                 //.Include(d => d.ApplicationUser)
                                 .ToListAsync();
        }

    }
}
