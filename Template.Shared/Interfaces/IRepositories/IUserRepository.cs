using System.Linq.Expressions;
using Template.Shared.Entities;

namespace Template.Shared.Interfaces.IRepositories
{
    public interface IUserRepository
    {
        Task AddAsync(UserEntity user);

        Task UpdateAsync(UserEntity user);

        Task DeleteAsync(UserEntity user);

        Task<UserEntity?> GetByAsync(Expression<Func<UserEntity, bool>> predicate);

        Task<UserEntity?> GetWithAsync(Expression<Func<UserEntity, bool>> predicate);

        Task<List<UserEntity>?> GetListByAsync();

        Task<List<UserEntity>?> GetListWithAsync();
    }
}
