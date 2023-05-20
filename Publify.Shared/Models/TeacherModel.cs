using System.ComponentModel.DataAnnotations.Schema;

namespace Publify.Shared.Models;

public class TeacherModel 
{
    public string Id { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateTime CreatedOnDt { get; set; } = DateTime.Now;

    public DateTime LastUpdateOnDt { get; set; } = DateTime.Now;

    public string FullName => $"{FirstName} {LastName}";
}