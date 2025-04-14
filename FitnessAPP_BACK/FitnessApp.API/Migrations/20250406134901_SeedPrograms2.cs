using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FitnessApp.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedPrograms2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ExerciseWorkouts",
                columns: new[] { "Id", "Duration", "ExerciseId", "Notes", "Order", "Reps", "RestSeconds", "Sets", "Technique", "Weight", "WorkoutDayId" },
                values: new object[,]
                {
                    { 101, null, 14, "Execută fără pauză între repetări, doar între seturi", 1, 12, 30, 3, null, null, 3 },
                    { 102, null, 5, "Execută rapid, dar cu formă corectă", 2, 15, 30, 3, null, null, 3 },
                    { 103, null, 7, "Concentrează-te pe contracția abdominală", 3, 20, 30, 3, null, null, 3 },
                    { 104, null, 2, "Flotări normale sau de pe genunchi, în funcție de nivel", 4, 10, 30, 3, null, null, 3 },
                    { 105, "2 minute", 13, "Alergare pe loc sau sărituri cu coarda", 5, 10, 60, 1, null, null, 3 },
                    { 106, "30 secunde", 15, "Întinde-te doar până la punctul confortabil", 1, 10, 15, 3, null, null, 4 },
                    { 107, "45 secunde", 8, "Menține poziția corectă a corpului pe toată durata", 2, 10, 30, 3, null, null, 4 },
                    { 108, null, 5, "Execută lent, concentrându-te pe mobilitatea șoldului", 3, 15, 30, 2, null, null, 4 },
                    { 109, null, 3, "Executare până la eșec, folosește bandă elastică pentru asistență dacă e necesar", 1, 8, 90, 4, null, null, 6 },
                    { 110, null, 4, "Menține spatele drept, trage halterele spre abdomen", 2, 12, 60, 4, null, 20.0, 6 },
                    { 111, null, 9, "Execută controlat, fără balans", 3, 12, 60, 4, null, 15.0, 6 },
                    { 112, null, 5, "Încălzește-te cu seturi progresive. Coboară până treci de paralel.", 1, 8, 120, 5, null, 80.0, 7 },
                    { 113, null, 6, "Execută 10 repetări pe fiecare picior", 2, 10, 90, 3, null, 40.0, 7 },
                    { 114, null, 15, "Folosește aparatul pentru flexii de genunchi", 3, 12, 90, 3, null, 50.0, 7 },
                    { 115, null, 12, "Alternează între împins cu halteră și împins cu ganterele", 1, 10, 90, 4, null, 25.0, 8 },
                    { 116, null, 11, "Execută controlat, fără balans", 2, 15, 60, 4, null, 10.0, 8 },
                    { 117, null, 7, "Concentrează-te pe contracția abdominală completă", 3, 20, 60, 4, null, null, 8 },
                    { 118, "60 secunde", 8, "Menține poziția corectă, fără lăsarea șoldurilor", 4, 10, 60, 3, null, null, 8 },
                    { 119, null, 1, "Concentrează-te pe partea din piept care necesită atenție suplimentară", 1, 12, 60, 3, null, 25.0, 9 },
                    { 120, null, 4, "Concentrează-te pe partea din spate care necesită atenție suplimentară", 2, 12, 60, 3, null, 25.0, 9 },
                    { 121, null, 5, "Concentrează-te pe aspectele ce necesită îmbunătățire", 3, 15, 60, 3, null, 60.0, 9 },
                    { 122, null, 2, "Execută cu formă corectă, modifică în funcție de nivel", 1, 10, 60, 3, null, null, 10 },
                    { 123, null, 5, "Coboară până când coapsele sunt paralele cu solul", 2, 15, 60, 3, null, null, 10 },
                    { 124, null, 4, "Folosește ganterele dacă sunt disponibile, sau improvizează cu obiecte de acasă", 3, 12, 60, 3, null, null, 10 },
                    { 125, null, 7, "Concentrează-te pe abdomen, nu pe gât", 4, 15, 45, 3, null, null, 10 },
                    { 126, "10 minute", 13, "Alergare ușoară sau mers alert pentru încălzire", 1, 10, 60, 1, null, null, 11 },
                    { 127, null, 14, "Execută la ritm propriu, adaptează după nivel", 2, 10, 30, 3, null, null, 11 },
                    { 128, "30 secunde", 8, "Menține poziția corectă a șoldurilor", 3, 10, 30, 3, null, null, 11 },
                    { 129, null, 7, "Controlează mișcarea, evită impulsul", 4, 20, 30, 3, null, null, 11 },
                    { 130, "30 secunde", 15, "Încălzire pentru mobilitatea șoldurilor și a picioarelor", 1, 10, 15, 2, null, null, 12 },
                    { 131, null, 6, "10 repetări pe fiecare picior, pas mare înainte", 2, 10, 45, 3, null, null, 12 },
                    { 132, null, 11, "Folosește greutăți ușoare sau sticle cu apă", 3, 12, 45, 3, null, null, 12 },
                    { 133, null, 9, "Folosește ganterele sau obiecte de acasă ca greutăți", 4, 12, 45, 3, null, null, 12 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 104);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 105);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 106);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 107);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 108);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 109);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 110);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 111);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 112);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 113);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 114);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 115);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 116);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 117);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 118);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 119);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 120);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 121);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 122);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 123);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 124);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 125);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 126);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 127);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 128);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 129);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 130);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 131);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 132);

            migrationBuilder.DeleteData(
                table: "ExerciseWorkouts",
                keyColumn: "Id",
                keyValue: 133);
        }
    }
}
