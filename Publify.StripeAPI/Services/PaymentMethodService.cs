using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Publify.StripeAPI.Enums;
using Publify.StripeAPI.Exceptions;
using Publify.StripeAPI.Interfaces;
using Publify.StripeAPI.Models;
using Stripe;

namespace Publify.StripeAPI.Services
{
    public class PaymentMethodService : IPaymentMethodService
    {
        readonly ICustomerService _CustomerService;
        readonly IAccountService _AccountService;
        readonly Stripe.PaymentMethodService _PaymentMethodService = new();

        public PaymentMethodService(ICustomerService customerService, IAccountService accountService, IConfiguration configuration)
        {
            _CustomerService = customerService;
            _AccountService = accountService;

            StripeConfiguration.ApiKey = configuration["TestKey"];
                //"sk_test_51MUUgmAbs4VLClbtlND3SoCPq9J5RLtnaO5BWTGToxos7mMu3pWlF73S6138WP0GxT070vnHbJg8dLxbxsikPMoB00sJYXvoSb";
        }

        public async Task CreateAndAttachPaymentMethodAsync(PaymentMethodType paymentMethodType, string email, string fullName,
            PaymentMethodCardOptions? cardOptions = null, PaymentMethodUsBankAccountOptions? bankAccountOptions = null)
        {
            //Gets the customer.
            var customer = await _CustomerService.RetrieveCustomerAsync(email);

            //Starts setting the necessary options for payment method creation.
            var options = new PaymentMethodCreateOptions
            {
                Type = paymentMethodType.ToString(),
                BillingDetails = new PaymentMethodBillingDetailsOptions
                {
                    Email = email,
                    Name = fullName,
                    Phone = customer.Phone
                },
            };

            //Sets the correct information according to the payment method type.
            switch (paymentMethodType)
            {
                case PaymentMethodType.affirm:
                case PaymentMethodType.afterpay_clearpay:
                case PaymentMethodType.customer_balance:
                case PaymentMethodType.link:
                    break;
                case PaymentMethodType.card:
                    options.Card = new PaymentMethodCardOptions
                    {
                        Cvc = cardOptions!.Cvc,
                        ExpMonth = cardOptions.ExpMonth,
                        ExpYear = cardOptions.ExpYear,
                        Number = cardOptions.Number
                    };
                    break;
                case PaymentMethodType.us_bank_account:
                    options.UsBankAccount = new PaymentMethodUsBankAccountOptions
                    {
                        AccountNumber = bankAccountOptions!.AccountNumber,
                        RoutingNumber = bankAccountOptions.RoutingNumber,
                    };
                    break;
                default:
                    throw new NotFoundException($"The type of payment {paymentMethodType} is not supported.");
            }

            var payment = await _PaymentMethodService.CreateAsync(options);

            await AttachPaymentMethodAsync(payment.Id, customer.Id);

            //We must also update customer to set the payment method to default.
            await _CustomerService.UpdateCustomerAsync(customer.Email, new Dictionary<string, string>
            {
                {"DefaultPaymentMethodId", payment.Id}
            });
        }

        public async Task UpdatePaymentMethodAsync(string paymentMethodId, Dictionary<string, object> parameters)
        {
            var options = new PaymentMethodUpdateOptions();

            //Sets the fields wanted to be updated.
            foreach (var parameter in parameters)
            {
                switch (parameter.Key)
                {
                    case "Email":
                        options.BillingDetails.Email = parameter.Value.ToString();
                        break;
                    case "Name":
                        options.BillingDetails.Name = parameter.Value.ToString();
                        break;
                    case "Phone":
                        options.BillingDetails.Phone = parameter.Value.ToString();
                        break;
                    case "Card":
                        options.Card = (PaymentMethodCardOptions)parameter.Value;
                        break;
                    case "UsBankAccount":
                        options.UsBankAccount = (PaymentMethodUsBankAccountOptions)parameter.Value;
                        break;
                }
            }

            await _PaymentMethodService.UpdateAsync(paymentMethodId, options);
        }

        public async Task DetachPaymentMethodAsync(string email, string last4Digits)
        {
            var customer = await _CustomerService.RetrieveCustomerAsync(email);

            var listOptions = new PaymentMethodListOptions { Customer = customer.Id };

            var paymentMethods = await _PaymentMethodService.ListAsync(listOptions);

            var cardPaymentMethod = paymentMethods.First(p => p.Card.Last4 == last4Digits);

            var paymentMethod = await RetrievePaymentMethodAsync(cardPaymentMethod.Id);

            await _PaymentMethodService.DetachAsync(paymentMethod.Id);
        }

        public async Task<List<CardModel>> RetrieveAllCards(string email)
        {
            var customer = await _CustomerService.RetrieveCustomerAsync(email);

            var options = new PaymentMethodListOptions
            {
                Type = "card",
                Customer = customer.Id,
            };

            var paymentMethods = (await _PaymentMethodService.ListAsync(options)).Data;

            var cards = paymentMethods.Select(p => new CardModel
                {
                    FullName = p.BillingDetails.Name,
                    Last4Digits = p.Card.Last4,
                    ExpMonth = p.Card.ExpMonth,
                    ExpYear = p.Card.ExpYear,
                    CvcCheck = p.Card.Checks.CvcCheck,
                    IsDefaultPaymentMethod = p.Id == customer.InvoiceSettings.DefaultPaymentMethodId,
                    Brand = p.Card.Brand
                })
                .ToList();

            var metaData = customer.Metadata["Account"];

            if (metaData == string.Empty) return cards;

            cards.Add(AttachMetaData(customer.Name, metaData));

            return cards;
        }

        /// <summary>
        /// On creation of customer from an account, metadata is added containing Last4 of bank number
        /// and bank name. This way, on return of all payment options we can present that a bank was added
        /// on completion of onboarding and the teacher can still see relavent information
        /// </summary>
        /// <param name="fullName"></param>
        /// <param name="metaData"></param>
        /// <returns></returns>
        CardModel AttachMetaData(string fullName, string metaData)
        {
            var digits = metaData.Split(";").LastOrDefault();
            var name = metaData.Split(";").FirstOrDefault();

            return new CardModel
            {
                FullName = fullName,
                Last4Digits = string.IsNullOrEmpty(digits) ? "0000" : digits,
                Brand = string.IsNullOrEmpty(name) ? "0000" : name
            };
        }

        //After payment method creation, attaches payment method to desired customer.
        async Task AttachPaymentMethodAsync(string paymentMethodId, string customerId)
        {
            var options = new PaymentMethodAttachOptions
            {
                Customer = customerId,
            };

            await _PaymentMethodService.AttachAsync(paymentMethodId, options);
        }

        //Queries and retrieves the payment method object with the inserted email.
        async Task<PaymentMethod> RetrievePaymentMethodAsync(string paymentMethodId)
        {
            var paymentMethod = await _PaymentMethodService.GetAsync(paymentMethodId);

            if (paymentMethod is null)
                throw new NotFoundException("Payment method was not found.");

            return await _PaymentMethodService.GetAsync(paymentMethod.Id);
        }
    }
}
