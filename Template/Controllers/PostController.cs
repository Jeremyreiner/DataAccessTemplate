using System.Net;
using Microsoft.AspNetCore.Mvc;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Interfaces.IServices;
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
        public async Task<Guid> PostAsync()
        {
            var user = await _DalService.GetRandomUserAsync();

            PostModel post = new()
            {
                PublicId = Guid.NewGuid().ToString(),
                UserPublicId = user.PublicId.ToString(),
                Description = Faker.Lorem.Sentence(),
                CreatedOnDt = DateTime.Now,
                Likes = 0
            };
            var result = await _DalService.CreatorManagerAsync(ClassType.Post, post);

            return result;
        }

        [HttpGet]
        public async Task<PostModel> GetByAsync()
        {
            var post = await _DalService.GetRandomPostAsync();

            var result = await _DalService.GetPostByAsync(post.PublicId.ToString());

            _DalService.CheckForThrow(result.Error);

            return result.Value.ToModel();
        }

        [HttpGet("LikedList")]
        public async Task<List<UserModel>> GetFollowers()
        {
            var post = await _DalService.GetRandomPostAsync();

            var result = await _DalService.GetPostWithAsync(post.PublicId.ToString());

            _DalService.CheckForThrow(result.Error);

            return result.Value.Likes.ToModelList();
        }

        [HttpGet("All")]
        public async Task<List<PostModel>> GetAllPostsBy()
        {
            var result = await _DalService.GetAllPostsByAsync();

            return result.ToModelList();
        }

        [HttpPut]
        public async Task<Guid> UpdatePostAsync()
        {
            var post = await _DalService.GetRandomPostAsync();

            var description = Faker.Company.CatchPhrase();

            var response = await _DalService.UpdateManagerAsync(ClassType.Post, post.PublicId.ToString(), description);

            return response;
        }

        [HttpPut("Like")]
        public async Task<PostModel> Like()
        {
            var user = await _DalService.GetRandomUserAsync();

            var post = await _DalService.GetRandomPostAsync();

            var response = await _DalService.LikePostAsync(user.PublicId.ToString(), post.PublicId.ToString());

            return response.Value.ToModel();
        }


        [HttpDelete("Delete")]
        public async Task<HttpStatusCode> DeletePostAsync()
        {
            var post = await _DalService.GetRandomPostAsync();

            var code = await _DalService.DeleteManagerAsync(ClassType.Post, post.PublicId.ToString());

            return code;
        }
    }
}
