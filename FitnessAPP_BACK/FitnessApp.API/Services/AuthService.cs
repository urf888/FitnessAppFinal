using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest model);
        Task<AuthResponse> LoginAsync(LoginRequest model);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthService(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest model)
        {
            // Verifică dacă utilizatorul există deja
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                throw new Exception("Utilizator cu acest email există deja.");
            }

            // Creează utilizatorul nou
            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Role = "user"
            };

            // Salvează în baza de date
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generează token JWT
            var token = _jwtService.GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                User = user
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest model)
        {
            // Caută utilizatorul după email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
                throw new Exception("Email sau parolă invalidă.");

            // Verifică parola
            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                throw new Exception("Email sau parolă invalidă.");

            // Generează token JWT
            var token = _jwtService.GenerateJwtToken(user);

            // Log pentru verificarea token-ului
            Console.WriteLine($"Generated token for user {user.Id}: {token}");

            return new AuthResponse
            {
                Token = token,
                User = user
            };
        }
    }
}