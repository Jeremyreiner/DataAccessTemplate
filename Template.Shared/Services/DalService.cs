using Microsoft.Extensions.Logging;
using Publify.Shared.Services;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IRepositories;
using Template.Shared.Interfaces.IServices;
using Template.Shared.Models;

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
            switch (type)
            {
                case ClassType.User:
                    var userModel = (UserModel)model;

                    var user = await CreateUserAsync(userModel);

                    return user.PublicId;

                case ClassType.Post:
                    var postModel = (PostModel)model;

                    var post = await CreatePostAsync(postModel);
                    return post.PublicId;
                default:
                    return Guid.Empty;
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

        public async Task<bool> DeleteManagerAsync(ClassType type, string publicKey)
        {
            switch (type)
            {
                case ClassType.User:
                    return await DeleteUserAsync(publicKey);

                case ClassType.Post:
                    return await DeletePostAsync(publicKey);

                default:
                    return false;
            }
        }

        #endregion
        #region GetBy

        public async Task<UserEntity?> GetUserByAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _UserRepository.GetByAsync(u => u.PublicId == guid);
            return null;
        }

        public async Task<UserEntity?> GetUserWithAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _UserRepository.GetWithAsync(u => u.PublicId == guid);
            return null;
        }

        public async Task<PostEntity?> GetPostByAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _postRepository.GetByAsync(publicKey, u => u.PublicId == guid);
            return null;
        }

        public async Task<PostEntity?> GetPostWithAsync(string publicKey)
        {
            var guid = ValidateGuid(publicKey);

            if (guid != Guid.Empty)
                return await _postRepository.GetWithAsync(publicKey, u => u.PublicId == guid);
            return null;
        }

        #endregion
        #region GetAllBy

        public async Task<List<UserEntity>?> GetAllByAsync() =>
            await _UserRepository.GetListWithAsync();

        public async Task<List<PostEntity>?> GetAllPostsByAsync() =>
            await _postRepository.GetListWithAsync();


        #endregion
        #region Subcription

        public async Task<UserEntity?> SubscribeToAsync(string masterPublicKey, string slavePublicKey)
        {
            var user1 = await GetUserByAsync(masterPublicKey);

            var user2 = await GetUserByAsync(slavePublicKey);

            if (user1 == null || user2 == null)
                return null;

            if (user1.PrivateId == user2.PrivateId)
                return user1;

            if (user1.Followers.Contains(user2))
                user1.Followers.Remove(user2);
            else
                user1.Followers.Add(user2);

            await _UserRepository.UpdateAsync(user1);

            return user1;
        }

        public async Task<PostEntity?> LikePostAsync(string userPublicKey, string postPublicKey)
        {
            var user = await GetUserByAsync(userPublicKey);

            var post = await GetPostWithAsync(postPublicKey);

            if (user == null || post == null)
                return null;

            if (post.Likes.Contains(user))
                post.Likes.Remove(user);
            else
                post.Likes.Add(user);

            await _postRepository.UpdateAsync(post);

            return post;
        }

        #endregion
        #region AUTHENTICATION

        public async Task<UserEntity?> Login(string email, string password)
        {
            var result = await _UserRepository.GetByAsync(u => u.Email == email);

            if (result == null)
                return null;

            var verified = password.VerifyHash(result.Password);

            return verified
                ? result
                : null;
        }

        public async Task<bool> ChangePassword(ChangePasswordModel model)
        {
            if (model.ConfirmedPassword != model.NewPassword)
                return false;

            var verified = await Login(model.Email, model.Password);

            if (verified == null)
                return false;

            verified.Password = model.NewPassword.Hash();

            verified.LastUpdateOnDt = DateTime.Now;

            await _UserRepository.UpdateAsync(verified);

            return true;
        }

        #endregion
        #region Helper Methods

        public async Task<UserEntity> GetRandomUserAsync()
        {
            var random = new Random();

            var result = await _UserRepository.GetListByAsync();

            return result is null 
                ? new UserEntity() 
                : result[random.Next(0, result.Count)];
        }

        public async Task<PostEntity> GetRandomPostAsync()
        {
            var random = new Random();

            var result = await _postRepository.GetListByAsync();

            return result is null 
                ? new PostEntity() 
                : result[random.Next(0, result.Count)];
        }

        #endregion
        #region Private Methods

        private async Task<UserEntity?> CreateUserAsync(UserModel model)
        {
            var entity = model.ToEntity();

            if (entity.PublicId == Guid.Empty)
                entity.PublicId = Guid.NewGuid();

            var request = await _UserRepository.GetByAsync(u => u.PublicId == entity.PublicId);

            if (request !=  null)
            {
                return null;
            }

            entity.PrivateId = Guid.NewGuid();

            await _UserRepository.AddAsync(entity);

            return entity;
        }

        private async Task<PostEntity?> CreatePostAsync(PostModel model)
        {
            var entity = model.ToEntity();

            if (entity.PublicId == Guid.Empty)
                entity.PublicId = Guid.NewGuid();

            if (entity.UserPublicId != Guid.Empty)
            {
                var user = await GetUserByAsync(entity.UserPublicId.ToString());

                if (user == null)
                    return null;
            }

            entity.PrivateId = Guid.NewGuid();

            await _postRepository.AddAsync(entity);

            return entity;
        }

        private async Task<Guid> UpdateUserAsync(string publicKey, object toUpdate)
        {
            var user = await GetUserByAsync(publicKey);

            if(user == null)
                return Guid.Empty;

            user.FirstName = Faker.Name.First();
            user.LastName = Faker.Name.Last();
            user.Bio = Faker.Lorem.Paragraph();
            user.LastUpdateOnDt = DateTime.Now;

            await _UserRepository.UpdateAsync(user);

            return user.PublicId;
        }

        private async Task<Guid> UpdatePostAsync(string publicKey, object toUpdate)
        {
            var post = await GetPostByAsync(publicKey);

            if (post == null)
                return Guid.Empty;

            post.Description = Faker.Lorem.Sentence();
            post.LastUpdateOnDt = DateTime.Now;

            await _postRepository.UpdateAsync(post);

            return post.PublicId;
        }

        private async Task<bool> DeleteUserAsync(string publicKey)
        {
            var result = await GetUserByAsync(publicKey);

            if (result == null) 
                return false;
            
            await _UserRepository.DeleteAsync(result);

            return true;
        }

        private async Task<bool> DeletePostAsync(string publicKey)
        {
            var result = await GetPostByAsync(publicKey);

            if (result == null)
                return false;

            await _postRepository.DeleteAsync(result);

            return true;
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