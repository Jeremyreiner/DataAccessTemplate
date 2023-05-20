using System.Net;
using Microsoft.AspNetCore.Mvc;
using Publify.Shared.Entities;
using Publify.Shared.Enums;
using Publify.Shared.Extensions;
using Publify.Shared.Interfaces;
using Publify.Shared.Models;
using Publify.Shared.Results;

namespace Publify.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class TeacherController : ControllerBase
    {
        readonly IDalService _DalService;

        public TeacherController(IDalService dalService)
        {
            _DalService = dalService;
        }

        [HttpPost("Create")]
        public async Task<TeacherModel> PostAsync()
        {
            var response = await _DalService.CreateAsync();
            
            return response.Value.ToModel();
        }

        [HttpGet]
        public async Task<TeacherModel> GetByAsync(string publicKey)
        {
            var result = await _DalService.GetByAsync(publicKey);

            if (result.IsSuccess)
            {
                return result.Value.ToModel();
            }

            throw result.Error.NotFound;
        }


        [HttpGet("All")]
        public async Task<List<TeacherModel>> GetAllBy()
        {
            var result = await _DalService.GetAllByAsync();

            return result.ToModelList();
        }

        [HttpPut]
        public async Task<TeacherModel> UpdateAsync(string publicKey)
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
