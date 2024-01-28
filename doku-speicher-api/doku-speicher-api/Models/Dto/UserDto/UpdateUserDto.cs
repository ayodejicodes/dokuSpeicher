using System.ComponentModel.DataAnnotations;

namespace doku_speicher_api.Models.Dto.UserDto
{
    public class UpdateUserDto
    {
        [StringLength(100)]
        public string FirstName { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

    }

}
