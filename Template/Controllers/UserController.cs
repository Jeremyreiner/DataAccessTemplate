using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
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
        public async Task<UserModel> PostAsync()
        {
            var result = await _DalService.CreateAsync();

            return result.Value.ToModel();
        }

        [HttpPost("LogIn")]
        public async Task<UserModel> Login(string email, string password)
        {
            var result = await _DalService.Login(email, password);

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpGet]
        public async Task<UserModel> GetByAsync()
        {
            var result = await _DalService.GetByAsync();

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpGet("Followers")]
        public async Task<List<UserModel>> GetFollowers()
        {
            var result = await _DalService.GetWithAsync();

            _DalService.CheckForThrow(result.Error);

            return result.Value.Followers.ToModelList();
        }

        [HttpGet("Following")]
        public async Task<List<UserModel>> GetFollowing()
        {
            var result = await _DalService.GetWithAsync();

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
        public async Task<UserModel> UpdateAsync()
        {
            var response = await _DalService.UpdateAsync();

            return response.Value.ToModel();
        }

        [HttpPut("SubscribeTo")]
        public async Task<bool> Subscribe()
        {
            var response = await _DalService.SubscribeToAsync();

            return response.IsSuccess;
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeleteAsync()
        {
            var code = await _DalService.DeleteAsync();

            return code.Status;
        }
    }
}
