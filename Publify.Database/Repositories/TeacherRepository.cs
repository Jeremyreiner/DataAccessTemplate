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
    public class TeacherRepository : ITeacherRepository
    {
        readonly ApplicationDbContext _DbContext;

        public TeacherRepository(ApplicationDbContext dbContext)
        {
            _DbContext = dbContext;
        }

        public async Task<Result<TeacherEntity>> AddAsync(TeacherEntity teacher)
        {
            await _DbContext.Teachers.AddAsync(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<TeacherEntity>.Success(teacher);
        }

        public async Task<Result<TeacherEntity>> UpdateAsync(TeacherEntity teacher)
        {
            _DbContext.Teachers.Update(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<TeacherEntity>.Success(teacher);
        }

        public async Task<Result<HttpStatusCode>> DeleteAsync(TeacherEntity teacher)
        {
            _DbContext.Teachers.Remove(teacher);

            await _DbContext.SaveChangesAsync();

            return Result<HttpStatusCode>.Deleted();
        }

        public async Task<Result<TeacherEntity>> GetByAsync(string publicKey, Expression<Func<TeacherEntity, bool>> predicate)
        {
            var teacher = await _DbContext
                .Teachers
                .FirstOrDefaultAsync(predicate);

            return teacher is not null 
                ? Result<TeacherEntity>.Success(teacher) 
                : Result<TeacherEntity>.Failed(new Error(new Records.PublicId(Guid.Parse(publicKey))
                    .NotFound()));
        }
        
        public async Task<Result<List<TeacherEntity>>> GetListByAsync()
        {
            var teachers = await _DbContext.Teachers.ToListAsync();

            return teachers.Any()
                ? Result<List<TeacherEntity>>.Success(teachers) 
                : Result<List<TeacherEntity>>.Failed(new Error());
        }


        //public async Task<TeacherEntity?> GetByIncludedAsync<TEntity>(Expression<Func<TeacherEntity, bool>> predicate, Expression<Func<TeacherEntity, TEntity>> selector) where TEntity : class? =>
        //    await _DbContext.Teachers.Include(selector).FirstOrDefaultAsync(predicate);
    }
}
