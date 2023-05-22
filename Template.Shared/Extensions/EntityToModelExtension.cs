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
                LastUpdateOnDt = entity.LastUpdateOnDt,
                Followers = entity.Followers.Count,
                Following = entity.Following.Count,
            };

        public static PostModel ToModel(this PostEntity entity) =>
            new()
            {
                PublicId = entity.PublicId.ToString(),
                Description = entity.Description,
                CreatedOnDt = entity.CreatedOnDt,
                Follows = entity.Follows.Count,
            };

        public static List<PostModel> ToModelList(this IEnumerable<PostEntity> list) =>
            list
                .Select(entity => entity
                .ToModel())
                .ToList();


        public static List<UserModel> ToModelList(this IEnumerable<UserEntity> list) =>
            list
                .Select(entity => entity
                .ToModel())
                .ToList();
    }
}