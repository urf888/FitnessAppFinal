using FitnessApp.API.Data;
using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")] // Doar administratorii pot accesa acest controller
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            // Includem și profilurile asociate
            var users = await _context.Users
                .Include(u => u.Profile)
                .ToListAsync();
                
            return Ok(users);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Profile)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }
        
        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User userUpdate)
        {
            if (id != userUpdate.Id)
                return BadRequest("ID mismatch");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            // Actualizăm doar proprietățile permise
            user.Username = userUpdate.Username;
            user.Email = userUpdate.Email;
            user.Role = userUpdate.Role;

            // Dacă se trimite o parolă nouă, o hash-uim
            if (!string.IsNullOrEmpty(userUpdate.PasswordHash) && 
                !userUpdate.PasswordHash.StartsWith("$2a$") && 
                !userUpdate.PasswordHash.StartsWith("$2b$"))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userUpdate.PasswordHash);
            }

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                    return NotFound();
                else
                    throw;
            }
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // POST: api/User/ResetPassword/5
        [HttpPost("ResetPassword/{id}")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] PasswordResetModel model)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            // Setăm o parolă nouă (poate fi generată aleator sau specificată în cerere)
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully" });
        }

        // GET: api/User/Stats
        [HttpGet("Stats")]
public async Task<ActionResult> GetUserStats()
{
    var totalUsers = await _context.Users.CountAsync();
    var adminUsers = await _context.Users.CountAsync(u => u.Role.ToLower() == "admin");
    var usersWithProfiles = await _context.Users
        .Where(u => _context.UserProfiles.Any(p => p.UserId == u.Id))
        .CountAsync();
    
    var stats = new
    {
        TotalUsers = totalUsers,
        AdminUsers = adminUsers,
        RegularUsers = totalUsers - adminUsers,
        UsersWithProfiles = usersWithProfiles,
        UsersWithoutProfiles = totalUsers - usersWithProfiles
    };
    
    return Ok(stats);
}

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class PasswordResetModel
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}