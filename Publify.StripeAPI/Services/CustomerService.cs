using System.Configuration;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Publify.StripeAPI.Exceptions;
using Publify.StripeAPI.Interfaces;
using Publify.StripeAPI.Models;
using Stripe;

namespace Publify.StripeAPI.Services
{
    public class CustomerService : ICustomerService
    {
        readonly Stripe.CustomerService _CustomerService = new();
        readonly Stripe.PaymentMethodService _PaymentMethodService = new();

        public CustomerService(IConfiguration configuration)
        {
            StripeConfiguration.ApiKey = configuration["TestKey"];
            //"sk_test_51MUUgmAbs4VLClbtlND3SoCPq9J5RLtnaO5BWTGToxos7mMu3pWlF73S6138WP0GxT070vnHbJg8dLxbxsikPMoB00sJYXvoSb";
        }

        public async Task CreateCustomerAsync(string email, string fullName, string phoneNumber, Stripe.Account? account = null)
        {
            var metaData = string.Empty;

            if (account is not null)
            {
                metaData = CopyPaymentFromAccountToCustomer(account);
            }

            //Sets the necessary options to create a customer.
            var options = new CustomerCreateOptions
            {
                Email = email,
                Name = fullName,
                Phone = phoneNumber,
                Metadata = new Dictionary<string, string>
                {
                    {"Account",metaData}
                },
            };

            ////When creating a teacher, sets the account ID in the metadata.
            //if (account is not null)
            //    await _CustomerService.CreateAsync(options, new RequestOptions { StripeAccount = account.Id });

            await _CustomerService.CreateAsync(options);
        }

        string CopyPaymentFromAccountToCustomer(Stripe.Account account)
        {
            var externals = account.ExternalAccounts.Data;

            var json = JsonConvert.SerializeObject(externals.FirstOrDefault());

            var root = JsonDocument.Parse(json).RootElement;

            return $"{root.GetProperty("bank_name")};{root.GetProperty("last4")}";
        }

        public async Task UpdateCustomerAsync(string email, Dictionary<string, string> parameters)
        {
            var customer = await RetrieveCustomerAsync(email);

            var options = new CustomerUpdateOptions();

            //Sets the fields wanted to be updated.
            foreach (var parameter in parameters)
            {
                switch (parameter.Key)
                {
                    case "Email":
                        options.Email = parameter.Value;
                        break;

                    case "DefaultPaymentMethodId":
                        options.InvoiceSettings = new CustomerInvoiceSettingsOptions { DefaultPaymentMethod = parameter.Value };
                        break;

                    case "DefaultPaymentMethodByLast4Digits":
                        var listOptions = new PaymentMethodListOptions { Type = "card", Customer = customer.Id };

                        var paymentMethods = await _PaymentMethodService.ListAsync(listOptions);

                        var payment = paymentMethods.First(p => p.Card.Last4 == parameter.Value);

                        options.InvoiceSettings = new CustomerInvoiceSettingsOptions { DefaultPaymentMethod = payment.Id };
                        break;

                    case "Name":
                        options.Name = parameter.Value;
                        break;

                    case "Phone":
                        options.Phone = parameter.Value;
                        break;
                }
            }

            await _CustomerService.UpdateAsync(customer.Id, options);
        }

        //Queries and retrieves the customer object with the inserted email.
        public async Task<Customer> RetrieveCustomerAsync(string email)
        {
            //Sets the customer search options.
            var options = new CustomerSearchOptions
            {
                Query = $"email:'{email}'"
            };

            //Gets needed customer from search list.
            var customer = (await _CustomerService.SearchAsync(options)).Data.FirstOrDefault();

            if (customer is null)
                throw new NotFoundException($"Customer with the email address '{email}' was not found.");

            return customer;
        }

        public async Task DeleteCustomerAsync(string email)
        {
            var customerId = (await RetrieveCustomerAsync(email))?.Id;

            await _CustomerService.DeleteAsync(customerId);
        }
    }
}
