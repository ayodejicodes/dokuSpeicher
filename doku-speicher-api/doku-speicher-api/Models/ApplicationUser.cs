using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace doku_speicher_api.Models
{
    public class ApplicationUser: IdentityUser
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime ProfileLastEditedTime { get; set; }

        public DateTime? LastLogin { get; set; }

        // Navigation property
        public ICollection<Document> Documents { get; set; }
        public ICollection<DownloadHistory> DownloadHistories { get; set; }
    }
}
