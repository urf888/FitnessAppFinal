using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWeightGoalToUserProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "WeightGoal",
                table: "UserProfiles",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WeightGoal",
                table: "UserProfiles");
        }
    }
}
