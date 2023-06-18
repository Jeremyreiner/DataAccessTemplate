using Template.Shared.Models;
using Template.Shared.Entities;

namespace Template.Shared.Extensions;


public static class ModelToEntityExtensions
{
    public static UserEntity ToEntity(this UserModel model) =>
        new()
        {
            PublicId = ValidateGuid(model.Id),
            FirstName = model.FirstName,
            LastName = model.LastName,
            Bio = model.Bio,
            Email = model.Email,
            CreatedOnDt = model.CreatedOnDt,
            LastUpdateOnDt = model.LastUpdateOnDt,
        };

    public static PostEntity ToEntity(this PostModel model) =>
        new()
        {
            PublicId = ValidateGuid(model.PublicId),
            UserPublicId = ValidateGuid(model.UserPublicId),
            Description = model.Description,
            CreatedOnDt = model.CreatedOnDt,
        };

    private static Guid ValidateGuid(string key)
    {
        var valid = Guid.TryParse(key, out var guid);

        return valid 
            ? guid
            : Guid.Empty;
    }
}