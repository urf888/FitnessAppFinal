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

        // GET: api/Profile/training-data
        [HttpGet("training-data")]
        [Authorize(Roles = "admin")] // Doar admin poate accesa
        public async Task<ActionResult<List<object>>> GetTrainingData()
        {
            try
            {
                var profiles = await _profileService.GetAllProfilesForTrainingAsync();
                
                if (profiles == null || profiles.Count == 0)
                {
                    return NotFound("Nu există profile disponibile pentru antrenarea modelului.");
                }
                
                // Anonimizăm datele și returnăm doar ce e necesar pentru model
                var trainingData = profiles.Select(p => new {
                    age = p.Age,
                    height = p.Height,
                    weight = p.Weight,
                    sex = p.Sex,
                    activityLevel = p.ActivityLevel,
                    weightGoal = p.WeightGoal,
                    // Calculăm caloriile recomandate folosind formula Harris-Benedict
                    calorieIntake = CalculateCalorieIntake(p)
                }).ToList();
                
                return Ok(trainingData);
            }
            catch (Exception ex)
            {
                return BadRequest($"Eroare la obținerea datelor de antrenare: {ex.Message}");
            }
        }

        private int CalculateCalorieIntake(UserProfile profile)
        {
            // Calcularea BMR (Basal Metabolic Rate) folosind ecuația Harris-Benedict
            double bmr;
            
            if (profile.Sex.ToLower() == "masculin")
            {
                bmr = 88.362 + (13.397 * profile.Weight) + (4.799 * profile.Height) - (5.677 * profile.Age);
            }
            else
            {
                bmr = 447.593 + (9.247 * profile.Weight) + (3.098 * profile.Height) - (4.330 * profile.Age);
            }
            
            // Factori de activitate
            var activityFactors = new Dictionary<string, double>
            {
                { "sedentary", 1.2 },
                { "light", 1.375 },
                { "moderate", 1.55 },
                { "active", 1.725 },
                { "very active", 1.9 }
            };
            
            double activityFactor = 1.2; // Valoare default
            if (activityFactors.ContainsKey(profile.ActivityLevel.ToLower()))
            {
                activityFactor = activityFactors[profile.ActivityLevel.ToLower()];
            }
            
            // Calcularea TDEE (Total Daily Energy Expenditure)
            double maintenanceCalories = bmr * activityFactor;
            
            // Calculăm dacă este obiectiv de slăbire sau creștere
            bool isWeightLoss = profile.Weight > profile.WeightGoal;
            
            // O lipsă/surplus de aproximativ 500-1000 de calorii pe zi reprezintă ritmul recomandat
            double caloriesPerKg = 7700; // ~7700 calorii per kg de grăsime
            double weeklyRate = isWeightLoss ? 0.5 : 0.25; // Rate standard recomandate
            double dailyCalorieAdjustment = (weeklyRate * caloriesPerKg) / 7;
            
            double targetCalories = isWeightLoss 
                ? maintenanceCalories - dailyCalorieAdjustment
                : maintenanceCalories + dailyCalorieAdjustment;
            
            return (int)Math.Round(targetCalories);
        }
    }
}