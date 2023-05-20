using Template.Shared.Entities;
using Template.Shared.Models;

namespace Template.Shared.Extensions
{
    public static class EntityToModelExtension
    {
        public static UserModel ToModel(this UserEntity entity) =>
            new()
            {
                Id = entity.PublicId.ToString(),
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Bio = entity.Bio,
                Email = entity.Email,
                CreatedOnDt = entity.CreatedOnDt,
                LastUpdateOnDt = entity.LastUpdateOnDt
            };

        public static List<UserModel> ToModelList(this IEnumerable<UserEntity> list) =>
            list
                .Select(entity => entity
                .ToModel())
                .ToList();
    }
}