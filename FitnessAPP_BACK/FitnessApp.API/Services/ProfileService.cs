using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Services
{
    public interface IProfileService
    {
        Task<UserProfile?> GetProfileByUserIdAsync(int userId);
        Task<UserProfile> CreateProfileAsync(UserProfile profile);
        Task<UserProfile?> UpdateProfileAsync(int userId, UserProfile profile);

        Task<List<UserProfile>> GetAllProfilesForTrainingAsync();
    }

    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _context;

        public ProfileService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile?> GetProfileByUserIdAsync(int userId)
        {
            return await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<UserProfile> CreateProfileAsync(UserProfile profile)
        {
            // Adăugăm logging pentru a vedea ce se primește
            Console.WriteLine($"Creating profile for user {profile.UserId}");

            // Verificăm dacă există deja un profil pentru acest utilizator
            var existingProfile = await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == profile.UserId);

            if (existingProfile != null)
            {
                Console.WriteLine($"Profile already exists for user {profile.UserId}");
                throw new InvalidOperationException($"Există deja un profil pentru utilizatorul cu ID-ul {profile.UserId}.");
            }

            // Verificăm dacă utilizatorul există
            var user = await _context.Users.FindAsync(profile.UserId);
            if (user == null)
            {
                Console.WriteLine($"User with ID {profile.UserId} not found");
                throw new InvalidOperationException($"Nu există un utilizator cu ID-ul {profile.UserId}.");
            }

            try
            {
                _context.UserProfiles.Add(profile);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Profile created successfully for user {profile.UserId}");
                return profile;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving profile: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw new InvalidOperationException($"Eroare la salvarea profilului: {ex.Message}", ex);
            }
        }

        public async Task<UserProfile?> UpdateProfileAsync(int userId, UserProfile updatedProfile)
        {
            var existingProfile = await _context.UserProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (existingProfile == null)
                return null;

            // Actualizăm proprietățile
            existingProfile.Age = updatedProfile.Age;
            existingProfile.Weight = updatedProfile.Weight;
            existingProfile.Height = updatedProfile.Height;
            existingProfile.Sex = updatedProfile.Sex;
            existingProfile.ActivityLevel = updatedProfile.ActivityLevel;
            existingProfile.Objective = updatedProfile.Objective;
            existingProfile.AllergiesRestrictions = updatedProfile.AllergiesRestrictions;
            existingProfile.WeightGoal = updatedProfile.WeightGoal;
            // Actualizăm noile proprietăți
            existingProfile.Diet = updatedProfile.Diet;
            existingProfile.Experience = updatedProfile.Experience;

            try
            {
                await _context.SaveChangesAsync();
                return existingProfile;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Eroare la actualizarea profilului: {ex.Message}", ex);
            }
        }
        public async Task<List<UserProfile>> GetAllProfilesForTrainingAsync()
        {
            // Selectăm doar profilurile care au toate datele necesare
            var profiles = await _context.UserProfiles
                .Where(p => p.Age > 0
                    && p.Height > 0
                    && p.Weight > 0
                    && p.WeightGoal > 0
                    && !string.IsNullOrEmpty(p.Sex)
                    && !string.IsNullOrEmpty(p.ActivityLevel))
                .ToListAsync();

            return profiles;
        }
    }
}