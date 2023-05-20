using System.Net;

namespace Publify.Shared.Results
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

        protected internal Result(T value, HttpStatusCode status, Error error)
        {
            Value = value;
            Status = status;
            Error = error;
        }

        public static Result<T> Success(T value) => new(value, HttpStatusCode.OK, Error.None);
        public static Result<HttpStatusCode> Deleted() => new(Error.None);
        public static Result<T> Failed(Error error) => new(error);
    }
}