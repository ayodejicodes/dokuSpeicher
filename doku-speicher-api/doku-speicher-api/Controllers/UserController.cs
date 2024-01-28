using AutoMapper;
using doku_speicher_api.Data;
using doku_speicher_api.Models;
using doku_speicher_api.Models.Dto.UserDto;
using doku_speicher_api.Services.BlobStorageService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace doku_speicher_api.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController: ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBlobStorageService _blobStorageService;
        private readonly IMapper _mapper;
        private readonly ILogger<DocumentController> _logger;
        public UserController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IConfiguration configuration, IBlobStorageService blobStorageService, IMapper mapper, ILogger<DocumentController> logger)
        {
            _context = context;
            _userManager = userManager;
            _blobStorageService = blobStorageService;
            _mapper = mapper;
            _logger = logger;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(ApiResponse<object>.Failure(new List<string> { "User not found." }));
            }

            var userDto = _mapper.Map<UserDto>(user);

            return Ok(ApiResponse<UserDto>.Success(userDto));
        }


        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest(ApiResponse<ApplicationUser>.Failure(new List<string> { "User not found." }));
            }

            _mapper.Map(updateUserDto, user);

            user.ProfileLastEditedTime = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(ApiResponse<ApplicationUser>.Failure(result.Errors.Select(e => e.Description).ToList()));
            }

            var updatedUser = new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FirstName,
                user.LastName
            };

            return Ok(ApiResponse<object>.Success(updatedUser));
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(ApiResponse<object>.Failure(new List<string> { "User not found." }));
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(ApiResponse<object>.Failure(result.Errors.Select(e => e.Description).ToList()));
            }

            return Ok(ApiResponse<object>.Success(null));
        }



    }
}
