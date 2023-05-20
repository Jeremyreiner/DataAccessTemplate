using Stripe;

namespace Publify.StripeAPI.Interfaces
{
    public interface ICustomerService
    {
        /// <summary>
        /// Creates a customer.
        /// <param name="email"></param>
        /// <param name="fullName"></param>
        /// <param name="phoneNumber"></param>
        /// <param name="accountId">When creating a teacher, accountId must be added as part of the customer.</param>
        /// <returns></returns>
        /// </summary>
        Task CreateCustomerAsync(string email, string fullName, string phoneNumber, Stripe.Account? account);

        /// <summary>
        /// Updates a customer.
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="parameters">Dictionary where you can set any of the following updateable parameters. Email, InvoiceSettings, Name & Phone.</param>
        /// <returns></returns>
        Task UpdateCustomerAsync(string customerId, Dictionary<string, string> parameters);

        /// <summary>
        /// Retrieves a customer.
        /// </summary>
        /// <param name="email"></param>
        /// <returns>The customer with inserted email, if exists.</returns>
        Task<Customer> RetrieveCustomerAsync(string email);

        /// <summary>
        /// Deletes customer.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task DeleteCustomerAsync(string email);
    }
}
