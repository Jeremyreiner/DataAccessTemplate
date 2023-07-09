using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Template.Database.Infrastructure.MySql;
using Template.Shared.Entities;
using Template.Shared.Interfaces.IRepositories;

namespace Template.Database.Repositories
{
    public class PostRepository : IPostRepository
    {
        readonly ApplicationDbContext _DbContext;

        public PostRepository(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task AddAsync(PostEntity post)
        {
            await _DbContext.Posts.AddAsync(post);

            await _DbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(PostEntity post)
        {
            _DbContext.Posts.Update(post);

            await _DbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(PostEntity post)
        {
            _DbContext.Posts.Remove(post);

            await _DbContext.SaveChangesAsync();
        }

        public async Task<PostEntity?> GetByAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate) =>
            await _DbContext
                .Posts
                .FirstOrDefaultAsync(predicate);

            public async Task<PostEntity?> GetWithAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate) =>
            await _DbContext
                .Posts
                .Include(post => post.Likes)
                .FirstOrDefaultAsync(predicate);

            public async Task<List<PostEntity>?> GetListWithAsync() =>
            await _DbContext.Posts
                .Include(post => post.Likes)
                .ToListAsync();

        public async Task<List<PostEntity>?> GetListByAsync() =>
            await _DbContext.Posts.ToListAsync();
    }
}
