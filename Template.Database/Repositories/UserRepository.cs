using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Template.Database.Infrastructure.MySql;
using Template.Shared.Entities;
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

        public async Task AddAsync(UserEntity user)
        {
            await _DbContext.Users.AddAsync(user);

            await _DbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(UserEntity user)
        {
            _DbContext.Users.Update(user);

            await _DbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(UserEntity user)
        {
            _DbContext.Users.Remove(user);

            await _DbContext.SaveChangesAsync();
        }

        public async Task<UserEntity?> GetByAsync(Expression<Func<UserEntity, bool>> predicate) =>
            await _DbContext
                .Users
                .FirstOrDefaultAsync(predicate);


        public async Task<UserEntity?> GetWithAsync(Expression<Func<UserEntity, bool>> predicate) =>
            await _DbContext
                .Users
                .Include(user => user.Followers)
                .Include(user => user.Following)
                .FirstOrDefaultAsync(predicate);

        public async Task<List<UserEntity>?> GetListWithAsync() =>
            await _DbContext.Users
                .Include(user => user.Followers)
                .AsSplitQuery()
                .Include(user => user.Following)
                .ToListAsync();

        public async Task<List<UserEntity>?> GetListByAsync() =>
            await _DbContext.Users.ToListAsync();
    }
}
