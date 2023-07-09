using System.Linq.Expressions;
using Template.Shared.Entities;

namespace Template.Shared.Interfaces.IRepositories
{
    public interface IPostRepository
    {
        Task AddAsync(PostEntity user);

        Task UpdateAsync(PostEntity user);

        Task DeleteAsync(PostEntity user);

        Task<PostEntity?> GetByAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate);

        Task<PostEntity?> GetWithAsync(string publicKey, Expression<Func<PostEntity, bool>> predicate);

        Task<List<PostEntity>?> GetListByAsync();

        Task<List<PostEntity>?> GetListWithAsync();
    }
}
