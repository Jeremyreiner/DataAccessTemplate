using System.Net;
using Template.Shared.Entities;
using Template.Shared.Results;

namespace Template.Shared.Interfaces
{
    /// <summary>
    /// This is a template application interface. All values must be updated for proper use cases
    /// This interface allows the initial designer access of CRUD generic functions only.
    /// </summary>
    public interface IDalService
    {
        #region Create

        /// <summary>
        /// Generates a new user object using faker data
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> CreateAsync();

        #endregion

        #region Update

        /// <summary>
        /// Randomly generates new user data for selected user...
        /// </summary>
        /// <param name="publicKey"></param>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> UpdateAsync(string publicKey);

        #endregion

        #region Delete

        /// <summary>
        /// Deletes entity from db, and in every case returns only
        /// HttpStatusResponse.
        /// </summary>
        /// <param name="publicKey"></param>
        /// <returns></returns>
        Task<Result<HttpStatusCode>> DeleteAsync(string publicKey);

        #endregion

        #region GetBy

        /// <summary>
        /// This method should be used for every get case.
        /// If passed a valid public key parameter, the method returns the entity,
        /// otherwise throwing an invalid get parameter error.
        /// </summary>
        /// <param name="publicKey"></param>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> GetByAsync(string publicKey);

        #endregion

        #region Get AllBy

        Task<List<UserEntity>> GetAllByAsync();


        #endregion

        #region Athentication

        /// <summary>
        /// Login requires a query to the db using an email. if an entity is registered,
        /// then if the entered password matches the entities hashed password, than a succesful entity is returned
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> Login(string email, string password);

        #endregion
    }
}
