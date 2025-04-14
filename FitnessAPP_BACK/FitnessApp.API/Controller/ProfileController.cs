using FitnessApp.API.Models;
using FitnessApp.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FitnessApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        // GET: api/Profile
        [HttpGet]
        [Authorize] // Necesită autentificare
        public async Task<ActionResult<UserProfile>> GetProfile()
        {
            // Obținem ID-ul utilizatorului din token
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
                return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return BadRequest("ID-ul utilizatorului din token nu este valid.");

            var profile = await _profileService.GetProfileByUserIdAsync(userId);
            if (profile == null)
                return NotFound("Nu s-a găsit niciun profil pentru acest utilizator.");

            return Ok(profile);
        }

        // POST: api/Profile
        [HttpPost]
        [Authorize] // Necesită autentificare
        public async Task<ActionResult<UserProfile>> CreateProfile([FromBody] UserProfile profile)
        {
            try
            {
                // Adaugăm logging pentru a vedea ce se primește
                Console.WriteLine($"Attempting to create profile: {profile?.UserId}, Age: {profile?.Age}");
                
                // Verificăm dacă avem date valide
                if (profile == null)
                    return BadRequest("Datele profilului sunt invalide.");

                // Verificăm dacă ID-ul utilizatorului din token este același cu cel din profil
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");

                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");

                // Actualizăm ID-ul utilizatorului în profil cu cel din token
                profile.UserId = userId;

                // Setăm valorile implicite pentru noile câmpuri dacă nu sunt furnizate
                if (string.IsNullOrEmpty(profile.Diet))
                {
                    profile.Diet = "omnivore"; // Valoare implicită pentru dietă
                }

                if (string.IsNullOrEmpty(profile.Experience))
                {
                    profile.Experience = "beginner"; // Valoare implicită pentru experiență
                }

                var createdProfile = await _profileService.CreateProfileAsync(profile);
                return CreatedAtAction(nameof(GetProfile), new { }, createdProfile);
            }
            catch (Exception ex)
            {
                // Adăugăm logging pentru a vedea eroarea
                Console.WriteLine($"Error creating profile: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                return BadRequest($"Nu s-a putut crea profilul: {ex.Message}");
            }
        }

        // PUT: api/Profile
        [HttpPut]
        [Authorize] // Necesită autentificare
        public async Task<ActionResult<UserProfile>> UpdateProfile([FromBody] UserProfile profile)
        {
            try 
            {
                // Verificăm dacă avem date valide
                if (profile == null)
                    return BadRequest("Datele profilului sunt invalide.");
                
                // Verificăm ID-ul utilizatorului din token
                var userIdClaim = User.FindFirst("UserId");
                if (userIdClaim == null)
                    return Unauthorized("Token-ul nu conține ID-ul utilizatorului.");

                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return BadRequest("ID-ul utilizatorului din token nu este valid.");

                // Actualizăm profilul pentru utilizatorul curent
                var updatedProfile = await _profileService.UpdateProfileAsync(userId, profile);
                if (updatedProfile == null)
                    return NotFound("Nu s-a găsit niciun profil pentru acest utilizator.");

                return Ok(updatedProfile);
            }
            catch (Exception ex)
            {
                return BadRequest($"Nu s-a putut actualiza profilul: {ex.Message}");
            }
        }
    }
}