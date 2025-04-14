using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FitnessApp.API.Data;
using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FitnessApp.API.Services
{
    public interface IRecommendationService
    {
        Task<FitnessProgram> GetPersonalizedProgramAsync(int userId);
        Task<IEnumerable<FitnessProgram>> GetRecommendedProgramsAsync(int userId, int count = 3);
    }

    public class RecommendationService : IRecommendationService
    {
        private readonly AppDbContext _context;
        private readonly IProfileService _profileService;
        private readonly IExerciseService _exerciseService;
        private readonly IOpenAIService _openAIService;
        private readonly ILogger<RecommendationService> _logger;

        public RecommendationService(
            AppDbContext context,
            IProfileService profileService,
            IExerciseService exerciseService,
            IOpenAIService openAIService,
            ILogger<RecommendationService> logger)
        {
            _context = context;
            _profileService = profileService;
            _exerciseService = exerciseService;
            _openAIService = openAIService;
            _logger = logger;
        }

        public async Task<FitnessProgram> GetPersonalizedProgramAsync(int userId)
        {
            try
            {
                // Obține profilul utilizatorului
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                    throw new InvalidOperationException("Utilizatorul nu are un profil creat");

                _logger.LogInformation("Generare program personalizat pentru utilizatorul {UserId}", userId);

                // Obține toate exercițiile disponibile pentru a le include în prompt
                var allExercises = await _exerciseService.GetAllExercisesAsync();
                
                // Transformăm exercițiile în format JSON compact pentru prompt
                var exercisesJson = JsonSerializer.Serialize(
                    allExercises.Select(e => new { 
                        e.Id, 
                        e.Name, 
                        e.Category, 
                        e.DifficultyLevel, 
                        e.Equipment,
                        e.TargetMuscles
                    })
                );

                // Creează un prompt detaliat pentru LLM
                string prompt = CreateDetailedPrompt(userProfile, exercisesJson);
                
                // Obține răspunsul de la LLM
                var response = await _openAIService.GetCompletionAsync(prompt);

                // Parseaza răspunsul JSON pentru a obține programul generat
                var generatedProgram = ParseProgramFromResponse(response, userId);
                
                // Validează programul generat
                ValidateGeneratedProgram(generatedProgram, allExercises.ToList());
                
                // Salvează programul în baza de date
                await SaveGeneratedProgram(generatedProgram);
                
                _logger.LogInformation("Program personalizat generat cu succes pentru utilizatorul {UserId}", userId);
                
                return generatedProgram;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la generarea programului personalizat pentru userId: {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<FitnessProgram>> GetRecommendedProgramsAsync(int userId, int count = 3)
        {
            try
            {
                var userProfile = await _profileService.GetProfileByUserIdAsync(userId);
                if (userProfile == null)
                    throw new InvalidOperationException("Utilizatorul nu are un profil creat");

                _logger.LogInformation("Obținere programe recomandate pentru utilizatorul {UserId}", userId);

                // Mapăm valorile din profil la valorile corespunzătoare din programul de fitness
                string gender = userProfile.Sex.ToLower();
                string diet = userProfile.Diet.ToLower();
                string programType = MapObjectiveToProgramType(userProfile.Objective);
                string difficultyLevel = MapExperienceToDifficulty(userProfile.Experience);

                // Găsim programele potrivite
                var query = _context.FitnessPrograms.AsQueryable();

                // Aplicăm filtrul de gen (inclusiv programe unisex)
                query = query.Where(p => p.Gender.ToLower() == gender || p.Gender.ToLower() == "unisex");
                
                // Aplicăm filtrele pentru dietă și tip de program
                query = query.Where(p => p.Diet.ToLower() == diet && p.ProgramType.ToLower() == programType);
                
                // Aplicăm filtrul pentru nivel de dificultate
                query = query.Where(p => p.DifficultyLevel.ToLower() == difficultyLevel);
                
                // Aplicăm filtrele pentru vârstă dacă sunt specificate
                query = query.Where(p => 
                    (p.AgeRangeMin == null || p.AgeRangeMin <= userProfile.Age) &&
                    (p.AgeRangeMax == null || p.AgeRangeMax >= userProfile.Age));

                // Obținem programele recomandate
                var recommendedPrograms = await query.Take(count).ToListAsync();

                _logger.LogInformation("S-au găsit {Count} programe recomandate pentru utilizatorul {UserId}", 
                    recommendedPrograms.Count, userId);

                return recommendedPrograms;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la obținerea programelor recomandate pentru userId: {UserId}", userId);
                throw;
            }
        }

        private string CreateDetailedPrompt(UserProfile profile, string exercisesJson)
        {
            // Construim un prompt detaliat cu toate informațiile necesare
            return $@"
Creează un program de fitness personalizat în format JSON pentru un utilizator cu următoarele caracteristici:

PROFILUL UTILIZATORULUI:
- Vârstă: {profile.Age} ani
- Sex: {profile.Sex}
- Înălțime: {profile.Height} cm
- Greutate actuală: {profile.Weight} kg
- Greutate țintă: {profile.WeightGoal} kg
- Nivel de activitate: {profile.ActivityLevel}
- Obiectiv principal: {profile.Objective}
- Dietă: {profile.Diet}
- Experiență în fitness: {profile.Experience}
- Alergii/restricții (dacă există): {profile.AllergiesRestrictions ?? "Niciuna"}

CONTEXTUL:
Creează un program care se adresează exact obiectivelor utilizatorului și este adaptat nivelului său de experiență. 
Programul trebuie să fie realist și realizabil, cu o progresie graduală a intensității și complexității.

EXERCIȚII DISPONIBILE:
Selectează exerciții doar din următoarea listă (nu inventa alte exerciții):
{exercisesJson}

FORMAT DE RĂSPUNS:
Returnează rezultatul strict în formatul JSON următor:
{{
  ""name"": ""Numele programului"",
  ""description"": ""Descriere detaliată despre ce face programul și cum ajută la atingerea obiectivelor utilizatorului"",
  ""gender"": ""{profile.Sex}"",
  ""diet"": ""{profile.Diet}"",
  ""programType"": ""{"'slabit' sau 'fit' sau 'masa'"}"",
  ""difficultyLevel"": ""{"'începător' sau 'intermediar' sau 'avansat'"}"",
  ""durationWeeks"": 8,
  ""workoutsPerWeek"": 4,
  ""ageRangeMin"": {Math.Max(15, profile.Age - 5)},
  ""ageRangeMax"": {Math.Min(120, profile.Age + 5)},
  ""goals"": ""Obiectivele specifice ale programului"",
  ""requiredEquipment"": ""Lista de echipamente necesare"",
  ""workoutDays"": [
    {{
      ""name"": ""Ziua 1 - Denumirea antrenamentului"",
      ""dayOfWeek"": 1,
      ""durationMinutes"": 60,
      ""notes"": ""Note pentru ziua de antrenament"",
      ""exerciseWorkouts"": [
        {{
          ""exerciseId"": ID_EXERCIȚIU_DIN_LISTA,
          ""order"": 1,
          ""sets"": 3,
          ""reps"": 12,
          ""restSeconds"": 60,
          ""notes"": ""Note despre cum să execute exercițiul corect""
        }},
        // Adaugă toate exercițiile pentru această zi
      ]
    }},
    // Adaugă toate zilele de antrenament pentru programa săptămânală
  ]
}}

REGULI IMPORTANTE:
1. Folosește DOAR exerciții din lista furnizată, cu ID-urile corecte
2. Adaptează numărul de antrenamente și intensitatea la nivelul de experiență al utilizatorului
3. Incluzi perioadele adecvate de odihnă între antrenamentele pentru aceleași grupe musculare
4. Asigură-te că programul este aliniat cu dieta și obiceiurile utilizatorului
5. Creează un JSON valid care poate fi deserializat direct

Răspunde DOAR cu JSON-ul, fără explicații suplimentare.
";
        }

        private FitnessProgram ParseProgramFromResponse(string response, int userId)
        {
            try
            {
                // Încercăm să extragem doar partea JSON din răspuns
                // Uneori LLM-urile pot adăuga text explicativ înainte sau după JSON
                var jsonMatch = Regex.Match(response, @"\{[\s\S]*\}", RegexOptions.Singleline);
                
                string jsonContent = jsonMatch.Success ? jsonMatch.Value : response;
                
                _logger.LogInformation("Parsare răspuns JSON pentru utilizatorul {UserId}", userId);
                
                // Opțiuni pentru deserializare
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    AllowTrailingCommas = true,
                    ReadCommentHandling = JsonCommentHandling.Skip
                };
                
                // Deserializăm JSON-ul direct într-un obiect FitnessProgram
                var program = JsonSerializer.Deserialize<FitnessProgramDto>(jsonContent, options);
                
                if (program == null)
                    throw new InvalidOperationException("Nu s-a putut deserializa răspunsul în format JSON");
                
                // Convertim DTO în entitate FitnessProgram
                var fitnessProgram = new FitnessProgram
                {
                    Name = program.Name,
                    Description = program.Description,
                    Gender = program.Gender,
                    Diet = program.Diet,
                    ProgramType = program.ProgramType,
                    DifficultyLevel = program.DifficultyLevel,
                    DurationWeeks = program.DurationWeeks,
                    WorkoutsPerWeek = program.WorkoutsPerWeek,
                    AgeRangeMin = program.AgeRangeMin,
                    AgeRangeMax = program.AgeRangeMax,
                    Goals = program.Goals,
                    RequiredEquipment = program.RequiredEquipment,
                    ImageUrl = "/images/programs/default-program.jpg", // Imagine implicită
                    WorkoutDays = program.WorkoutDays.Select(d => new WorkoutDay
                    {
                        Name = d.Name,
                        DayOfWeek = d.DayOfWeek,
                        DurationMinutes = d.DurationMinutes,
                        Notes = d.Notes,
                        ExerciseWorkouts = d.ExerciseWorkouts.Select(e => new ExerciseWorkout
                        {
                            ExerciseId = e.ExerciseId,
                            Order = e.Order,
                            Sets = e.Sets,
                            Reps = e.Reps,
                            RestSeconds = e.RestSeconds,
                            Notes = e.Notes
                        }).ToList()
                    }).ToList()
                };
                
                return fitnessProgram;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Eroare la deserializarea răspunsului JSON pentru userId: {UserId}. Răspuns: {Response}", userId, response);
                throw new InvalidOperationException("Nu s-a putut procesa răspunsul de la serviciul AI", ex);
            }
        }

        private void ValidateGeneratedProgram(FitnessProgram program, List<Exercise> availableExercises)
        {
            _logger.LogInformation("Validare program generat");
            
            // Verifică dacă programul conține toate informațiile esențiale
            if (string.IsNullOrEmpty(program.Name) || string.IsNullOrEmpty(program.Description))
                throw new InvalidOperationException("Programul generat nu conține numele sau descrierea");
                
            if (program.WorkoutDays == null || !program.WorkoutDays.Any())
                throw new InvalidOperationException("Programul generat nu conține zile de antrenament");
                
            // Verifică fiecare zi de antrenament
            foreach (var day in program.WorkoutDays)
            {
                if (day.ExerciseWorkouts == null || !day.ExerciseWorkouts.Any())
                    throw new InvalidOperationException($"Ziua de antrenament {day.Name} nu conține exerciții");
                
                // Verifică fiecare exercițiu
                foreach (var exerciseWorkout in day.ExerciseWorkouts)
                {
                    // Verifică dacă exercițiul există în lista de exerciții disponibile
                    var exerciseExists = availableExercises.Any(e => e.Id == exerciseWorkout.ExerciseId);
                    if (!exerciseExists)
                        throw new InvalidOperationException($"Exercițiul cu ID-ul {exerciseWorkout.ExerciseId} nu există în baza de date");
                        
                    // Verifică dacă seturile și repetările sunt în intervale rezonabile
                    if (exerciseWorkout.Sets < 1 || exerciseWorkout.Sets > 10)
                        exerciseWorkout.Sets = 3; // Valoare implicită
                        
                    if (exerciseWorkout.Reps < 1 || exerciseWorkout.Reps > 100)
                        exerciseWorkout.Reps = 10; // Valoare implicită
                        
                    if (exerciseWorkout.RestSeconds < 0 || exerciseWorkout.RestSeconds > 300)
                        exerciseWorkout.RestSeconds = 60; // Valoare implicită
                }
            }
            
            _logger.LogInformation("Validare program completată cu succes");
        }

        private async Task SaveGeneratedProgram(FitnessProgram program)
        {
            _logger.LogInformation("Salvare program generat în baza de date");
            
            // Asigură-te că entitățile au ID-uri noi (0 sau null)
            program.Id = 0;
            
            foreach (var day in program.WorkoutDays)
            {
                day.Id = 0;
                day.ProgramId = 0; // Va fi setat automat când se salvează programul
                
                foreach (var exercise in day.ExerciseWorkouts)
                {
                    exercise.Id = 0;
                    exercise.WorkoutDayId = 0; // Va fi setat automat când se salvează ziua de antrenament
                }
            }
            
            // Adaugă programul în baza de date
            _context.FitnessPrograms.Add(program);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("Program salvat cu succes, ID: {ProgramId}", program.Id);
        }

        private string MapObjectiveToProgramType(string objective)
        {
            return objective.ToLower() switch
            {
                "slăbire" => "slabit",
                "pierdere în greutate" => "slabit",
                "masă musculară" => "masa",
                "creșterea masei musculare" => "masa",
                "tonifiere" => "fit",
                "menținere" => "fit",
                _ => "fit"  // valoare implicită
            };
        }

        private string MapExperienceToDifficulty(string experience)
        {
            return experience.ToLower() switch
            {
                "beginner" => "începător",
                "începător" => "începător",
                "intermediate" => "intermediar",
                "intermediar" => "intermediar",
                "advanced" => "avansat",
                "avansat" => "avansat",
                _ => "intermediar"  // valoare implicită
            };
        }
    }

    // Clase DTO pentru deserializarea răspunsului JSON
    public class FitnessProgramDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Gender { get; set; }
        public string Diet { get; set; }
        public string ProgramType { get; set; }
        public string DifficultyLevel { get; set; }
        public int DurationWeeks { get; set; }
        public int WorkoutsPerWeek { get; set; }
        public int? AgeRangeMin { get; set; }
        public int? AgeRangeMax { get; set; }
        public string Goals { get; set; }
        public string RequiredEquipment { get; set; }
        public List<WorkoutDayDto> WorkoutDays { get; set; } = new List<WorkoutDayDto>();
    }

    public class WorkoutDayDto
    {
        public string Name { get; set; }
        public int DayOfWeek { get; set; }
        public int DurationMinutes { get; set; }
        public string Notes { get; set; }
        public List<ExerciseWorkoutDto> ExerciseWorkouts { get; set; } = new List<ExerciseWorkoutDto>();
    }

    public class ExerciseWorkoutDto
    {
        public int ExerciseId { get; set; }
        public int Order { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public int RestSeconds { get; set; }
        public string Notes { get; set; }
    }
}