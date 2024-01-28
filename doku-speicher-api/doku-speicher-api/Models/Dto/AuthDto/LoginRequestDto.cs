using System.ComponentModel.DataAnnotations;

namespace doku_speicher_api.Models.Dto.AuthDto
{
    public class LoginRequestDto
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }

}
