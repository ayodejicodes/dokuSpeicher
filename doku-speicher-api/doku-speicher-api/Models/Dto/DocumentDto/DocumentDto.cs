namespace doku_speicher_api.Models.Dto.DocumentDto
{
    public class DocumentDto
    {
        public Guid DocumentId { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public DateTime UploadDateTime { get; set; }
        public DateTime LastEditedTime { get; set; }
        public string FilePath { get; set; }
        public string PreviewImagePath { get; set; }
        public int DownloadCount { get; set; }
        public long FileSize { get; set; }

        public ICollection<DocumentShareLinkDto> ShareLinks { get; set; }
    }
}
