using System.Net;
using Template.Shared.Entities;
using Template.Shared.Enums;
using Template.Shared.Models;

namespace Template.Shared.Interfaces.IServices
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
        /// Creator manager for entities
        /// </summary>
        /// <param name="type">Enum type for entities</param>
        /// <param name="model">Entity property revealed to frontend</param>
        /// <returns></returns>
        Task<Guid> CreatorManagerAsync(ClassType type, object model);

        #endregion

        #region Update

        /// <summary>
        /// Update manager for entities
        /// </summary>
        /// <param name="type"></param>
        /// <param name="publicKey"></param>
        /// <param name="toUpdate"></param>
        /// <returns></returns>
        Task<Guid> UpdateManagerAsync(ClassType type, string publicKey, object toUpdate);

        #endregion

        #region Delete

        /// <summary>
        /// Delete manager for entities
        /// </summary>
        /// <returns>HttpStatusResponse</returns>
        Task<bool> DeleteManagerAsync(ClassType type, string publicKey);

        #endregion

        #region GetBy

        /// <summary>
        /// Gets user randomly from DB.
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<UserEntity?> GetUserByAsync(string publicKey);

        /// <summary>
        /// Gets a user from DB, including Many To Many Relationships
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<UserEntity?> GetUserWithAsync(string publicKey);

        /// <summary>
        /// Gets post randomly from DB
        /// </summary>
        /// <returns></returns>
        Task<PostEntity?> GetPostByAsync(string publicKey);

        /// <summary>
        /// Gets post with follows randomly from DB
        /// </summary>
        /// <returns></returns>
        Task<PostEntity?> GetPostWithAsync(string publicKey);

        #endregion

        #region Get AllBy

        /// <summary>
        /// Gets all User entities from DB.
        /// </summary>
        /// <returns>List of Users</returns>
        Task<List<UserEntity>?> GetAllByAsync();

        /// <summary>
        /// Gets all posts from Db
        /// </summary>
        /// <returns></returns>
        Task<List<PostEntity>?> GetAllPostsByAsync();

        #endregion

        #region Subscription

        /// <summary>
        /// Either a entity will subscribe to or unsubscribe from a randomly selected user entity.
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<UserEntity?> SubscribeToAsync(string masterPublicKey, string slavePublicKey);

        /// <summary>
        /// Randomly selects post and user. If the post has the user, the user is unfollowed, otherwise, followed
        /// </summary>
        /// <returns></returns>
        Task<PostEntity?> LikePostAsync(string userPublicKey, string postPublicKey);

        #endregion

        #region Athentication

        /// <summary>
        /// Login requires a query to the db using an email. if an entity is registered,
        /// then if the entered password matches the entities hashed password, than a succesful entity is returned
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns>Result of type User</returns>
        Task<UserEntity?> Login(string email, string password);

        /// <summary>
        /// Verifies that the entered New password, and confirmed new password match,
        /// Verifies that the original password, is indeed the original password,
        /// if both these checks pass, then the new password is updated and the user is saved
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Result of type User</returns>
        Task<bool> ChangePassword(ChangePasswordModel model);

        #endregion
        #region

        Task<UserEntity?> GetRandomUserAsync();

        Task<PostEntity?> GetRandomPostAsync();

        #endregion
    }
}
