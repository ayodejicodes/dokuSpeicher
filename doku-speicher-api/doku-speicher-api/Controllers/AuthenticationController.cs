using AutoMapper;
using doku_speicher_api.Data;
using doku_speicher_api.Models;
using doku_speicher_api.Models.Dto.AuthDto;
using doku_speicher_api.Services.BlobStorageService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace doku_speicher_api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private string secretKey;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentController> _logger;

        public AuthenticationController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IConfiguration configuration, IBlobStorageService blobStorageService, IMapper mapper, ILogger<DocumentController> logger)
        {
            _context = context;
            secretKey = configuration.GetValue<string>("AppSettings:Secret");
            _userManager = userManager;
            _blobStorageService = blobStorageService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _userManager.FindByNameAsync(model.UserName) ?? await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                return BadRequest(ApiResponse<ApplicationUser>.Failure(new List<string> { "User with this Username or Email already exists." }));
            }

            ApplicationUser newUser = new ApplicationUser
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                UserName = model.UserName,
                Email = model.Email,
                DateCreated = DateTime.Now
            };

            try
            {
                var result = await _userManager.CreateAsync(newUser, model.Password);

                if (!result.Succeeded)
                {
                    return BadRequest(ApiResponse<ApplicationUser>.Failure(result.Errors.Select(e => e.Description).ToList()));
                }

                var token = GenerateJwtToken(newUser);

                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        newUser.Id,
                        newUser.UserName,
                        newUser.Email,
                        newUser.FirstName,
                        newUser.LastName
                    },
                    Message = "User registered and signed in successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while Registering");
                return StatusCode(500, ApiResponse<ApplicationUser>.Failure(new List<string> { "An error occurred while Registering." }));
            }
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

         
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return BadRequest(ApiResponse<ApplicationUser>.Failure(new List<string> { "Invalid login attempt." }));
            }

         
            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!result)
            {
                return BadRequest(ApiResponse<ApplicationUser>.Failure(new List<string> { "User Name or Password not correct." }));
            }

            try
            {
              
                user.LastLogin = DateTime.Now;
                await _userManager.UpdateAsync(user);


                var token = GenerateJwtToken(user);

             
                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        user.FirstName,
                        user.LastName
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login");
                return StatusCode(500, ApiResponse<ApplicationUser>.Failure(new List<string> { "An error occurred during login." }));
            }
        }

       
        private string GenerateJwtToken(ApplicationUser user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey); 

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
                }),
                Expires = DateTime.Now.AddDays(7), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


    }
}
