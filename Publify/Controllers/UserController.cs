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
        public async Task<UserModel> GetByAsync(string publicKey)
        {
            var result = await _DalService.GetByAsync(publicKey);

            if (result.IsSuccess)
            {
                return result.Value.ToModel();
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
        public async Task<UserModel> UpdateAsync(string publicKey)
        {
            var response = await _DalService.UpdateAsync(publicKey);

            return response.Value.ToModel();
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeleteAsync(string publicKey)
        {
            var code = await _DalService.DeleteAsync(publicKey);

            return code.Status;
        }
    }
}
