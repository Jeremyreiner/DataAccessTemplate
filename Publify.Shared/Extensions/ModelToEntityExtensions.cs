using Publify.Shared.Entities;
using Publify.Shared.Models;

namespace Publify.Shared.Extensions
{
    public static class ModelToEntityExtensions
    {
        public static TeacherEntity ToEntity(this TeacherModel model) =>
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
