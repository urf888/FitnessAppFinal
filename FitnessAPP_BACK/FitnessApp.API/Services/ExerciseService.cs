using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Services
{
    public interface IExerciseService
    {
        Task<IEnumerable<Exercise>> GetAllExercisesAsync();
        Task<Exercise?> GetExerciseByIdAsync(int id);
        Task<IEnumerable<Exercise>> GetExercisesByCategoryAsync(string category);
        Task<IEnumerable<Exercise>> GetExercisesByDifficultyAsync(string difficultyLevel);
        Task<IEnumerable<Exercise>> GetExercisesByEquipmentAsync(string equipment);
        Task<Exercise> CreateExerciseAsync(Exercise exercise);
        Task<Exercise?> UpdateExerciseAsync(int id, Exercise exercise);
        Task<bool> DeleteExerciseAsync(int id);
    }

    public class ExerciseService : IExerciseService
    {
        private readonly AppDbContext _context;

        public ExerciseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Exercise>> GetAllExercisesAsync()
        {
            return await _context.Exercises.ToListAsync();
        }

        public async Task<Exercise?> GetExerciseByIdAsync(int id)
        {
            return await _context.Exercises.FindAsync(id);
        }

        public async Task<IEnumerable<Exercise>> GetExercisesByCategoryAsync(string category)
        {
            return await _context.Exercises
                .Where(e => e.Category.ToLower() == category.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetExercisesByDifficultyAsync(string difficultyLevel)
        {
            return await _context.Exercises
                .Where(e => e.DifficultyLevel.ToLower() == difficultyLevel.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetExercisesByEquipmentAsync(string equipment)
        {
            return await _context.Exercises
                .Where(e => e.Equipment.ToLower().Contains(equipment.ToLower()))
                .ToListAsync();
        }

        public async Task<Exercise> CreateExerciseAsync(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<Exercise?> UpdateExerciseAsync(int id, Exercise exercise)
        {
            var existingExercise = await _context.Exercises.FindAsync(id);
            if (existingExercise == null)
                return null;

            // Actualizăm proprietățile
            existingExercise.Name = exercise.Name;
            existingExercise.Category = exercise.Category;
            existingExercise.DifficultyLevel = exercise.DifficultyLevel;
            existingExercise.Description = exercise.Description;
            existingExercise.Instructions = exercise.Instructions;
            existingExercise.ImageUrl = exercise.ImageUrl;
            existingExercise.VideoUrl = exercise.VideoUrl;
            existingExercise.TargetMuscles = exercise.TargetMuscles;
            existingExercise.SecondaryMuscles = exercise.SecondaryMuscles;
            existingExercise.Equipment = exercise.Equipment;

            await _context.SaveChangesAsync();
            return existingExercise;
        }

        public async Task<bool> DeleteExerciseAsync(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return false;

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}