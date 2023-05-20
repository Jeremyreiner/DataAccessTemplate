using Publify.Shared.Entities;
using Publify.Shared.Models;

namespace Publify.Shared.Extensions
{
    public static class EntityToModelExtension
    {
        public static TeacherModel ToModel(this TeacherEntity entity) =>
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

        public static List<TeacherModel> ToModelList(this IEnumerable<TeacherEntity> list) =>
            list
                .Select(entity => entity
                .ToModel())
                .ToList();
    }
}