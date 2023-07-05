using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Publify.Shared.Exceptions;
using Publify.Shared.Services;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Exceptions;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IRepositories;
using Template.Shared.Interfaces.IServices;
using Template.Shared.Models;
using Template.Shared.Results;

namespace Template.Shared.Services
{
    public class DalService : IDalService
    {
        readonly IUserRepository _UserRepository;

        private readonly IPostRepository _postRepository;

        readonly ILogger<DalService> _Logger;

        public DalService(
            IUserRepository userRepository,
            ILogger<DalService> logger,
            IPostRepository postRepository)
        {
            _UserRepository = userRepository;
            _Logger = logger;
            _postRepository = postRepository;
        }

        #region CREATE ENTITY

        public async Task<Guid> CreatorManagerAsync(ClassType type, object model)
        {
            var id = Guid.Empty;

            switch (type)
            {
                case ClassType.User:
                    var userModel = (UserModel)model;

                    var user = await CreateUserAsync(userModel);

                    return user.IsSuccess 
                        ? user.Value.PublicId 
                        : id;
                case ClassType.Post:
                    var postModel = (PostModel)model;

                    var post = await CreatePostAsync(postModel);

                    return post.IsSuccess 
                        ? post.Value.PublicId 
                        : id;
                default:
                    return id;
            }
        }

        #endregion

        #region UPDATE ENTITY

        public async Task<Guid> UpdateManagerAsync(ClassType type, string publicKey, object toUpdate) =>
            type switch
            {
                ClassType.User => await UpdateUserAsync(publicKey, toUpdate),
                ClassType.Post => await UpdatePostAsync(publicKey, toUpdate),
                _ => Guid.Empty
            };

        #endregion
        #region DELETE ENTITY

        public async Task<HttpStatusCode> DeleteManagerAsync(ClassType type, string publicKey)
        {
            switch (type)
            {
                case ClassType.User:
                    var user = await DeleteUserAsync(publicKey);

                    return user.Status;
                case ClassType.Post:
                    var post = await DeletePostAsync(publicKey);

                    return post.Status;
                default:
                    return HttpStatusCode.PreconditionFailed;
            }
        }

        #endregion
        #region GetBy

        public async Task<Result<UserEntity>> GetUserByAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _UserRepository.GetByAsync(u => u.PublicId == guid);

            return Result<UserEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        public async Task<Result<UserEntity>> GetUserWithAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _UserRepository.GetWithAsync(u => u.PublicId == guid);

            return Result<UserEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        public async Task<Result<PostEntity>> GetPostByAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _postRepository.GetByAsync(publicKey, u => u.PublicId == guid);

            return Result<PostEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        public async Task<Result<PostEntity>> GetPostWithAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _postRepository.GetWithAsync(publicKey, u => u.PublicId == guid);

            return Result<PostEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        #endregion
        #region GetAllBy

        public async Task<List<UserEntity>> GetAllByAsync()
        {
            var result = await _UserRepository.GetListWithAsync();

            CheckForThrow(result.Error);

            return result.Value;
        }

        public async Task<List<PostEntity>> GetAllPostsByAsync()
        {
            var result = await _postRepository.GetListWithAsync();

            CheckForThrow(result.Error);

            return result.Value;
        }


        #endregion
        #region Subcription

        public async Task<Result<UserEntity>> SubscribeToAsync(string masterPublicKey, string slavePublicKey)
        {
            var resultMaster = await GetUserByAsync(masterPublicKey);

            var resultSlave = await GetUserByAsync(slavePublicKey);

            var user1 = resultMaster.Value;

            var user2 = resultSlave.Value;

            if (user1.PrivateId == user2.PrivateId)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.Ambiguous));
            }

            if (user1.Followers.Contains(user2))
            {
                user1.Followers.Remove(user2);
            }
            else
            {
                user1.Followers.Add(user2);
            }

            return await _UserRepository.UpdateAsync(user1);
        }

        public async Task<Result<PostEntity>> LikePostAsync(string userPublicKey, string postPublicKey)
        {
            var resultUser = await GetUserByAsync(userPublicKey);

            var resultPost = await GetPostWithAsync(postPublicKey);

            var user = resultUser.Value;

            var post = resultPost.Value;

            if (post.Likes.Contains(user))
            {
                post.Likes.Remove(user);
            }
            else
            {
                post.Likes.Add(user);
            }

            return await _postRepository.UpdateAsync(post);
        }

        #endregion
        #region AUTHENTICATION

        public async Task<Result<UserEntity>> Login(string email, string password)
        {
            var result = await _UserRepository.GetByAsync(u => u.Email == email);

            if (!result.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(result.Error);
            }

            var verified = password.VerifyHash(result.Value.Password);

            return verified
                ? result
                : Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.Unauthorized));
        }

        public async Task<Result<UserEntity>> ChangePassword(ChangePasswordModel model)
        {
            if (model.ConfirmedPassword != model.NewPassword)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.PreconditionFailed));
            }

            var verified = await Login(model.Email, model.Password);

            if (!verified.IsSuccess)
            {
                return verified;
            }

            verified.Value.Password = model.NewPassword.Hash();

            verified.Value.LastUpdateOnDt = DateTime.Now;

            return await _UserRepository.UpdateAsync(verified.Value);
        }

        #endregion
        #region Helper Methods

        public async Task<UserEntity> GetRandomUserAsync()
        {
            var random = new Random();

            var result = await _UserRepository.GetListByAsync();

            if (!result.IsSuccess)
                return new UserEntity();

            var users = result.Value;

            return users[random.Next(0, users.Count)];
        }

        public async Task<PostEntity> GetRandomPostAsync()
        {
            var random = new Random();

            var result = await _postRepository.GetListByAsync();

            if (!result.IsSuccess)
                return new PostEntity();

            var posts = result.Value;

            return posts[random.Next(0, posts.Count)];
        }

        public void CheckForThrow(Error error)
        {
            _Logger.LogCritical(error.Code.ToString());

            if (error.Code != HttpStatusCode.OK)
                throw error.Code switch
                {
                    HttpStatusCode.BadRequest => new BadHttpRequestException(error.Code.ToString()),
                    HttpStatusCode.NotModified => new BadHttpRequestException(error.Code.ToString()),
                    HttpStatusCode.UnprocessableEntity => new GuidException(error.Code.ToString()),
                    HttpStatusCode.NotImplemented => new NotImplementedException(error.Code.ToString()),
                    HttpStatusCode.Ambiguous => new DuplicateException(error.Code.ToString()),
                    HttpStatusCode.NotFound => new NotFoundException(error.Code.ToString()),
                    HttpStatusCode.Unauthorized => new UnauthorizedException(error.Code.ToString()),
                    HttpStatusCode.PreconditionFailed => new UnauthorizedException(error.Code.ToString()),
                    _ => new Exception()
                };
        }

        #endregion
        #region Private Methods

        private async Task<Result<UserEntity>> CreateUserAsync(UserModel model)
        {
            var entity = model.ToEntity();

            if (entity.PublicId == Guid.Empty)
                entity.PublicId = Guid.NewGuid();

            var request = await _UserRepository.GetByAsync(u => u.PublicId == entity.PublicId);

            if (request.Error.Code != HttpStatusCode.NotFound)
            {
                CheckForThrow(request.Error);
            }

            entity.PrivateId = Guid.NewGuid();

            var result = await _UserRepository.AddAsync(entity);

            CheckForThrow(result.Error);

            return result;
        }

        private async Task<Result<PostEntity>> CreatePostAsync(PostModel model)
        {
            var entity = model.ToEntity();

            if (entity.PublicId == Guid.Empty)
                entity.PublicId = Guid.NewGuid();

            if (entity.UserPublicId != Guid.Empty)
            {
                var user = await GetUserByAsync(entity.UserPublicId.ToString());

                if(!user.IsSuccess)
                    CheckForThrow(new Error(HttpStatusCode.BadRequest));
            }

            entity.PrivateId = Guid.NewGuid();

            var result = await _postRepository.AddAsync(entity);

            CheckForThrow(result.Error);

            return result;
        }

        private async Task<Guid> UpdateUserAsync(string publicKey, object toUpdate)
        {
            var result = await GetUserByAsync(publicKey);

            CheckForThrow(result.Error);

            var user = result.Value;

            user.FirstName = Faker.Name.First();
            user.LastName = Faker.Name.Last();
            user.Bio = Faker.Lorem.Paragraph();
            user.LastUpdateOnDt = DateTime.Now;

            var request = await _UserRepository.UpdateAsync(user);

            return request.IsSuccess
                ? user.PublicId
                : Guid.Empty;
        }

        private async Task<Guid> UpdatePostAsync(string publicKey, object toUpdate)
        {
            var result = await GetPostByAsync(publicKey);

            CheckForThrow(result.Error);

            var post = result.Value;

            post.Description = Faker.Lorem.Sentence();
            post.LastUpdateOnDt = DateTime.Now;

            var request = await _postRepository.UpdateAsync(post);

            return request.IsSuccess
                ? post.PublicId
                : Guid.Empty;
        }

        private async Task<Result<HttpStatusCode>> DeleteUserAsync(string publicKey)
        {
            var result = await GetUserByAsync(publicKey);

            if (result.IsSuccess)
            {
                return await _UserRepository.DeleteAsync(result.Value);
            }

            _Logger.LogInformation(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        private async Task<Result<HttpStatusCode>> DeletePostAsync(string publicKey)
        {
            var result = await GetPostByAsync(publicKey);

            if (result.IsSuccess)
            {
                return await _postRepository.DeleteAsync(result.Value);
            }

            _Logger.LogInformation(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        private static Guid ValidateGuid(string key)
        {
            var valid = Guid.TryParse(key, out var guid);

            return valid
                ? guid
                : Guid.Empty;
        }

        #endregion
    }
}