using System.Linq.Expressions;
using System.Net;
using Template.Shared.Entities;
using Template.Shared.Results;

namespace Template.Shared.Interfaces.IRepositories
{
    public interface IUserRepository
    {
        Task<Result<UserEntity>> AddAsync(UserEntity user);

        Task<Result<UserEntity>> UpdateAsync(UserEntity user);

        Task<Result<HttpStatusCode>> DeleteAsync(UserEntity user);

        Task<Result<UserEntity>> GetByAsync(Expression<Func<UserEntity, bool>> predicate);

        Task<Result<UserEntity>> GetWithAsync(Expression<Func<UserEntity, bool>> predicate);

        Task<Result<List<UserEntity>>> GetListByAsync();

        Task<Result<List<UserEntity>>> GetListWithAsync();

        //Task<Result<TeacherEntity>> GetByIncludedAsync<TEntity>(string publicKey);
    }
}
