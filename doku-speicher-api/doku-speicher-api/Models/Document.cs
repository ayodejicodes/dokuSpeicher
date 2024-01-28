using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace doku_speicher_api.Models
{
    public class Document
    {
        [Key]
        public Guid DocumentId { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Type { get; set; }

        [Required]
        public DateTime UploadDateTime { get; set; }

        public DateTime LastEditedTime { get; set; }

        [Required]
        [StringLength(255)]
        public string FilePath { get; set; }

        [StringLength(255)]
        public string PreviewImagePath { get; set; }

        [Range(0, int.MaxValue)]
        public int DownloadCount { get; set; }
        [Required]
        public long FileSize { get; set; }

        // Navigation properties
        public ApplicationUser User { get; set; }
        public ICollection<DocumentShareLink> ShareLinks { get; set; }
        public ICollection<DownloadHistory> DownloadHistories { get; set; }
    }
}
