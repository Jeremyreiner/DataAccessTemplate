using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Template.Shared.Records;
using Template.Shared.Results;
using Template.Database.Infrastructure.MySql;
using Template.Shared.Entities;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IRepositories;

namespace Template.Database.Repositories
{
    public class UserRepository : IUserRepository
    {
        readonly ApplicationDbContext _DbContext;

        public UserRepository(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task<Result<UserEntity>> AddAsync(UserEntity user)
        {
            await _DbContext.Users.AddAsync(user);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0
                ? Result<UserEntity>.Failed(new Error(HttpStatusCode.BadRequest))
                : Result<UserEntity>.Success(user);
        }

        public async Task<Result<UserEntity>> UpdateAsync(UserEntity user)
        {
            _DbContext.Users.Update(user);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0
                ? Result<UserEntity>.Failed(new Error(HttpStatusCode.BadRequest))
                : Result<UserEntity>.Success(user);
        }

        public async Task<Result<HttpStatusCode>> DeleteAsync(UserEntity user)
        {
            _DbContext.Users.Remove(user);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0 
                ? Result<HttpStatusCode>.Failed(new Error(HttpStatusCode.BadRequest))
                : Result<HttpStatusCode>.Deleted();
        }

        public async Task<Result<UserEntity>> GetByAsync(Expression<Func<UserEntity, bool>> predicate)
        {
            var user = await _DbContext
                .Users
                .FirstOrDefaultAsync(predicate);

            return user is not null
                ? Result<UserEntity>.Success(user)
                : Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }


        public async Task<Result<UserEntity>> GetWithAsync(Expression<Func<UserEntity, bool>> predicate)
        {
            var user = await _DbContext
                .Users
                .Include(user => user.Followers)
                .Include(user => user.Following)
                .FirstOrDefaultAsync(predicate);

            return user is not null
                ? Result<UserEntity>.Success(user)
                : Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<List<UserEntity>>> GetListWithAsync()
        {
            var users = await _DbContext.Users
                .Include(user => user.Followers)
                .AsSplitQuery()
                .Include(user => user.Following)
                .ToListAsync();

            return users.Any()
                ? Result<List<UserEntity>>.Success(users)
                : Result<List<UserEntity>>.Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<List<UserEntity>>> GetListByAsync()
        {
            var users = await _DbContext.Users.ToListAsync();

            return users.Any()
                ? Result<List<UserEntity>>.Success(users)
                : Result<List<UserEntity>>.Failed(new Error(HttpStatusCode.NotFound));
        }
    }
}
