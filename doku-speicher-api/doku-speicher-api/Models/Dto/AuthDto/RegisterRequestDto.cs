using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace doku_speicher_api.Models.Dto.AuthDto
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterRequestDto
    {

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
    }
}
