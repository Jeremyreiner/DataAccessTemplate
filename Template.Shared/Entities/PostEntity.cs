using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Template.Shared.Entities;


[Table("Posts")]
public class PostEntity
{
    public PostEntity()
    {
        Follows = new HashSet<UserEntity>();
    }

    [Key]
    public Guid PrivateId { get; set; }

    public Guid PublicId { get; set; }

    public Guid UserEntityId { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedOnDt { get; set; } = DateTime.Now;

    public DateTime LastUpdateOnDt { get; set; } = DateTime.Now;

    public ICollection<UserEntity> Follows { get; set; }
}