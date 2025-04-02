using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest model)
        {
            try
            {
                var result = await _authService.RegisterAsync(model);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Register error: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest model)
        {
            try
            {
                var result = await _authService.LoginAsync(model);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Login error: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }
    }
}