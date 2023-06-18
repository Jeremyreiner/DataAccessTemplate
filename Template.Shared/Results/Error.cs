using System.Net;

namespace Template.Shared.Results
{
    public class Error
    {
        public HttpStatusCode Code { get; set; }

        public static readonly Error None = new();
        public static readonly Error Deleted = new(HttpStatusCode.NoContent);


        public Error() => 
            (Code) = (HttpStatusCode.OK);

        public Error(HttpStatusCode code)
        {
            Code = code;
        }
    }
}
