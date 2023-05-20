using System.Net;
using Publify.Shared.Entities;
using Publify.Shared.Results;

namespace Publify.Shared.Interfaces
{
    public interface IDalService
    {
        #region Create

        Task<Result<TeacherEntity>> CreateAsync();

        #endregion

        #region Update

        Task<Result<TeacherEntity>> UpdateAsync(string publicKey);

        #endregion

        #region Delete

        Task<Result<HttpStatusCode>> DeleteAsync(string publicKey);

        #endregion

        #region GetBy

        Task<Result<TeacherEntity>> GetByAsync(string email);

        #endregion

        #region Get AllBy

        Task<List<TeacherEntity>> GetAllByAsync();


        #endregion

        #region Athentication

        //Task Login(string email, string password);

        //Task LoginWithToken(string email);

        #endregion
    }
}
