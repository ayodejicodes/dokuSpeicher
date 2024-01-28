namespace doku_speicher_api.Models.Dto.DocumentDto
{
    public class DocumentShareLinkDto
    {
        public Guid ShareLinkId { get; set; }
        public Guid DocumentId { get; set; }
        public string GeneratedLink { get; set; }
        public DateTime ExpiryDateTime { get; set; }
        public bool IsActive { get; set; }

    }
}
