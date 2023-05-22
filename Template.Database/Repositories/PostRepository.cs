﻿using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Template.Database.Infrastructure.MySql;
using Template.Shared.Entities;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.Repositories;
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

            await _DbContext.SaveChangesAsync();

            return Result<PostEntity>.Success(post);
        }

        public async Task<Result<PostEntity>> UpdateAsync(PostEntity post)
        {
            _DbContext.Posts.Update(post);

            await _DbContext.SaveChangesAsync();

            return Result<PostEntity>.Success(post);
        }

        public async Task<Result<HttpStatusCode>> DeleteAsync(PostEntity post)
        {
            _DbContext.Posts.Remove(post);

            await _DbContext.SaveChangesAsync();

            return Result<HttpStatusCode>.Deleted();
        }

        public async Task<Result<PostEntity>> GetByAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate)
        {
            var post = await _DbContext
                .Posts
                .FirstOrDefaultAsync(predicate);

            return post is not null
                ? Result<PostEntity>.Success(post)
                : Result<PostEntity>
                    .Failed(new Error(new Records.PublicId(Guid.Parse(publicKey))
                    .NotFound()));
        }

        public async Task<Result<PostEntity>> GetWithAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate)
        {
            var post = await _DbContext
                .Posts
                .Include(post => post.Follows)
                .FirstOrDefaultAsync(predicate);

            return post is not null
                ? Result<PostEntity>.Success(post)
                : Result<PostEntity>
                    .Failed(new Error(new Records.PublicId(Guid.Parse(publicKey))
                    .NotFound()));
        }

        public async Task<Result<List<PostEntity>>> GetListWithAsync()
        {
            var posts = await _DbContext.Posts
                .Include(post => post.Follows)
                .ToListAsync();

            return posts.Any()
                ? Result<List<PostEntity>>.Success(posts)
                : Result<List<PostEntity>>.Failed(new Error(HttpStatusCode.NotFound));
        }

        public async Task<Result<List<PostEntity>>> GetListByAsync()
        {
            var posts = await _DbContext.Posts.ToListAsync();

            return posts.Any()
                ? Result<List<PostEntity>>.Success(posts)
                : Result<List<PostEntity>>.Failed(new Error(HttpStatusCode.NotFound));
        }


        //public async Task<TeacherEntity?> GetByIncludedAsync<TEntity>(Expression<Func<TeacherEntity, bool>> predicate, Expression<Func<TeacherEntity, TEntity>> selector) where TEntity : class? =>
        //    await _DbContext.Users.Include(selector).FirstOrDefaultAsync(predicate);
    }
}