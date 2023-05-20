namespace Publify.StripeAPI.Enums
{
    /// <summary>
    /// Enum of payment methods.
    /// Currently only supports US based payment methods.
    /// </summary>
    public enum PaymentMethodType
    {
        /// <summary>
        /// Affirm is a buy now, pay later payment method in the US.
        /// </summary>
        affirm,

        /// <summary>
        /// Afterpay / Clearpay is a buy now, pay later payment method used in Australia, Canada, France, New Zealand, Spain, the UK, and the US.
        /// </summary>
        afterpay_clearpay,

        /// <summary>
        /// Card payments are supported through many networks and card brands.
        /// </summary>
        card,

        /// <summary>
        /// Uses a customer’s cash balance for the payment.
        /// </summary>
        customer_balance,

        /// <summary>
        /// Link allows customers to pay with their saved payment details.
        /// </summary>
        link,

        /// <summary>
        /// ACH Direct Debit is used to debit US bank accounts through the Automated Clearing House (ACH) payments system.
        /// </summary>
        us_bank_account
    }
}
