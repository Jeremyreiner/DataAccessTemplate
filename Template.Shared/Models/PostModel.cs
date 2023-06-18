namespace Template.Shared.Models;

public class PostModel
{
    public string PublicId { get; set; } = string.Empty;

    public string UserPublicId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedOnDt { get; set; }

    public int Likes { get; set; }
}