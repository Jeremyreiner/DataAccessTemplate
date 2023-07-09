using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IServices;
using Template.Shared.Models;

namespace Template.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        readonly IDalService _DalService;

        public UserController(IDalService dalService)
        {
            _DalService = dalService;
        }

        [HttpPost("Create")]
        public async Task<Guid> CreateAsync()
        {
            var user = new UserModel
            {
                Id = Guid.Empty.ToString(),
                FirstName = Faker.Name.First(),
                LastName = Faker.Name.Last(),
                Bio = Faker.Lorem.Paragraph(1),
                Email = Faker.Internet.Email(),
                Followers = 0,
                Following = 0,
                CreatedOnDt = default,
                LastUpdateOnDt = default
            };

            var result = await _DalService.CreatorManagerAsync(ClassType.User, user);

            return result;
        }

        [HttpPost("LogIn")]
        public async Task<UserModel?> Login(string email, string password)
        {
            var result = await _DalService.Login(email, password);

            return result?.ToModel();
        }

        [HttpPost("ChangePassword")]
        public async Task<bool> ChangePassword([FromBody] ChangePasswordModel model) =>
            await _DalService.ChangePassword(model);

        [HttpGet]
        public async Task<UserModel?> GetByAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserByAsync(user.PublicId.ToString());

            return result?.ToModel();
        }

        [HttpGet("Followers")]
        public async Task<List<UserModel>?> GetFollowers()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserWithAsync(user.PublicId.ToString());

            return result?.Followers.ToModelList();
        }

        [HttpGet("Following")]
        public async Task<List<UserModel>?> GetFollowing()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserWithAsync(user.PublicId.ToString());

            return result?.Following.ToModelList();
        }


        [HttpGet("All")]
        public async Task<List<UserModel>?> GetAllBy()
        {
            var result = await _DalService.GetAllByAsync();

            return result?.ToModelList();
        }

        [HttpPut]
        public async Task<Guid> UpdateAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            if (user == null)
                return Guid.Empty;

            var toUpdate = Faker.Company.CatchPhrase();

            var response = await _DalService.UpdateManagerAsync(ClassType.User, user.PublicId.ToString(), toUpdate);

            return response;
        }

        [HttpPut("SubscribeTo")]
        public async Task<UserEntity?> Subscribe()
        {
            var user1 = await _DalService.GetRandomUserAsync();

            var user2 = await _DalService.GetRandomUserAsync();

            var response = await _DalService.SubscribeToAsync(user1.PublicId.ToString(), user2.PublicId.ToString());

            return response;
        }


        [HttpDelete("Delete")]
        public async Task<bool> DeleteAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            if (user == null)
                return false;

            return await _DalService.DeleteManagerAsync(ClassType.User, user.PublicId.ToString());
        }
    }
}
