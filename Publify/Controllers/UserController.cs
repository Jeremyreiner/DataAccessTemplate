using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Models;
using Template.Shared.Extensions;

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
            var response = await _DalService.CreateAsync();
            
            return response.Value.ToModel();
        }

        [HttpPost("LogIn")]
        public async Task<UserModel> Login(string email, string password)
        {
            var response = await _DalService.Login(email, password);

            if (response.IsSuccess)
            {
                return response.Value.ToModel();
            }

            throw response.Error.NotFound;

        }

        [HttpGet]
        public async Task<UserModel> GetByAsync()
        {
            var result = await _DalService.GetByAsync();

            if (result.IsSuccess)
            {
                return result.Value.ToModel();
            }

            throw result.Error.NotFound;
        }

        [HttpGet("Followers")]
        public async Task<List<UserModel>> GetFollowers()
        {
            var result = await _DalService.GetWithAsync();

            if (result.IsSuccess)
            {
                return result.Value.Followers.ToModelList();
            }

            throw result.Error.NotFound;
        }

        [HttpGet("Following")]
        public async Task<List<UserModel>> GetFollowing()
        {
            var result = await _DalService.GetWithAsync();

            if (result.IsSuccess)
            {
                return result.Value.Following.ToModelList();
            }

            throw result.Error.NotFound;
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
        public async Task<UserModel> Subscribe()
        {
            var response = await _DalService.SubscribeToAsync();

            return response.Value.ToModel();
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeleteAsync()
        {
            var code = await _DalService.DeleteAsync();

            return code.Status;
        }
    }
}
