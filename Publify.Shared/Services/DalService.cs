using System.Net;
using Microsoft.Extensions.Logging;
using Publify.Shared.Entities;
using Publify.Shared.Extensions;
using Publify.Shared.Interfaces;
using Publify.Shared.Results;

namespace Publify.Shared.Services
{
    public class DalService : IDalService
    {
        readonly ITeacherRepository _TeacherRepository;

        readonly ILogger<DalService> _Logger;

        public DalService(
            ITeacherRepository teacherRepository,
            ILogger<DalService> logger)
        {
            _TeacherRepository = teacherRepository;

        }

        #region CREATE ENTITY

        public async Task<Result<TeacherEntity>> CreateAsync()
        {
            TeacherEntity teacher = new()
            {
                PrivateId = Guid.NewGuid(),
                PublicId = Guid.NewGuid(),
                FirstName = Faker.Name.First(),
                LastName = Faker.Name.Last(),
                Bio = Faker.Lorem.Paragraph(),
                Email = Faker.Internet.Email(),
                Password = "qwerty",
                CreatedOnDt = DateTime.Now
            };

            var result = await GetByAsync(teacher.PublicId.ToString());

            if (result.IsSuccess)
            {
                throw result
                    .Value
                    .PublicRecord
                    .DuplicatedEntry();
            }

            result = await _TeacherRepository.AddAsync(teacher);

            return result;
        }

        #endregion

        #region UPDATE ENTITY

        public async Task<Result<TeacherEntity>> UpdateAsync(string publicKey)
        {
            var result = await GetByAsync(publicKey);

            if (!result.IsSuccess)
            {
                throw result
                    .Error
                    .NotFound;
            }

            var user = result.Value;

            user.FirstName = Faker.Name.First();
            user.LastName = Faker.Name.Last();
            user.Bio = Faker.Lorem.Paragraph();
            user.LastUpdateOnDt = DateTime.Now;

            return await _TeacherRepository.UpdateAsync(user);
        }

        #endregion

        #region DELETE ENTITY

        public async Task<Result<HttpStatusCode>> DeleteAsync(string publicKey)
        {
            var result = await GetByAsync(publicKey);


            if (result.IsSuccess)
            {
                return await _TeacherRepository.DeleteAsync(result.Value);
            }

            _Logger.LogTrace(result
                .Error
                .NotFound
                .Message);

            return Result<HttpStatusCode>.Deleted();
        }

        #endregion

        #region GetBy

        public async Task<Result<TeacherEntity>> GetByAsync(string publicKey)
        {
            var result = await _TeacherRepository.GetByAsync(publicKey, u => u.PublicId == Guid.Parse(publicKey));

            return result;
        }

        #endregion

        #region GetAllBy

        public async Task<List<TeacherEntity>> GetAllByAsync()
        {
            var result = await _TeacherRepository.GetListByAsync();

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

        //public async Task<(bool, User?)> Login(string email, string password)
        //{
        //    try
        //    {
        //        var result = await _TeacherRepository.GetByAsync(email);

        //        if (result.IsSuccess)
        //        {
        //            var teacher = result.Value;

        //            return (password.VerifyHash(teacher.Password), teacher);
        //        }

        //        var student = await _StudentRepository.GetByAsync(s => s.Email == email);

        //        return (student is not null && password.VerifyHash(student.Password), student!);
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e);
        //        throw;
        //    }

        //}

        //public async Task<(User?, bool)?> LoginWithToken(string email)
        //{
        //    var result = await _TeacherRepository.GetByAsync(email);

        //    if (!result.IsSuccess) throw new Exception();

        //    var teacher = result.Value;

        //    return (teacher, true);

        //}

        #endregion

        #region Private Methods

        //private bool ValidateGuid(string key)
        //{
        //    var valid = Guid.TryParse(key);
        //}
        #endregion
    }
}