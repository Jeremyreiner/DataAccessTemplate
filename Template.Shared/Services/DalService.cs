using System.Net;
using Microsoft.Extensions.Logging;
using Publify.Shared.Exceptions;
using Publify.Shared.Services;
using Template.Shared.Entities;
using Template.Shared.Exceptions;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Interfaces.Repositories;
using Template.Shared.Results;

namespace Template.Shared.Services
{
    public class DalService : IDalService
    {
        readonly IUserRepository _UserRepository;

        private readonly IPostRepository _PostRespository;

        readonly ILogger<DalService> _Logger;

        public DalService(
            IUserRepository userRepository,
            ILogger<DalService> logger, 
            IPostRepository postRespository)
        {
            _UserRepository = userRepository;
            _Logger = logger;
            _PostRespository = postRespository;
        }

        #region CREATE ENTITY

        public async Task<Result<UserEntity>> CreateAsync()
        {
            UserEntity user = new()
            {
                PrivateId = Guid.NewGuid(),
                PublicId = Guid.NewGuid(),
                FirstName = Faker.Name.First(),
                LastName = Faker.Name.Last(),
                Bio = Faker.Lorem.Paragraph(),
                Email = Faker.Internet.Email(),
                Password = "qwerty".Hash(),
                CreatedOnDt = DateTime.Now
            };

            var valid = ValidateGuid(user.PublicId.ToString());

            if (!valid.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.Ambiguous));
            }

            var result = await _UserRepository.GetByAsync(user.PublicId.ToString(), u => u.PublicId == valid.Value);

            CheckForThrow(result.Error);

            return await _UserRepository.AddAsync(user);
        }

        public async Task<Result<PostEntity>> CreatePostAsync()
        {
            var publicKey = await GetPublicKey();

            var result = await _UserRepository.GetByAsync(publicKey, u => u.PublicId == Guid.Parse(publicKey));

            CheckForThrow(result.Error);

            PostEntity post = new()
            {
                PrivateId = Guid.NewGuid(),
                PublicId = Guid.NewGuid(),
                UserEntityId = Guid.Parse(publicKey),
                Description = Faker.Lorem.Sentence(),
                CreatedOnDt = DateTime.Now,
                LastUpdateOnDt = DateTime.Now,
                Follows = new List<UserEntity>()
            };

            return await _PostRespository.AddAsync(post);
        }

        #endregion

        #region UPDATE ENTITY

        public async Task<Result<UserEntity>> UpdateAsync()
        {
            var result = await GetByAsync();

            CheckForThrow(result.Error);

            var user = result.Value;

            user.FirstName = Faker.Name.First();
            user.LastName = Faker.Name.Last();
            user.Bio = Faker.Lorem.Paragraph();
            user.LastUpdateOnDt = DateTime.Now;

            return await _UserRepository.UpdateAsync(user);
        }

        public async Task<Result<PostEntity>> UpdatePostAsync()
        {
            var result = await GetPostByAsync();

            CheckForThrow(result.Error);

            var post = result.Value;

            post.Description = Faker.Lorem.Sentence();
            post.LastUpdateOnDt = DateTime.Now;

            return await _PostRespository.UpdateAsync(post);
        }

        #endregion

        #region DELETE ENTITY

        public async Task<Result<HttpStatusCode>> DeleteAsync()
        {
            var result = await GetByAsync();

            if (result.IsSuccess)
            {
                return await _UserRepository.DeleteAsync(result.Value);
            }

            _Logger.LogTrace(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        public async Task<Result<HttpStatusCode>> DeletePostAsync()
        {
            var result = await GetPostByAsync();

            if (result.IsSuccess)
            {
                return await _PostRespository.DeleteAsync(result.Value);
            }

            _Logger.LogTrace(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        #endregion

        #region GetBy

        public async Task<Result<UserEntity>> GetByAsync()
        {
            var publicKey = await GetPublicKey();

            var valid = ValidateGuid(publicKey);

            if (!valid.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.Ambiguous));
            }

            return await _UserRepository.GetByAsync(publicKey, u => u.PublicId == valid.Value);
        }

        public async Task<Result<UserEntity>> GetWithAsync()
        {
            var publicKey = await GetPublicKey();

            var valid = ValidateGuid(publicKey);

            if (!valid.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.BadRequest));
            }

            return await _UserRepository.GetWithAsync(publicKey, u => u.PublicId == valid.Value);
        }

        public async Task<Result<PostEntity>> GetPostByAsync()
        {
            var publicKey = await GetPostPublicKey();

            var valid = ValidateGuid(publicKey);

            if (!valid.IsSuccess)
            {
                return Result<PostEntity>
                    .Failed(new Error(HttpStatusCode.BadRequest));
            }

            return await _PostRespository.GetByAsync(publicKey, u => u.PublicId == valid.Value);
        }

        public async Task<Result<PostEntity>> GetPostWithAsync()
        {
            var publicKey = await GetPostPublicKey();

            var valid = ValidateGuid(publicKey);

            if (!valid.IsSuccess)
            {
                return Result<PostEntity>
                    .Failed(new Error(HttpStatusCode.BadRequest));
            }

            return await _PostRespository.GetWithAsync(publicKey, u => u.PublicId == valid.Value);
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
            var result = await _PostRespository.GetListWithAsync();

            CheckForThrow(result.Error);

            return result.Value;
        }


        #endregion

        #region Subcription

        public async Task<Result<UserEntity>> SubscribeToAsync()
        {
            var users = await GetAllByAsync();

            var random = new Random();

            var user1 = users[random.Next(users.Count)];

            var user2 = users[random.Next(users.Count)];

            if (user1.PrivateId == user2.PrivateId)
                return Result<UserEntity>.Failed(new Error(HttpStatusCode.Ambiguous));

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

        public async Task<Result<PostEntity>> FollowPostAsync()
        {
            var users = await GetAllByAsync();

            var posts = await GetAllPostsByAsync();

            var random = new Random();

            var user = users[random.Next(users.Count)];

            var post = posts[random.Next(posts.Count)];

            if (post.Follows.Contains(user))
            {
                post.Follows.Remove(user);
            }
            else
            {
                post.Follows.Add(user);
            }

            return await _PostRespository.UpdateAsync(post);
        }

        #endregion

        #region AUTHENTICATION

        public async Task<Result<UserEntity>> Login(string email, string password)
        {
            var result = await _UserRepository.GetByAsync(email, u => u.Email == email);

            if (!result.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(result.Error);
            }

            var verified = password.VerifyHash(result.Value.Password);

            return verified
                ? result
                : Result<UserEntity>.Failed(result.Error);
        }

        #endregion

        #region Private Methods

        private static Result<Guid> ValidateGuid(string key)
        {
            var valid = Guid.TryParse(key, out var guid);

            if (valid)
            {
                return Result<Guid>.Success(guid);
            }

            return Result<Guid>
                .Failed(new Error(HttpStatusCode.BadRequest));
        }

        private async Task<string> GetPublicKey()
        {
            var users = await GetAllByAsync();

            var random = new Random();

            var user = users[random.Next(users.Count)];

            return user.PublicId.ToString();
        }

        private async Task<string> GetPostPublicKey()
        {
            var posts = await GetAllPostsByAsync();

            var random = new Random();

            var post  = posts[random.Next(posts.Count)];

            return post.PublicId.ToString();
        }

        public void CheckForThrow(Error error)
        {
            if (error.Code == HttpStatusCode.OK) 
                return;

            throw error.Code switch
            {
                HttpStatusCode.BadRequest => new GuidException(error.Message),
                HttpStatusCode.NotImplemented => new NotImplementedException(error.Message),
                HttpStatusCode.Ambiguous => new DuplicateException(error.Message),
                HttpStatusCode.NotFound => new NotFoundException(error.Message),
                _ => new Exception()
            };
        }

    #endregion
    }
}