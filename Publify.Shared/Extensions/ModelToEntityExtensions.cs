using Template.Shared.Models;
using Template.Shared.Entities;

namespace Template.Shared.Extensions
{
    public static class ModelToEntityExtensions
    {
        public static UserEntity ToEntity(this UserModel model) =>
            new()
            {
                PublicId = Guid.Parse(model.Id),
                FirstName = model.FirstName,
                LastName = model.LastName,
                Bio = model.Bio,
                Email = model.Email,
                CreatedOnDt = model.CreatedOnDt,
                LastUpdateOnDt = model.LastUpdateOnDt,
            };
    }
}
