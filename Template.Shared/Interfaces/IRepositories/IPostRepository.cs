using System.Linq.Expressions;
using System.Net;
using Template.Shared.Entities;
using Template.Shared.Results;

namespace Template.Shared.Interfaces.IRepositories
{
    public interface IPostRepository
    {
        Task<Result<PostEntity>> AddAsync(PostEntity user);

        Task<Result<PostEntity>> UpdateAsync(PostEntity user);

        Task<Result<HttpStatusCode>> DeleteAsync(PostEntity user);

        Task<Result<PostEntity>> GetByAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate);

        Task<Result<PostEntity>> GetWithAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate);

        Task<Result<List<PostEntity>>> GetListByAsync();

        Task<Result<List<PostEntity>>> GetListWithAsync();

        //Task<Result<PostEntity>> GetByIncludedAsync<TEntity>(string publicKey);
    }
}
