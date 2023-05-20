using System.Linq.Expressions;
using System.Net;
using Publify.Shared.Entities;
using Publify.Shared.Results;

namespace Publify.Shared.Interfaces
{
    public interface ITeacherRepository
    {
        Task<Result<TeacherEntity>> AddAsync(TeacherEntity teacher);

        Task<Result<TeacherEntity>> UpdateAsync(TeacherEntity teacher);

        Task<Result<HttpStatusCode>> DeleteAsync(TeacherEntity teacher);

        Task<Result<TeacherEntity>> GetByAsync(string publicKey, Expression<Func<TeacherEntity, bool>> predicate);

        Task<Result<List<TeacherEntity>>> GetListByAsync();

        //Task<Result<TeacherEntity>> GetByIncludedAsync<TEntity>(string publicKey);
    }
}
