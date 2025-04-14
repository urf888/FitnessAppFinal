using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly ILogger<UploadController> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private readonly long _maxFileSizeBytes = 5 * 1024 * 1024; // 5MB
        
        public UploadController(
            ILogger<UploadController> logger,
            IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
        }
        
        [HttpPost("Image")]
        [Authorize] // Pentru a asigura că doar utilizatorii autentificați pot încărca imagini
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                {
                    return BadRequest("Nu a fost furnizat niciun fișier pentru încărcare.");
                }
                
                // Verificăm dimensiunea fișierului
                if (image.Length > _maxFileSizeBytes)
                {
                    return BadRequest($"Fișierul depășește dimensiunea maximă permisă de {_maxFileSizeBytes / (1024 * 1024)}MB.");
                }
                
                // Verificăm extensia
                var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest($"Tipul de fișier nu este acceptat. Extensii permise: {string.Join(", ", _allowedExtensions)}");
                }
                
                // Verificăm conținutul fișierului pentru a ne asigura că este o imagine
                if (!image.ContentType.StartsWith("image/"))
                {
                    return BadRequest("Fișierul furnizat nu este o imagine validă.");
                }
                
                // Generăm un nume de fișier unic pentru a evita conflictele
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                
                // Construim calea pentru salvarea imaginii
                // Folosim un director 'uploads' în wwwroot
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                
                // Creăm directorul dacă nu există
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                
                var filePath = Path.Combine(uploadsFolder, fileName);
                
                // Salvăm fișierul pe disc
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(fileStream);
                }
                
                // Construim URL-ul relativ pentru imagine
                var imageUrl = $"/uploads/{fileName}";
                
                _logger.LogInformation($"Imagine încărcată cu succes: {imageUrl}");
                
                // Returnăm URL-ul imaginii
                return Ok(new { imageUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la încărcarea imaginii");
                return StatusCode(500, "A apărut o eroare internă la încărcarea imaginii.");
            }
        }
        
        [HttpDelete("Image")]
        [Authorize(Roles = "admin")] // Doar administratorii pot șterge imagini
        public IActionResult DeleteImage([FromQuery] string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest("URL-ul imaginii nu poate fi gol.");
                }
                
                // Extragem numele fișierului din URL
                var fileName = Path.GetFileName(imageUrl);
                
                // Verificăm dacă fișierul există
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);
                
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound($"Imaginea cu URL-ul {imageUrl} nu a fost găsită.");
                }
                
                // Ștergem fișierul
                System.IO.File.Delete(filePath);
                
                _logger.LogInformation($"Imagine ștearsă cu succes: {imageUrl}");
                
                return Ok(new { message = "Imaginea a fost ștearsă cu succes." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la ștergerea imaginii");
                return StatusCode(500, "A apărut o eroare internă la ștergerea imaginii.");
            }
        }
    }
}