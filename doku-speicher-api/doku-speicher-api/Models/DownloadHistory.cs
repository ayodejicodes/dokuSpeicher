using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace doku_speicher_api.Models
{
    public class DownloadHistory
    {
        [Key]
        public Guid DownloadId { get; set; }

        [Required]
        public Guid DocumentId { get; set; }

        public string UserId { get; set; } 

        [Required]
        public DateTime DownloadDateTime { get; set; }

        // Navigation properties
        public Document Document { get; set; }
        public ApplicationUser User { get; set; }
    }
}
