using FitnessApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.API.Data
{
    public static class ProgramSeedData
    {
        public static void SeedPrograms(this ModelBuilder modelBuilder)
        {
            // Program 1: Pentru slăbit - Femeie
            modelBuilder.Entity<FitnessProgram>().HasData(new FitnessProgram
            {
                Id = 1,
                Name = "Program de Slăbit pentru Femei",
                Gender = "femeie",
                Diet = "vegetarian",
                ProgramType = "slabit",
                DifficultyLevel = "începător",
                DurationWeeks = 8,
                WorkoutsPerWeek = 4,
                AgeRangeMin = 18,
                AgeRangeMax = 60,
                Description = "Program de 8 săptămâni pentru femei, conceput pentru pierderea în greutate prin combinarea exercițiilor cardio cu antrenamente de rezistență. Acest program se concentrează pe crearea unui deficit caloric și tonifierea întregului corp.",
                Goals = "Pierdere în greutate, îmbunătățirea condiției fizice, tonifierea musculară",
                RequiredEquipment = "Benzi elastice, gantere ușoare, saltea de fitness",
                ImageUrl = "/images/programs/female-weight-loss.jpg"
            });

            // Ziua 1 - Cardio și Partea Inferioară 
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 1,
                ProgramId = 1,
                Name = "Ziua 1 - Cardio și Partea Inferioară",
                DayOfWeek = 1, // Luni
                DurationMinutes = 45,
                Notes = "Focus pe intensitate moderată și volum ridicat pentru arderea caloriilor"
            });

            // Ziua 2 - Partea Superioară și Core
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 2,
                ProgramId = 1,
                Name = "Ziua 2 - Partea Superioară și Core",
                DayOfWeek = 3, // Miercuri
                DurationMinutes = 40,
                Notes = "Concentrare pe tonifierea brațelor, spatelui și zonei abdominale"
            });

            // Ziua 3 - Full Body HIIT
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 3,
                ProgramId = 1,
                Name = "Ziua 3 - Full Body HIIT",
                DayOfWeek = 5, // Vineri
                DurationMinutes = 30,
                Notes = "Antrenament de înaltă intensitate pentru maximizarea arderilor de calorii"
            });

            // Ziua 4 - Mobilitate și Stretching Activ
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 4,
                ProgramId = 1,
                Name = "Ziua 4 - Mobilitate și Stretching Activ",
                DayOfWeek = 6, // Sâmbătă
                DurationMinutes = 35,
                Notes = "Focus pe recuperare, flexibilitate și mobilitate"
            });

            // Program 2: Pentru masă musculară - Bărbat
            modelBuilder.Entity<FitnessProgram>().HasData(new FitnessProgram
            {
                Id = 2,
                Name = "Program de Masă Musculară pentru Bărbați",
                Gender = "barbat",
                Diet = "carnivor",
                ProgramType = "masa",
                DifficultyLevel = "intermediar",
                DurationWeeks = 12,
                WorkoutsPerWeek = 5,
                AgeRangeMin = 18,
                AgeRangeMax = 45,
                Description = "Program de 12 săptămâni pentru bărbați, conceput pentru creșterea masei musculare. Utilizează principiile hipertrofiei progresive, combinând exerciții compuse grele cu izolări specifice pentru maximizarea creșterii musculare.",
                Goals = "Creșterea masei musculare, îmbunătățirea forței, dezvoltarea proporțională a corpului",
                RequiredEquipment = "Haltere, bare, bancă de fitness, aparat cablu",
                ImageUrl = "/images/programs/male-muscle-building.jpg"
            });

            // Ziua 1 - Piept și Triceps
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 5,
                ProgramId = 2,
                Name = "Ziua 1 - Piept și Triceps",
                DayOfWeek = 1, // Luni
                DurationMinutes = 60,
                Notes = "Focus pe exerciții compuse pentru piept cu volume mai mari pentru triceps"
            });

            // Ziua 2 - Spate și Biceps
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 6,
                ProgramId = 2,
                Name = "Ziua 2 - Spate și Biceps",
                DayOfWeek = 2, // Marți
                DurationMinutes = 60,
                Notes = "Accent pe lățimea și grosimea spatelui, urmat de izolări pentru biceps"
            });

            // Ziua 3 - Picioare
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 7,
                ProgramId = 2,
                Name = "Ziua 3 - Picioare",
                DayOfWeek = 4, // Joi
                DurationMinutes = 70,
                Notes = "Antrenament complet pentru picioare cu accent pe cvadricepși, ischiocruralii și fesieri"
            });

            // Ziua 4 - Umeri și Abdomen
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 8,
                ProgramId = 2,
                Name = "Ziua 4 - Umeri și Abdomen",
                DayOfWeek = 5, // Vineri
                DurationMinutes = 60,
                Notes = "Dezvoltarea tuturor celor trei capete ale deltoidului și consolidarea zonei centrale"
            });

            // Ziua 5 - Full Body (Accent pe Puncte Slabe)
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 9,
                ProgramId = 2,
                Name = "Ziua 5 - Full Body (Accent pe Puncte Slabe)",
                DayOfWeek = 6, // Sâmbătă
                DurationMinutes = 50,
                Notes = "Antrenament personalizabil care se concentrează pe grupele musculare care necesită atenție suplimentară"
            });

            // Program 3: Fitness General - Unisex
            modelBuilder.Entity<FitnessProgram>().HasData(new FitnessProgram
            {
                Id = 3,
                Name = "Program de Fitness General Unisex",
                Gender = "unisex",
                Diet = "vegetarian",
                ProgramType = "fit",
                DifficultyLevel = "începător",
                DurationWeeks = 6,
                WorkoutsPerWeek = 3,
                AgeRangeMin = 18,
                AgeRangeMax = 65,
                Description = "Program de 6 săptămâni pentru îmbunătățirea condiției fizice generale, potrivit pentru toate nivelurile de fitness. Combină antrenamentele de forță cu exerciții cardio pentru o abordare echilibrată a fitness-ului.",
                Goals = "Îmbunătățirea condiției fizice generale, tonifiere ușoară, creșterea energiei și vitalității",
                RequiredEquipment = "Gantere ușoare, bandă elastică, saltea de fitness",
                ImageUrl = "/images/programs/general-fitness.jpg"
            });

            // Ziua 1 - Full Body Strength
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 10,
                ProgramId = 3,
                Name = "Ziua 1 - Full Body Strength",
                DayOfWeek = 1, // Luni
                DurationMinutes = 45,
                Notes = "Antrenament de forță pentru întregul corp cu accent pe tehnica corectă"
            });

            // Ziua 2 - Cardio & Core
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 11,
                ProgramId = 3,
                Name = "Ziua 2 - Cardio & Core",
                DayOfWeek = 3, // Miercuri
                DurationMinutes = 40,
                Notes = "Combinație de exerciții cardio cu intervale și antrenament pentru zona mediană"
            });

            // Ziua 3 - Mobilitate & Forță
            modelBuilder.Entity<WorkoutDay>().HasData(new WorkoutDay
            {
                Id = 12,
                ProgramId = 3,
                Name = "Ziua 3 - Mobilitate & Forță",
                DayOfWeek = 5, // Vineri
                DurationMinutes = 50,
                Notes = "Focus pe mobilitate și exerciții funcționale de forță"
            });

            // Adăugare exerciții pentru primul program (slăbit femei) - Ziua 1
            // Exercițiu 1: Genuflexiuni cu bandă elastică
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 1,
                WorkoutDayId = 1,
                ExerciseId = 5, // Genuflexiuni
                Order = 1,
                Sets = 3,
                Reps = 15,
                RestSeconds = 45,
                Notes = "Folosiți o bandă elastică plasată deasupra genunchilor pentru rezistență suplimentară"
            });

            // Exercițiu 2: Lunges cu gantere
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 2,
                WorkoutDayId = 1,
                ExerciseId = 6, // Lunges
                Order = 2,
                Sets = 3,
                Reps = 12,
                RestSeconds = 45,
                Notes = "Alternați picioarele la fiecare repetiție"
            });

            // Exercițiu 3: Burpees
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 3,
                WorkoutDayId = 1,
                ExerciseId = 14, // Burpees
                Order = 3,
                Sets = 3,
                Reps = 10,
                RestSeconds = 60,
                Notes = "Versiune modificată pentru începători: fără flotare și fără săritură"
            });

            // Exercițiu 4: Alergare pe loc
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 4,
                WorkoutDayId = 1,
                ExerciseId = 13, // Alergare
                Order = 4,
                Sets = 2,
                Duration = "2 minute",
                RestSeconds = 60,
                Notes = "Menține un ritm ridicat pentru cardio"
            });

            // Exercițiu 5: Stretching pentru ischiocruralii
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 5,
                WorkoutDayId = 1,
                ExerciseId = 15, // Stretching pentru Ischiocruralii
                Order = 5,
                Sets = 2,
                Duration = "30 secunde",
                RestSeconds = 15,
                Notes = "Mențineți poziția și respirați profund"
            });

            // Adăugare exerciții pentru primul program (slăbit femei) - Ziua 2
            // Exercițiu 1: Flotări modificate
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 6,
                WorkoutDayId = 2,
                ExerciseId = 2, // Flotări
                Order = 1,
                Sets = 3,
                Reps = 10,
                RestSeconds = 45,
                Notes = "Efectuați flotări cu genunchii pe sol dacă este necesar"
            });

            // Exercițiu 2: Ridicări laterale cu gantere
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 7,
                WorkoutDayId = 2,
                ExerciseId = 11, // Ridicări Laterale
                Order = 2,
                Sets = 3,
                Reps = 12,
                RestSeconds = 45,
                Notes = "Folosiți gantere ușoare și concentrate-vă pe tehnică"
            });

            // Exercițiu 3: Planșă
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 8,
                WorkoutDayId = 2,
                ExerciseId = 8, // Planșă
                Order = 3,
                Sets = 3,
                Duration = "30 secunde",
                RestSeconds = 45,
                Notes = "Mențineți o linie dreaptă de la umeri la călcâie"
            });

            // Exercițiu 4: Crunch-uri
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 9,
                WorkoutDayId = 2,
                ExerciseId = 7, // Crunch-uri
                Order = 4,
                Sets = 3,
                Reps = 15,
                RestSeconds = 45,
                Notes = "Concentrați-vă pe contracția abdomenului la fiecare repetiție"
            });

            // Pentru programul de masă musculară - Ziua 1
            // Exercițiu 1: Împins la piept cu haltere
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 10,
                WorkoutDayId = 5,
                ExerciseId = 1, // Împins la Piept cu Haltere
                Order = 1,
                Sets = 4,
                Reps = 10,
                RestSeconds = 90,
                Weight = 20, // kg per halteră, se ajustează în funcție de nivel
                Notes = "Folosiți o greutate care vă permite să efectuați 10 repetări cu efort"
            });

            // Exercițiu 2: Flotări
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 11,
                WorkoutDayId = 5,
                ExerciseId = 2, // Flotări
                Order = 2,
                Sets = 3,
                Reps = 15,
                RestSeconds = 60,
                Notes = "Efectuați până la eșec pe ultimul set"
            });

            // Exercițiu 3: Extensii de triceps
            modelBuilder.Entity<ExerciseWorkout>().HasData(new ExerciseWorkout
            {
                Id = 12,
                WorkoutDayId = 5,
                ExerciseId = 10, // Extensii de Triceps
                Order = 3,
                Sets = 3,
                Reps = 12,
                RestSeconds = 60,
                Weight = 15, // kg
                Notes = "Concentrați-vă pe contracția tricepsului la vârful mișcării"
            });
        }
    }
}