using Publify.StripeAPI.Enums;
using Publify.StripeAPI.Models;
using Stripe;

namespace Publify.StripeAPI.Interfaces
{
    public interface IPaymentMethodService
    {
        /// <summary>
        /// Creates a payment method and attaches it to a customer.
        /// </summary>
        /// <param name="paymentMethodType"></param>
        /// <param name="email"></param>
        /// <param name="fullName"></param>
        /// <param name="cardOptions">Optional parameter for cardOptions</param>
        /// <param name="bankAccountOptions">Optional parameter for bankaccount.</param>
        /// <returns></returns>
        Task CreateAndAttachPaymentMethodAsync(PaymentMethodType paymentMethodType,
            string email, string fullName, PaymentMethodCardOptions? cardOptions = null,
            PaymentMethodUsBankAccountOptions? bankAccountOptions = null);

        /// <summary>
        /// Updates a customer
        /// </summary>
        /// <param name="paymentMethodId"></param>
        /// <param name="parameters">Dictionary where you can set any of the following updateable parameters. BillingDetails, Card & UsBankAccount</param>
        /// <returns></returns>
        Task UpdatePaymentMethodAsync(string paymentMethodId, Dictionary<string, object> parameters);

        /// <summary>
        /// Deletes payment method from customer.
        /// </summary>
        /// <param name="email"></param>
        /// <param name="last4Digits"></param>
        /// <returns></returns>
        Task DetachPaymentMethodAsync(string email, string last4Digits);

        Task<List<CardModel>> RetrieveAllCards(string email);
    }
}
