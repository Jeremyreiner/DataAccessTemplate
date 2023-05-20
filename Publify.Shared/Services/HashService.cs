namespace Publify.Shared.Services
{
    public static class HashService
    {
        public static string Hash(this string text)
        {
            var salt = BCrypt.Net.BCrypt.GenerateSalt();

            return BCrypt.Net.BCrypt.HashPassword(text, salt);
        }


        /// <summary>
        /// The string that this extensions is applied on, is un-hashed. The parameter of this extension is the hashed string.
        /// </summary>
        /// <param name="password"></param>
        /// <param name="hash"></param>
        /// <returns>True if the un-hashed & hashed strings match.</returns>
        public static bool VerifyHash(this string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
