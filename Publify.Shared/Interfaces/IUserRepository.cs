using System.Linq.Expressions;
using System.Net;
using Template.Shared.Entities;
using Template.Shared.Results;

namespace Template.Shared.Interfaces
{
    public interface IUserRepository
    {
        Task<Result<UserEntity>> AddAsync(UserEntity teacher);

        Task<Result<UserEntity>> UpdateAsync(UserEntity teacher);

        Task<Result<HttpStatusCode>> DeleteAsync(UserEntity teacher);

        Task<Result<UserEntity>> GetByAsync(string publicKey, Expression<Func<UserEntity, bool>> predicate);

        Task<Result<List<UserEntity>>> GetListByAsync();

        //Task<Result<TeacherEntity>> GetByIncludedAsync<TEntity>(string publicKey);
    }
}
