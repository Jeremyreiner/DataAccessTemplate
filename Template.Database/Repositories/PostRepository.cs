using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Template.Database.Infrastructure.MySql;
using Template.Shared.Entities;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IRepositories;
using Template.Shared.Records;
using Template.Shared.Results;

namespace Template.Database.Repositories
{
    public class PostRepository : IPostRepository
    {
        readonly ApplicationDbContext _DbContext;

        public PostRepository(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task<Result<PostEntity>> AddAsync(PostEntity post)
        {
            await _DbContext.Posts.AddAsync(post);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0
                ? Result<PostEntity>.Failed(new Error(HttpStatusCode.NotFound)) 
                : Result<PostEntity>.Success(post);
        }

        public async Task<Result<PostEntity>> UpdateAsync(PostEntity post)
        {
            _DbContext.Posts.Update(post);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0
                ? Result<PostEntity>.Failed(new Error(HttpStatusCode.NotFound))
                : Result<PostEntity>.Success(post);
        }

        public async Task<Result<HttpStatusCode>> DeleteAsync(PostEntity post)
        {
            _DbContext.Posts.Remove(post);

            var count = await _DbContext.SaveChangesAsync();

            return count == 0 
                ? Result<HttpStatusCode>.Deleted()
                : Result<HttpStatusCode>.Failed(new Error(HttpStatusCode.NotModified));
        }

        public async Task<Result<PostEntity>> GetByAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate)
        {
            var post = await _DbContext
                .Posts
                .FirstOrDefaultAsync(predicate);

            return post is not null
                ? Result<PostEntity>.Success(post)
                : Result<PostEntity>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<PostEntity>> GetWithAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate)
        {
            var post = await _DbContext
                .Posts
                .Include(post => post.Likes)
                .FirstOrDefaultAsync(predicate);

            return post is not null
                ? Result<PostEntity>.Success(post)
                : Result<PostEntity>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<List<PostEntity>>> GetListWithAsync()
        {
            var posts = await _DbContext.Posts
                .Include(post => post.Likes)
                .ToListAsync();

            return posts.Any()
                ? Result<List<PostEntity>>.Success(posts)
                : Result<List<PostEntity>>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<List<PostEntity>>> GetListByAsync()
        {
            var posts = await _DbContext.Posts.ToListAsync();

            return posts.Any()
                ? Result<List<PostEntity>>.Success(posts)
                : Result<List<PostEntity>>
                    .Failed(new Error(HttpStatusCode.NotFound));
        }
    }
}
