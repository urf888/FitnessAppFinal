using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace FitnessApp.API.Services
{
    public interface IProgramService
    {
        Task<IEnumerable<FitnessProgram>> GetAllProgramsAsync();
        Task<FitnessProgram?> GetProgramByIdAsync(int id, bool includeWorkouts = false);
        Task<IEnumerable<FitnessProgram>> GetFilteredProgramsAsync(string? gender, string? diet, string? programType, string? difficultyLevel = null, int? ageMin = null, int? ageMax = null);
        Task<FitnessProgram> CreateProgramAsync(FitnessProgram program);
        Task<FitnessProgram?> UpdateProgramAsync(int id, FitnessProgram program);
        Task<bool> DeleteProgramAsync(int id);

        // Metode noi pentru gestionarea zilelor de antrenament
        Task<IEnumerable<WorkoutDay>> GetWorkoutDaysForProgramAsync(int programId);
        Task<WorkoutDay?> GetWorkoutDayByIdAsync(int id, bool includeExercises = false);
        Task<WorkoutDay> AddWorkoutDayToProgramAsync(int programId, WorkoutDay workoutDay);
        Task<WorkoutDay?> UpdateWorkoutDayAsync(int id, WorkoutDay workoutDay);
        Task<bool> DeleteWorkoutDayAsync(int id);

        // Metode pentru gestionarea exercițiilor în zile de antrenament
        Task<ExerciseWorkout> AddExerciseToWorkoutDayAsync(int workoutDayId, ExerciseWorkout exerciseWorkout);
        Task<ExerciseWorkout?> UpdateExerciseWorkoutAsync(int id, ExerciseWorkout exerciseWorkout);
        Task<bool> DeleteExerciseFromWorkoutDayAsync(int exerciseWorkoutId);
    }

    public class ProgramService : IProgramService
    {
        private readonly AppDbContext _context;

        public ProgramService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FitnessProgram>> GetAllProgramsAsync()
        {
            var programs = await _context.FitnessPrograms.ToListAsync();
            
            // Procesăm URL-urile imaginilor pentru toate programele
            foreach (var program in programs)
            {
                program.ImageUrl = NormalizeImageUrl(program.ImageUrl);
            }
            
            return programs;
        }

        public async Task<FitnessProgram?> GetProgramByIdAsync(int id, bool includeWorkouts = false)
        {
            FitnessProgram? program;
            
            if (!includeWorkouts)
                program = await _context.FitnessPrograms.FindAsync(id);
            else
                program = await _context.FitnessPrograms
                    .Include(p => p.WorkoutDays.OrderBy(d => d.DayOfWeek))
                        .ThenInclude(d => d.ExerciseWorkouts.OrderBy(ew => ew.Order))
                            .ThenInclude(ew => ew.Exercise)
                    .FirstOrDefaultAsync(p => p.Id == id);
                    
            if (program != null)
            {
                // Procesăm URL-ul imaginii
                program.ImageUrl = NormalizeImageUrl(program.ImageUrl);
            }
            
            return program;
        }

        public async Task<IEnumerable<FitnessProgram>> GetFilteredProgramsAsync(
            string? gender, string? diet, string? programType, string? difficultyLevel = null, int? ageMin = null, int? ageMax = null)
        {
            IQueryable<FitnessProgram> query = _context.FitnessPrograms;

            if (!string.IsNullOrEmpty(gender))
                query = query.Where(p => p.Gender.ToLower() == gender.ToLower());

            if (!string.IsNullOrEmpty(diet))
                query = query.Where(p => p.Diet.ToLower() == diet.ToLower());
                
            if (!string.IsNullOrEmpty(programType))
                query = query.Where(p => p.ProgramType.ToLower() == programType.ToLower());
            
            // Filtrări noi adăugate
            if (!string.IsNullOrEmpty(difficultyLevel))
                query = query.Where(p => p.DifficultyLevel.ToLower() == difficultyLevel.ToLower());
                
            if (ageMin.HasValue)
                query = query.Where(p => !p.AgeRangeMax.HasValue || p.AgeRangeMax >= ageMin.Value);
                
            if (ageMax.HasValue)
                query = query.Where(p => !p.AgeRangeMin.HasValue || p.AgeRangeMin <= ageMax.Value);

            var programs = await query.ToListAsync();
            
            // Procesăm URL-urile imaginilor pentru toate programele filtrate
            foreach (var program in programs)
            {
                program.ImageUrl = NormalizeImageUrl(program.ImageUrl);
            }
            
            return programs;
        }

        public async Task<FitnessProgram> CreateProgramAsync(FitnessProgram program)
        {
            // Normalizăm URL-ul imaginii înainte de a salva
            program.ImageUrl = NormalizeImageUrl(program.ImageUrl);
            
            _context.FitnessPrograms.Add(program);
            await _context.SaveChangesAsync();
            return program;
        }

        public async Task<FitnessProgram?> UpdateProgramAsync(int id, FitnessProgram program)
        {
            var existingProgram = await _context.FitnessPrograms.FindAsync(id);
            if (existingProgram == null)
                return null;

            // Actualizăm proprietățile de bază
            existingProgram.Name = program.Name;
            existingProgram.Gender = program.Gender;
            existingProgram.Diet = program.Diet;
            existingProgram.ProgramType = program.ProgramType;
            existingProgram.Description = program.Description;
            
            // Normalizăm URL-ul imaginii înainte de a actualiza
            existingProgram.ImageUrl = NormalizeImageUrl(program.ImageUrl);
            
            // Actualizăm proprietățile noi
            existingProgram.DifficultyLevel = program.DifficultyLevel;
            existingProgram.DurationWeeks = program.DurationWeeks;
            existingProgram.WorkoutsPerWeek = program.WorkoutsPerWeek;
            existingProgram.AgeRangeMin = program.AgeRangeMin;
            existingProgram.AgeRangeMax = program.AgeRangeMax;
            existingProgram.Goals = program.Goals;
            existingProgram.RequiredEquipment = program.RequiredEquipment;

            await _context.SaveChangesAsync();
            return existingProgram;
        }

        public async Task<bool> DeleteProgramAsync(int id)
        {
            var program = await _context.FitnessPrograms.FindAsync(id);
            if (program == null)
                return false;

            _context.FitnessPrograms.Remove(program);
            await _context.SaveChangesAsync();
            return true;
        }

        // Implementarea metodelor pentru gestionarea zilelor de antrenament
        public async Task<IEnumerable<WorkoutDay>> GetWorkoutDaysForProgramAsync(int programId)
        {
            return await _context.WorkoutDays
                .Where(d => d.ProgramId == programId)
                .OrderBy(d => d.DayOfWeek)
                .ToListAsync();
        }

        public async Task<WorkoutDay?> GetWorkoutDayByIdAsync(int id, bool includeExercises = false)
        {
            if (!includeExercises)
                return await _context.WorkoutDays.FindAsync(id);
            
            return await _context.WorkoutDays
                .Include(d => d.ExerciseWorkouts.OrderBy(ew => ew.Order))
                    .ThenInclude(ew => ew.Exercise)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<WorkoutDay> AddWorkoutDayToProgramAsync(int programId, WorkoutDay workoutDay)
        {
            // Verificăm dacă programul există
            var program = await _context.FitnessPrograms.FindAsync(programId);
            if (program == null)
                throw new KeyNotFoundException($"Programul cu ID-ul {programId} nu a fost găsit.");
            
            workoutDay.ProgramId = programId;
            _context.WorkoutDays.Add(workoutDay);
            await _context.SaveChangesAsync();
            return workoutDay;
        }

        public async Task<WorkoutDay?> UpdateWorkoutDayAsync(int id, WorkoutDay workoutDay)
        {
            var existingWorkoutDay = await _context.WorkoutDays.FindAsync(id);
            if (existingWorkoutDay == null)
                return null;
            
            existingWorkoutDay.Name = workoutDay.Name;
            existingWorkoutDay.DayOfWeek = workoutDay.DayOfWeek;
            existingWorkoutDay.DurationMinutes = workoutDay.DurationMinutes;
            existingWorkoutDay.Notes = workoutDay.Notes;
            
            await _context.SaveChangesAsync();
            return existingWorkoutDay;
        }

        public async Task<bool> DeleteWorkoutDayAsync(int id)
        {
            var workoutDay = await _context.WorkoutDays.FindAsync(id);
            if (workoutDay == null)
                return false;
            
            _context.WorkoutDays.Remove(workoutDay);
            await _context.SaveChangesAsync();
            return true;
        }

        // Implementarea metodelor pentru gestionarea exercițiilor în zile de antrenament
        public async Task<ExerciseWorkout> AddExerciseToWorkoutDayAsync(int workoutDayId, ExerciseWorkout exerciseWorkout)
        {
            // Verificăm dacă ziua de antrenament există
            var workoutDay = await _context.WorkoutDays.FindAsync(workoutDayId);
            if (workoutDay == null)
                throw new KeyNotFoundException($"Ziua de antrenament cu ID-ul {workoutDayId} nu a fost găsită.");
                
            // Verificăm dacă exercițiul există
            var exercise = await _context.Exercises.FindAsync(exerciseWorkout.ExerciseId);
            if (exercise == null)
                throw new KeyNotFoundException($"Exercițiul cu ID-ul {exerciseWorkout.ExerciseId} nu a fost găsit.");
                
            exerciseWorkout.WorkoutDayId = workoutDayId;
            _context.ExerciseWorkouts.Add(exerciseWorkout);
            await _context.SaveChangesAsync();
            return exerciseWorkout;
        }

        public async Task<ExerciseWorkout?> UpdateExerciseWorkoutAsync(int id, ExerciseWorkout exerciseWorkout)
        {
            var existingExerciseWorkout = await _context.ExerciseWorkouts.FindAsync(id);
            if (existingExerciseWorkout == null)
                return null;
                
            existingExerciseWorkout.Order = exerciseWorkout.Order;
            existingExerciseWorkout.Sets = exerciseWorkout.Sets;
            existingExerciseWorkout.Reps = exerciseWorkout.Reps;
            existingExerciseWorkout.Duration = exerciseWorkout.Duration;
            existingExerciseWorkout.Weight = exerciseWorkout.Weight;
            existingExerciseWorkout.Notes = exerciseWorkout.Notes;
            existingExerciseWorkout.Technique = exerciseWorkout.Technique;
            existingExerciseWorkout.RestSeconds = exerciseWorkout.RestSeconds;
            
            await _context.SaveChangesAsync();
            return existingExerciseWorkout;
        }

        public async Task<bool> DeleteExerciseFromWorkoutDayAsync(int exerciseWorkoutId)
        {
            var exerciseWorkout = await _context.ExerciseWorkouts.FindAsync(exerciseWorkoutId);
            if (exerciseWorkout == null)
                return false;
                
            _context.ExerciseWorkouts.Remove(exerciseWorkout);
            await _context.SaveChangesAsync();
            return true;
        }
        
        // Metodă pentru normalizarea URL-urilor de imagini
        private string NormalizeImageUrl(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return "/images/placeholders/default-program.jpg";
            
            // Verificăm dacă e o cale de fișier locală
            if (imageUrl.Contains(":\\") || (imageUrl.StartsWith("/") && imageUrl.Contains("/")))
            {
                try
                {
                    // Extragem doar numele fișierului din calea completă
                    string fileName = Path.GetFileName(imageUrl);
                    
                    // Verificăm dacă numele fișierului conține extensie de imagine
                    string extension = Path.GetExtension(fileName).ToLower();
                    if (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".gif" || extension == ".webp")
                    {
                        return $"/images/programs/{fileName}";
                    }
                    else
                    {
                        // Dacă nu are extensie validă, returnăm imaginea default
                        return "/images/placeholders/default-program.jpg";
                    }
                }
                catch
                {
                    // În caz de eroare la procesarea căii, returnăm imaginea default
                    return "/images/placeholders/default-program.jpg";
                }
            }
            
            // Dacă imageUrl începe deja cu /images/ sau http, îl lăsăm așa cum este
            if (imageUrl.StartsWith("/images/") || imageUrl.StartsWith("http://") || imageUrl.StartsWith("https://"))
                return imageUrl;
                
            // Pentru orice alt caz, presupunem că e un nume de fișier și îl punem în folderul programs
            return $"/images/programs/{imageUrl}";
        }
    }
}