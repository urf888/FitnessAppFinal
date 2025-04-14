using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDietAndExperienceToProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Diet",
                table: "UserProfiles",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Experience",
                table: "UserProfiles",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Diet",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "Experience",
                table: "UserProfiles");
        }
    }
}
