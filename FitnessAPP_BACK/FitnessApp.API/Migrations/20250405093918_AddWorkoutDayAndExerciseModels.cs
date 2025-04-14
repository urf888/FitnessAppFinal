using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitnessApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkoutDayAndExerciseModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "FitnessPrograms",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "FitnessPrograms",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "AgeRangeMax",
                table: "FitnessPrograms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AgeRangeMin",
                table: "FitnessPrograms",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DifficultyLevel",
                table: "FitnessPrograms",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DurationWeeks",
                table: "FitnessPrograms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Goals",
                table: "FitnessPrograms",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequiredEquipment",
                table: "FitnessPrograms",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "WorkoutsPerWeek",
                table: "FitnessPrograms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DifficultyLevel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Instructions = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    VideoUrl = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TargetMuscles = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SecondaryMuscles = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Equipment = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkoutDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProgramId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkoutDays_FitnessPrograms_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "FitnessPrograms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExerciseWorkouts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExerciseId = table.Column<int>(type: "int", nullable: false),
                    WorkoutDayId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Sets = table.Column<int>(type: "int", nullable: false),
                    Reps = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Weight = table.Column<double>(type: "float", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Technique = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    RestSeconds = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseWorkouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExerciseWorkouts_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ExerciseWorkouts_WorkoutDays_WorkoutDayId",
                        column: x => x.WorkoutDayId,
                        principalTable: "WorkoutDays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "Category", "Description", "DifficultyLevel", "Equipment", "ImageUrl", "Instructions", "Name", "SecondaryMuscles", "TargetMuscles", "VideoUrl" },
                values: new object[,]
                {
                    { 1, "piept", "Exercițiu compus pentru piept, umeri și triceps.", "intermediar", "haltere, bancă", null, "1. Așezați-vă pe o bancă plată, cu picioarele pe podea. 2. Țineți halterele deasupra pieptului, cu palmele îndreptate înainte. 3. Coborâți halterele până când ating părțile laterale ale pieptului. 4. Împingeți halterele înapoi în poziția inițială.", "Împins la Piept cu Haltere", "triceps", "pectorali, deltoid anterior", null },
                    { 2, "piept", "Exercițiu de bază pentru partea superioară a corpului care utilizează greutatea corporală.", "începător", "niciunul", null, "1. Începeți în poziția de planșă, cu mâinile plasate puțin mai lat decât lățimea umerilor. 2. Coborâți corpul menținând o linie dreaptă de la cap la călcâie. 3. Opriți-vă când pieptul este la câțiva centimetri de sol. 4. Împingeți înapoi în poziția inițială.", "Flotări", "triceps, abdomen, mușchii spatelui", "pectorali, deltoid anterior", null },
                    { 3, "spate", "Exercițiu compus pentru lățimea spatelui și forța părții superioare a corpului.", "intermediar", "bară de tracțiuni", null, "1. Agățați-vă de bară cu palmele îndreptate în afară și mâinile plasate mai lat decât lățimea umerilor. 2. Trageți corpul în sus până când bărbia trece de bară. 3. Coborâți încet înapoi în poziția inițială.", "Tracțiuni la Bară", "biceps, deltoid posterior, rotund", "latissimus dorsi, rhomboid", null },
                    { 4, "spate", "Exercițiu pentru dezvoltarea părții mijlocii a spatelui și a forței de prindere.", "intermediar", "haltere", null, "1. Aplecați-vă în față cu picioarele la lățimea umerilor, ținând o halteră în fiecare mână. 2. Trageți halterele în sus către abdomen, menținând coatele aproape de corp. 3. Strângeți omoplații la sfârșit, apoi coborâți greutățile controlat.", "Vâslit cu Halteră", "biceps, deltoid posterior", "latissimus dorsi, rhomboid, trapez", null },
                    { 5, "picioare", "Exercițiu compus pentru dezvoltarea forței picioarelor și a părții inferioare a corpului.", "intermediar", "niciunul sau bară", null, "1. Stați cu picioarele la lățimea umerilor. 2. Coborâți șoldurile ca și cum v-ați așeza pe un scaun, menținând genunchii în linie cu degetele de la picioare. 3. Coborâți până când coapsele sunt paralele cu solul sau mai jos. 4. Împingeți prin călcâie pentru a reveni la poziția inițială.", "Genuflexiuni", "ischiocruralii, adductori, mușchii spatelui", "cvadriceps, gluteus maximus", null },
                    { 6, "picioare", "Exercițiu unilateral pentru picioare care vizează cvadricepsii, fesierii și ischiocruralii.", "intermediar", "niciunul sau gantere", null, "1. Stați în picioare cu picioarele la lățimea șoldurilor. 2. Faceți un pas mare înainte cu un picior. 3. Coborâți corpul până când ambii genunchi sunt îndoiți la aproximativ 90 de grade. 4. Împingeți prin piciorul din față pentru a reveni la poziția inițială.", "Lunges", "ischiocruralii, mușchii gambei", "cvadriceps, gluteus maximus", null },
                    { 7, "abdomen", "Exercițiu de bază pentru zona abdominală superioară.", "începător", "niciunul", null, "1. Întindeți-vă pe spate cu genunchii îndoiți și picioarele pe sol. 2. Puneți mâinile pe piept sau pe lângă cap. 3. Ridicați umerii și partea superioară a spatelui de pe sol, menținând zona lombară pe sol. 4. Coborâți încet înapoi la poziția de start.", "Crunch-uri", "oblicii", "rectus abdominis", null },
                    { 8, "abdomen", "Exercițiu izometric pentru întregul corp care vizează în principal miezul.", "începător", "niciunul", null, "1. Începeți în poziția de flotare, dar sprijinindu-vă pe antebrațe în loc de mâini. 2. Mențineți corpul într-o linie dreaptă de la cap la călcâie. 3. Încordați abdomenul și fesierii. 4. Țineți poziția pentru timpul dorit.", "Planșă", "oblicii, mușchii spatelui, umerii", "rectus abdominis, transversus abdominis", null },
                    { 9, "brațe", "Exercițiu clasic pentru dezvoltarea bicepsului.", "începător", "haltere", null, "1. Stați în picioare cu halterele în mâini, brațele întinse și palmele îndreptate înainte. 2. Îndoiți coatele și ridicați halterele spre umeri. 3. Strângeți bicepsul în partea de sus. 4. Coborâți halterele încet înapoi în poziția inițială.", "Flexii cu Haltera", "brahialis, brahioradialis", "biceps brachii", null },
                    { 10, "brațe", "Exercițiu pentru dezvoltarea mușchilor triceps.", "începător", "halteră", null, "1. Stați în picioare sau așezați cu o halteră ținută cu ambele mâini. 2. Ridicați haltera deasupra capului, cu brațele complet întinse. 3. Coborâți haltera în spatele capului îndoind coatele. 4. Extindeți brațele pentru a ridica haltera înapoi în poziția inițială.", "Extensii de Triceps", "deltoid anterior, deltoid posterior", "triceps brachii", null },
                    { 11, "umeri", "Exercițiu de izolare pentru deltoidul lateral.", "începător", "haltere", null, "1. Stați în picioare cu halterele în mâini de-a lungul corpului. 2. Ridicați halterele lateral până la nivelul umerilor, menținând brațele aproape drepte. 3. Coborâți încet înapoi în poziția inițială.", "Ridicări Laterale", "trapez, deltoid anterior, deltoid posterior", "deltoid lateral", null },
                    { 12, "umeri", "Exercițiu compus pentru dezvoltarea umerilor.", "intermediar", "haltere sau bară", null, "1. Stați în picioare sau așezați ținând halterele la nivelul umerilor. 2. Împingeți halterele în sus până când brațele sunt complet extinse. 3. Coborâți halterele înapoi la nivelul umerilor.", "Împins la Umeri", "deltoid lateral, triceps, trapez superior", "deltoid anterior", null },
                    { 13, "cardio", "Exercițiu cardiovascular de bază pentru îmbunătățirea sănătății inimii și arderea caloriilor.", "intermediar", "niciunul sau bandă de alergare", null, "1. Începeți cu un ritm ușor pentru încălzire. 2. Măriți treptat intensitatea până la ritmul dorit. 3. Mențineți o postură dreaptă, cu umerii relaxați. 4. Aterizați pe mijlocul piciorului, nu pe călcâi.", "Alergare", "mușchii gambei, abdomen, mușchii spatelui", "cvadriceps, ischiocruralii, gluteus maximus", null },
                    { 14, "cardio", "Exercițiu de intensitate ridicată pentru întregul corp.", "avansat", "niciunul", null, "1. Începeți în picioare. 2. Ajungeți într-o poziție de ghemuit. 3. Plasați mâinile pe sol și extindeți picioarele înapoi în poziția de flotare. 4. Faceți o flotare (opțional). 5. Aduceți picioarele înapoi în poziția de ghemuit. 6. Săriți în sus cu mâinile deasupra capului.", "Burpees", "deltoid, triceps, abdomen, ischiocruralii", "cvadriceps, gluteus maximus, pectorali", null },
                    { 15, "mobilitate", "Exercițiu de întindere pentru ischiocruralii și zona lombară.", "începător", "niciunul", null, "1. Așezați-vă pe sol cu picioarele întinse în față. 2. Încercați să atingeți degetele de la picioare, îndoind de la șold și menținând spatele cât mai drept posibil. 3. Țineți poziția timp de 20-30 de secunde. 4. Relaxați-vă și repetați.", "Stretching pentru Ischiocruralii", "zona lombară", "ischiocruralii", null }
                });

            migrationBuilder.InsertData(
                table: "FitnessPrograms",
                columns: new[] { "Id", "AgeRangeMax", "AgeRangeMin", "Description", "Diet", "DifficultyLevel", "DurationWeeks", "Gender", "Goals", "ImageUrl", "Name", "ProgramType", "RequiredEquipment", "WorkoutsPerWeek" },
                values: new object[,]
                {
                    { 1, 60, 18, "Program de 8 săptămâni pentru femei, conceput pentru pierderea în greutate prin combinarea exercițiilor cardio cu antrenamente de rezistență. Acest program se concentrează pe crearea unui deficit caloric și tonifierea întregului corp.", "vegetarian", "începător", 8, "femeie", "Pierdere în greutate, îmbunătățirea condiției fizice, tonifierea musculară", "/images/programs/female-weight-loss.jpg", "Program de Slăbit pentru Femei", "slabit", "Benzi elastice, gantere ușoare, saltea de fitness", 4 },
                    { 2, 45, 18, "Program de 12 săptămâni pentru bărbați, conceput pentru creșterea masei musculare. Utilizează principiile hipertrofiei progresive, combinând exerciții compuse grele cu izolări specifice pentru maximizarea creșterii musculare.", "carnivor", "intermediar", 12, "barbat", "Creșterea masei musculare, îmbunătățirea forței, dezvoltarea proporțională a corpului", "/images/programs/male-muscle-building.jpg", "Program de Masă Musculară pentru Bărbați", "masa", "Haltere, bare, bancă de fitness, aparat cablu", 5 },
                    { 3, 65, 18, "Program de 6 săptămâni pentru îmbunătățirea condiției fizice generale, potrivit pentru toate nivelurile de fitness. Combină antrenamentele de forță cu exerciții cardio pentru o abordare echilibrată a fitness-ului.", "vegetarian", "începător", 6, "unisex", "Îmbunătățirea condiției fizice generale, tonifiere ușoară, creșterea energiei și vitalității", "/images/programs/general-fitness.jpg", "Program de Fitness General Unisex", "fit", "Gantere ușoare, bandă elastică, saltea de fitness", 3 }
                });

            migrationBuilder.InsertData(
                table: "WorkoutDays",
                columns: new[] { "Id", "DayOfWeek", "DurationMinutes", "Name", "Notes", "ProgramId" },
                values: new object[,]
                {
                    { 1, 1, 45, "Ziua 1 - Cardio și Partea Inferioară", "Focus pe intensitate moderată și volum ridicat pentru arderea caloriilor", 1 },
                    { 2, 3, 40, "Ziua 2 - Partea Superioară și Core", "Concentrare pe tonifierea brațelor, spatelui și zonei abdominale", 1 },
                    { 3, 5, 30, "Ziua 3 - Full Body HIIT", "Antrenament de înaltă intensitate pentru maximizarea arderilor de calorii", 1 },
                    { 4, 6, 35, "Ziua 4 - Mobilitate și Stretching Activ", "Focus pe recuperare, flexibilitate și mobilitate", 1 },
                    { 5, 1, 60, "Ziua 1 - Piept și Triceps", "Focus pe exerciții compuse pentru piept cu volume mai mari pentru triceps", 2 },
                    { 6, 2, 60, "Ziua 2 - Spate și Biceps", "Accent pe lățimea și grosimea spatelui, urmat de izolări pentru biceps", 2 },
                    { 7, 4, 70, "Ziua 3 - Picioare", "Antrenament complet pentru picioare cu accent pe cvadricepși, ischiocruralii și fesieri", 2 },
                    { 8, 5, 60, "Ziua 4 - Umeri și Abdomen", "Dezvoltarea tuturor celor trei capete ale deltoidului și consolidarea zonei centrale", 2 },
                    { 9, 6, 50, "Ziua 5 - Full Body (Accent pe Puncte Slabe)", "Antrenament personalizabil care se concentrează pe grupele musculare care necesită atenție suplimentară", 2 },
                    { 10, 1, 45, "Ziua 1 - Full Body Strength", "Antrenament de forță pentru întregul corp cu accent pe tehnica corectă", 3 },
                    { 11, 3, 40, "Ziua 2 - Cardio & Core", "Combinație de exerciții cardio cu intervale și antrenament pentru zona mediană", 3 },
                    { 12, 5, 50, "Ziua 3 - Mobilitate & Forță", "Focus pe mobilitate și exerciții funcționale de forță", 3 }
                });

            migrationBuilder.InsertData(
                table: "ExerciseWorkouts",
                columns: new[] { "Id", "Duration", "ExerciseId", "Notes", "Order", "Reps", "RestSeconds", "Sets", "Technique", "Weight", "WorkoutDayId" },
                values: new object[,]
                {
                    { 1, null, 5, "Folosiți o bandă elastică plasată deasupra genunchilor pentru rezistență suplimentară", 1, 15, 45, 3, null, null, 1 },
                    { 2, null, 6, "Alternați picioarele la fiecare repetiție", 2, 12, 45, 3, null, null, 1 },
                    { 3, null, 14, "Versiune modificată pentru începători: fără flotare și fără săritură", 3, 10, 60, 3, null, null, 1 },
                    { 4, "2 minute", 13, "Menține un ritm ridicat pentru cardio", 4, 10, 60, 2, null, null, 1 },
                    { 5, "30 secunde", 15, "Mențineți poziția și respirați profund", 5, 10, 15, 2, null, null, 1 },
                    { 6, null, 2, "Efectuați flotări cu genunchii pe sol dacă este necesar", 1, 10, 45, 3, null, null, 2 },
                    { 7, null, 11, "Folosiți gantere ușoare și concentrate-vă pe tehnică", 2, 12, 45, 3, null, null, 2 },
                    { 8, "30 secunde", 8, "Mențineți o linie dreaptă de la umeri la călcâie", 3, 10, 45, 3, null, null, 2 },
                    { 9, null, 7, "Concentrați-vă pe contracția abdomenului la fiecare repetiție", 4, 15, 45, 3, null, null, 2 },
                    { 10, null, 1, "Folosiți o greutate care vă permite să efectuați 10 repetări cu efort", 1, 10, 90, 4, null, 20.0, 5 },
                    { 11, null, 2, "Efectuați până la eșec pe ultimul set", 2, 15, 60, 3, null, null, 5 },
                    { 12, null, 10, "Concentrați-vă pe contracția tricepsului la vârful mișcării", 3, 12, 60, 3, null, 15.0, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_Category",
                table: "Exercises",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseWorkouts_ExerciseId",
                table: "ExerciseWorkouts",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseWorkouts_WorkoutDayId",
                table: "ExerciseWorkouts",
                column: "WorkoutDayId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutDays_DayOfWeek",
                table: "WorkoutDays",
                column: "DayOfWeek");

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutDays_ProgramId",
                table: "WorkoutDays",
                column: "ProgramId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseWorkouts");

            migrationBuilder.DropTable(
                name: "Exercises");

            migrationBuilder.DropTable(
                name: "WorkoutDays");

            migrationBuilder.DeleteData(
                table: "FitnessPrograms",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FitnessPrograms",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FitnessPrograms",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "AgeRangeMax",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "AgeRangeMin",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "DifficultyLevel",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "DurationWeeks",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "Goals",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "RequiredEquipment",
                table: "FitnessPrograms");

            migrationBuilder.DropColumn(
                name: "WorkoutsPerWeek",
                table: "FitnessPrograms");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "FitnessPrograms",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "FitnessPrograms",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000);
        }
    }
}
