using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Models;

namespace Template.Controllers
{
    public class PostController
    {
        private readonly IDalService _DalService;
        public PostController(IDalService dalService)
        {
            _DalService = dalService;
        }
        [HttpPost("Create")]
        public async Task<PostModel> PostAsync()
        {
            var result = await _DalService.CreatePostAsync();

            return result.Value.ToModel();
        }

        [HttpGet]
        public async Task<PostModel> GetByAsync()
        {
            var result = await _DalService.GetPostByAsync();

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpGet("Followers")]
        public async Task<List<UserModel>> GetFollowers()
        {
            var result = await _DalService.GetPostWithAsync();

            _DalService.CheckForThrow(result.Error);

            return result.Value.Follows.ToModelList();
        }

        [HttpGet("All")]
        public async Task<List<PostModel>> GetAllPostsBy()
        {
            var result = await _DalService.GetAllPostsByAsync();

            return result.ToModelList();
        }

        [HttpPut]
        public async Task<PostModel> UpdatePostAsync()
        {
            var response = await _DalService.UpdatePostAsync();

            return response.Value.ToModel();
        }

        [HttpPut("SubscribeTo")]
        public async Task<PostModel> Subscribe()
        {
            var response = await _DalService.FollowPostAsync();

            return response.Value.ToModel();
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeletePostAsync()
        {
            var code = await _DalService.DeletePostAsync();

            return code.Status;
        }
    }
}
