using System.Net;

namespace Template.Shared.Results
{
    public class Result<T>
    {
        public bool IsSuccess => Status == HttpStatusCode.OK;
        public HttpStatusCode Status { get; set; }
        public Error Error { get; set; }
        public T Value { get; set; }

        protected internal Result(Error error)
        {
            Status = error.Code;
            Error = error;
        }

        protected internal Result(T value)
        {
            Value = value;
            Status = HttpStatusCode.OK;
            Error = Error.None;
        }

        /// <summary>
        /// Result.Success occurs when an entity is successfully retrieved from the db.
        /// This static method, uses the internal constructor to return a value of type T,
        /// And the appropriate status code with it. Error.None returns an empty error, with a sweet
        /// message attached
        /// </summary>
        /// <param name="value">T value</param>
        /// <returns>Result of type T</returns>
        public static Result<T> Success(T value) => new(value);
        
        /// <summary>
        /// Result.Deleted occurs currently upon the deletion of an entity,
        /// Error.None returns an empty error, with a sweet message attached,
        /// This method requires of type HttpsStatusCode.
        /// </summary>
        /// <returns>Result of type HttpsStatusCode</returns>
        public static Result<HttpStatusCode> Deleted() => new(Error.None);

        /// <summary>
        /// Result.Failure, catches Error of type T, and initializes a failed Result of that error type.
        /// The Result object then corrects the boolean from succesful to failed, for easy access of the
        /// failed exception.
        /// </summary>
        /// <param name="error">Error object</param>
        /// <returns>Result of Failure T</returns>
        public static Result<T> Failed(Error error) => new(error);
    }
}