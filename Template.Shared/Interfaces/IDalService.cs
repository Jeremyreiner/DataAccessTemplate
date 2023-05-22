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

        /// <summary>
        /// Generates a new post object using faker data
        /// </summary>
        /// <returns></returns>
        Task<Result<PostEntity>> CreatePostAsync();

        #endregion

        #region Update

        /// <summary>
        /// Updates new user data using Faker randomly for selected user
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> UpdateAsync();

        /// <summary>
        /// Updates post data using Faker for random user
        /// </summary>
        /// <returns></returns>
        Task<Result<PostEntity>> UpdatePostAsync();

        #endregion

        #region Delete

        /// <summary>
        /// Deletes entity from DB
        /// </summary>
        /// <returns>HttpStatusResponse</returns>
        Task<Result<HttpStatusCode>> DeleteAsync();

        /// <summary>
        /// Deletes entity from DB
        /// </summary>
        /// <returns></returns>
        Task<Result<HttpStatusCode>> DeletePostAsync();

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

        /// <summary>
        /// Gets post randomly from DB
        /// </summary>
        /// <returns></returns>
        Task<Result<PostEntity>> GetPostByAsync();

        /// <summary>
        /// Gets post with follows randomly from DB
        /// </summary>
        /// <returns></returns>
        Task<Result<PostEntity>> GetPostWithAsync();

        #endregion

        #region Get AllBy

        /// <summary>
        /// Gets all User entities from DB.
        /// </summary>
        /// <returns>List of Users</returns>
        Task<List<UserEntity>> GetAllByAsync();

        /// <summary>
        /// Gets all posts from Db
        /// </summary>
        /// <returns></returns>
        Task<List<PostEntity>> GetAllPostsByAsync();

        #endregion

        #region Subscription

        /// <summary>
        /// Either a entity will subscribe to or unsubscribe from a randomly selected user entity.
        /// </summary>
        /// <returns>Result of type User</returns>
        Task<Result<UserEntity>> SubscribeToAsync();

        /// <summary>
        /// Randomly selects post and user. If the post has the user, the user is unfollowed, otherwise, followed
        /// </summary>
        /// <returns></returns>
        Task<Result<PostEntity>> FollowPostAsync();

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

        #region Error Check
        
        void CheckForThrow(Error error);

        #endregion
    }
}
