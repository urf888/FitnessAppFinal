using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImagesController> _logger;

        public ImagesController(IWebHostEnvironment environment, ILogger<ImagesController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        // GET: api/Images/programs/{filename}
        [HttpGet("programs/{filename}")]
        [HttpHead("programs/{filename}")] // Adăugăm suport explicit pentru HEAD
        public IActionResult GetProgramImage(string filename)
        {
            try
            {
                // Calea către folderul cu imagini programe
                string imagePath = Path.Combine(_environment.WebRootPath, "images", "programs", filename);

                // Verifică dacă imaginea există
                if (System.IO.File.Exists(imagePath))
                {
                    // Verifică dacă este un request HEAD
                    if (HttpContext.Request.Method == "HEAD")
                    {
                        // Pentru HEAD, returnăm doar headerele fără conținut
                        Response.ContentType = GetContentType(filename);
                        return Ok();
                    }

                    // Pentru GET, returnăm imaginea completă
                    var image = System.IO.File.OpenRead(imagePath);
                    string contentType = GetContentType(filename);
                    return File(image, contentType);
                }

                // Dacă imaginea nu există, returnează imaginea default
                string defaultImagePath = Path.Combine(_environment.WebRootPath, "images", "placeholders", "default-program.jpg");
                
                // Verifică dacă imaginea default există
                if (System.IO.File.Exists(defaultImagePath))
                {
                    // Verifică dacă este un request HEAD
                    if (HttpContext.Request.Method == "HEAD")
                    {
                        // Pentru HEAD, returnăm doar headerele fără conținut
                        Response.ContentType = "image/jpeg";
                        return Ok();
                    }

                    var defaultImage = System.IO.File.OpenRead(defaultImagePath);
                    return File(defaultImage, "image/jpeg");
                }

                // Dacă nici măcar imaginea default nu există, returnează 404
                return NotFound("Imaginea nu a fost găsită");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea imaginii {Filename}", filename);
                return StatusCode(500, "Eroare la obținerea imaginii");
            }
        }

        // GET: api/Images/placeholders/{filename}
        [HttpGet("placeholders/{filename}")]
        [HttpHead("placeholders/{filename}")] // Adăugăm suport explicit pentru HEAD
        public IActionResult GetPlaceholderImage(string filename)
        {
            try
            {
                // Calea către folderul cu imagini placeholders
                string imagePath = Path.Combine(_environment.WebRootPath, "images", "placeholders", filename);

                // Verifică dacă imaginea există
                if (System.IO.File.Exists(imagePath))
                {
                    // Verifică dacă este un request HEAD
                    if (HttpContext.Request.Method == "HEAD")
                    {
                        // Pentru HEAD, returnăm doar headerele fără conținut
                        Response.ContentType = GetContentType(filename);
                        return Ok();
                    }

                    // Pentru GET, returnăm imaginea
                    var image = System.IO.File.OpenRead(imagePath);
                    string contentType = GetContentType(filename);
                    return File(image, contentType);
                }

                // Dacă imaginea nu există, returnează imaginea default
                string defaultImagePath = Path.Combine(_environment.WebRootPath, "images", "placeholders", "default-program.jpg");
                
                // Verifică dacă imaginea default există
                if (System.IO.File.Exists(defaultImagePath))
                {
                    // Verifică dacă este un request HEAD
                    if (HttpContext.Request.Method == "HEAD")
                    {
                        // Pentru HEAD, returnăm doar headerele fără conținut
                        Response.ContentType = "image/jpeg";
                        return Ok();
                    }

                    var defaultImage = System.IO.File.OpenRead(defaultImagePath);
                    return File(defaultImage, "image/jpeg");
                }

                // Dacă nici măcar imaginea default nu există, returnează 404
                return NotFound("Imaginea placeholder nu a fost găsită");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea imaginii placeholder {Filename}", filename);
                return StatusCode(500, "Eroare la obținerea imaginii placeholder");
            }
        }

        // Metodă pentru a determina tipul de conținut în funcție de extensia fișierului
        private string GetContentType(string filename)
        {
            string extension = Path.GetExtension(filename).ToLowerInvariant();
            
            return extension switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream",
            };
        }
    }
}