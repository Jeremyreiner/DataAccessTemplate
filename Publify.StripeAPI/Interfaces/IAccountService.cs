using Stripe;

namespace Publify.StripeAPI.Interfaces
{
    public interface IAccountService
    {
        /// <summary>
        /// Creates a Teacher's connected account.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="fullName"></param>
        /// <param name="phoneNumber"></param>
        /// <param name="city"></param>
        /// <param name="country">2-letter country code.</param>
        /// <param name="line1"></param>
        /// <param name="postalCode"></param>
        /// <param name="state"></param>
        /// <param name="line2">Optional parameter for longer addresses.</param>
        /// <param name="paymentMethodId">Optional parameter for adding a payment method.</param>
        /// <returns>Link for a Teacher to finish their connected account onboarding.</returns>
        Task CreateAccountAsync(string email, string fullName, string phoneNumber, string country);

        Task<string> CreateAccountLinkAsync(Account account);

        /// <summary>
        /// Updates an account. Only email for now.
        /// </summary>
        /// <param name="currentEmail"></param>
        /// <param name="newEmail"></param>
        /// <returns></returns>
        Task UpdateAccountAsync(string currentEmail, string newEmail);

        /// <summary>
        /// Retrieves an account.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task<Account> RetrieveAccountAsync(string email);

        /// <summary>
        /// Deletes connected account.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task DeleteAccountAsync(string email);

        Task<bool> CheckHasDetailsSubmitted(string email);
    }
}
