using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Publify.StripeAPI.Exceptions;
using Publify.StripeAPI.Interfaces;
using Stripe;

namespace Publify.StripeAPI.Services
{
    public class AccountService : IAccountService
    {
        readonly ICustomerService _CustomerService;
        readonly ILogger<AccountService> _Logger;
        readonly Stripe.AccountService _AccountService = new();
        readonly AccountLinkService _AccountLinkService = new();

        public AccountService(ICustomerService customerService, ILogger<AccountService> logger, IConfiguration configuration)
        {
            _CustomerService = customerService;
            _Logger = logger;
            StripeConfiguration.ApiKey = configuration["TestKey"];

            //StripeConfiguration.ApiKey =
            //    "sk_test_51MUUgmAbs4VLClbtlND3SoCPq9J5RLtnaO5BWTGToxos7mMu3pWlF73S6138WP0GxT070vnHbJg8dLxbxsikPMoB00sJYXvoSb";
        }

        //TODO: Refresh URL & Return URL must be set.
        //Creates a link to finish account creation process.
        public async Task<string> CreateAccountLinkAsync(Account account)
        {
            //Sets the options for link creation.
            var options = new AccountLinkCreateOptions
            {
                Account = account.Id,
                RefreshUrl = "https://www.facebook.com",
                //ReturnUrl = "https://publifysolutions.com/settings/payment/account-connected", //live link returnal
                ReturnUrl = "https://localhost:4500/settings/payment/account-connected", //debug link returnal

                Type = "account_onboarding"
            };

            _Logger.LogWarning("Refresh URL & Return URL are not set! Please set when ready. Remove logger injection afterwards.");

            return (await _AccountLinkService.CreateAsync(options)).Url;
        }

        public async Task CreateAccountAsync(string email, string fullName, string phoneNumber, string country)
        {
            //Sets the options for account creation.
            var options = new AccountCreateOptions
            {
                BusinessType = "individual",
                Country = country,
                Email = email,
                Metadata = new Dictionary<string, string>()
                {
                    {"FirstName", $"{fullName.Split(" ").FirstOrDefault()}"},
                    {"LastName", $"{fullName.Split(" ").LastOrDefault()}"},
                },
                Type = "express",
            };

            //Creates an account.
            var account = await _AccountService.CreateAsync(options);

            //Creates a customer.
            //await _CustomerService.CreateCustomerAsync(email, fullName, phoneNumber, account);
        }

        public async Task UpdateAccountAsync(string currentEmail, string newEmail)
        {
            var account = await RetrieveAccountAsync(currentEmail);

            var options = new AccountUpdateOptions
            {
                Email = newEmail
            };

            await _AccountService.UpdateAsync(account.Id, options);
        }

        public async Task DeleteAccountAsync(string email)
        {
            var account = await RetrieveAccountAsync(email);

            //Deletes account's customer counterpart.
            await _CustomerService.DeleteCustomerAsync(email);

            await _AccountService.DeleteAsync(account.Id);
        }

        public async Task<bool> CheckHasDetailsSubmitted(string email)
        {
            var account = await RetrieveAccountAsync(email);

            return account.DetailsSubmitted;
        }

        public async Task<Account> RetrieveAccountAsync(string email)
        {
            //Gets relevant account.
            var account = (await _AccountService.ListAsync()).FirstOrDefault(a => a.Email == email);

            if (account is null)
                throw new NotFoundException($"Account with email {email} was not found.");

            return account;
        }
    }
}
