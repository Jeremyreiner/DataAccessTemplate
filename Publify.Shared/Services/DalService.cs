using System.Net;
using Microsoft.Extensions.Logging;
using Publify.Shared.Services;
using Template.Shared.Entities;
using Template.Shared.Exceptions;
using Template.Shared.Extensions;
using Template.Shared.Interfaces;
using Template.Shared.Results;

namespace Template.Shared.Services
{
    public class DalService : IDalService
    {
        readonly IUserRepository _UserRepository;

        readonly ILogger<DalService> _Logger;

        public DalService(
            IUserRepository userRepository,
            ILogger<DalService> logger)
        {
            _UserRepository = userRepository;
            _Logger = logger;
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

            var result = await GetByAsync(user.PublicId.ToString());

            if (result.IsSuccess)
            {
                throw result
                    .Value
                    .PublicRecord
                    .DuplicatedEntry();
            }

            return await _UserRepository.AddAsync(user);
        }

        #endregion

        #region UPDATE ENTITY

        public async Task<Result<UserEntity>> UpdateAsync(string publicKey)
        {
            var result = await GetByAsync(publicKey);

            if (!result.IsSuccess)
            {
                throw result
                    .Error
                    .InvalidConversion;
            }

            var user = result.Value;

            user.FirstName = Faker.Name.First();
            user.LastName = Faker.Name.Last();
            user.Bio = Faker.Lorem.Paragraph();
            user.LastUpdateOnDt = DateTime.Now;

            return await _UserRepository.UpdateAsync(user);
        }

        #endregion

        #region DELETE ENTITY

        public async Task<Result<HttpStatusCode>> DeleteAsync(string publicKey)
        {
            var result = await GetByAsync(publicKey);


            if (result.IsSuccess)
            {
                return await _UserRepository.DeleteAsync(result.Value);
            }

            _Logger.LogTrace(result
                .Error
                .NotFound
                .Message);

            return Result<HttpStatusCode>.Deleted();
        }

        #endregion

        #region GetBy

        public async Task<Result<UserEntity>> GetByAsync(string publicKey)
        {
            var valid = ValidateGuid(publicKey);

            if (!valid.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(new Error(valid.Error.InvalidConversion));
            }

            return await _UserRepository.GetByAsync(publicKey, u => u.PublicId == valid.Value);
        }

        #endregion

        #region GetAllBy

        public async Task<List<UserEntity>> GetAllByAsync()
        {
            var result = await _UserRepository.GetListByAsync();

            if (!result.IsSuccess)
            {
                throw result
                    .Error
                    .NotFound;
            }

            return result.Value;
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
                .Failed(new Error(new Records.Records.GuidId(key).ConversionError()));
        }

        #endregion
    }
}