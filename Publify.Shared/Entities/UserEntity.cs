using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Publify.Shared.Entities
{
    [Table("Teachers")]
    public class UserEntity
    {

        [Key]
        public Guid PrivateId { get; set; }

        public Guid PublicId { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public DateTime CreatedOnDt { get; set; } = DateTime.Now;

        public DateTime LastUpdateOnDt { get; set; } = DateTime.Now;

        public string Password { get; set; } = string.Empty;

        [NotMapped] 
        public string FullName => $"{FirstName} {LastName}";

        [NotMapped] 
        public Records.Records.PublicId PublicRecord => new(PublicId);

    }
}
