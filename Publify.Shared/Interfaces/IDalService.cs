using System.Net;
using Template.Shared.Entities;
using Template.Shared.Results;

namespace Template.Shared.Interfaces
{
    /// <summary>
    /// This is a template application interface. All values must be updated for proper use cases
    /// This interface allows the initial designer access of CRUD generic functions only.
    /// Interface requires input only for login validation,everything else is autonomously done.
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
        /// Updates new user data using Faker randomly for selected user...
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> UpdateAsync();

        #endregion

        #region Delete

        /// <summary>
        /// Deletes entity from DB
        /// </summary>
        /// <returns>HttpStatusResponse</returns>
        Task<Result<HttpStatusCode>> DeleteAsync();

        #endregion

        #region GetBy

        /// <summary>
        /// Gets user randomly from DB.
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> GetByAsync();

        /// <summary>
        /// Gets a user from DB, including Many To Many Relationships
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> GetWithAsync();

        #endregion

        #region Get AllBy

        /// <summary>
        /// Gets all User entities from DB.
        /// </summary>
        /// <returns>List of Users</returns>
        Task<List<UserEntity>> GetAllByAsync();


        #endregion

        #region Subscription

        /// <summary>
        /// Using Faker data, either a entity will subscribe to or unsubscribe from a randomly selected user entity.
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> SubscribeToAsync();

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
