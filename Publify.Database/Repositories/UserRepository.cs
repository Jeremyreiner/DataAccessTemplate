using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Publify.Database.Infrastructure.MySql;
using Publify.Shared.Entities;
using Publify.Shared.Extensions;
using Publify.Shared.Interfaces;
using Publify.Shared.Records;
using Publify.Shared.Results;

namespace Publify.Database.Repositories
{
    public class UserRepository : IUserRepository
    {
        readonly ApplicationDbContext _DbContext;

        public UserRepository(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task<Result<UserEntity>> AddAsync(UserEntity teacher)
        {
            await _DbContext.Teachers.AddAsync(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<UserEntity>.Success(teacher);
        }

        public async Task<Result<UserEntity>> UpdateAsync(UserEntity teacher)
        {
            _DbContext.Teachers.Update(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<UserEntity>.Success(teacher);
        }

        public async Task<Result<HttpStatusCode>> DeleteAsync(UserEntity teacher)
        {
            _DbContext.Teachers.Remove(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<HttpStatusCode>.Deleted();
        }

        public async Task<Result<UserEntity>> GetByAsync(string publicKey, Expression<Func<UserEntity, bool>> predicate)
        {
            var teacher = await _DbContext
                .Teachers
                .FirstOrDefaultAsync(predicate);

            return teacher is not null 
                ? Result<UserEntity>.Success(teacher) 
                : Result<UserEntity>.Failed(new Error(new Records.PublicId(Guid.Parse(publicKey))
                    .NotFound()));
        }
        
        public async Task<Result<List<UserEntity>>> GetListByAsync()
        {
            var teachers = await _DbContext.Teachers.ToListAsync();

            return teachers.Any()
                ? Result<List<UserEntity>>.Success(teachers) 
                : Result<List<UserEntity>>.Failed(new Error());
        }


        //public async Task<TeacherEntity?> GetByIncludedAsync<TEntity>(Expression<Func<TeacherEntity, bool>> predicate, Expression<Func<TeacherEntity, TEntity>> selector) where TEntity : class? =>
        //    await _DbContext.Teachers.Include(selector).FirstOrDefaultAsync(predicate);
    }
}
