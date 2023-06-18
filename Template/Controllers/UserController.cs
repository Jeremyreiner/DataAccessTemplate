using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Interfaces.IServices;
using Template.Shared.Models;
using Template.Shared.Results;

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
        public async Task<UserModel> Login(string email, string password)
        {
            var result = await _DalService.Login(email, password);

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpPost("ChangePassword")]
        public async Task<HttpStatusCode> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var result = await _DalService.ChangePassword(model);

            _DalService.CheckForThrow(result.Error);

            return result.Status;

        } 

        [HttpGet]
        public async Task<UserModel> GetByAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserByAsync(user.PublicId.ToString());

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpGet("Followers")]
        public async Task<List<UserModel>> GetFollowers()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserWithAsync(user.PublicId.ToString());

            _DalService.CheckForThrow(result.Error);

            return result.Value.Followers.ToModelList();
        }

        [HttpGet("Following")]
        public async Task<List<UserModel>> GetFollowing()
        {
            var user = await _DalService.GetRandomUserAsync();

            var result = await _DalService.GetUserWithAsync(user.PublicId.ToString());

            _DalService.CheckForThrow(result.Error);

            return result.Value.Following.ToModelList();
        }


        [HttpGet("All")]
        public async Task<List<UserModel>> GetAllBy()
        {
            var result = await _DalService.GetAllByAsync();

            return result.ToModelList();
        }

        [HttpPut]
        public async Task<Guid> UpdateAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            var toUpdate = Faker.Company.CatchPhrase();

            var response = await _DalService.UpdateManagerAsync(ClassType.User, user.PublicId.ToString(), toUpdate);

            return response;
        }

        [HttpPut("SubscribeTo")]
        public async Task<bool> Subscribe()
        {
            var user1 = await _DalService.GetRandomUserAsync();

            var user2 = await _DalService.GetRandomUserAsync();

            var response = await _DalService.SubscribeToAsync(user1.PublicId.ToString(), user2.PublicId.ToString());

            return response.IsSuccess;
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeleteAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            var code = await _DalService.DeleteManagerAsync(ClassType.User, user.PublicId.ToString());

            return code;
        }
    }
}
