using Microsoft.Extensions.Configuration;
using Publify.StripeAPI.Interfaces;
using Stripe;

namespace Publify.StripeAPI.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        readonly ICustomerService _CustomerService;
        readonly IAccountService _AccountService;
        readonly IProductService _ProductService;
        readonly Stripe.SubscriptionService _SubscriptionService = new();

        public SubscriptionService(ICustomerService customerService, IAccountService accountService, IProductService productService, IConfiguration configuration)
        {
            _CustomerService = customerService;
            _AccountService = accountService;
            _ProductService = productService;

            StripeConfiguration.ApiKey = configuration["TestKey"];
            //StripeConfiguration.ApiKey =
            //    "sk_test_51MUUgmAbs4VLClbtlND3SoCPq9J5RLtnaO5BWTGToxos7mMu3pWlF73S6138WP0GxT070vnHbJg8dLxbxsikPMoB00sJYXvoSb";
        }

        public async Task<string> CreateSubscriptionAsync(string studentEmail, string teacherEmail, string productId, string? couponId = null)
        {
            //Gets the relevant customer object.
            var customer = await _CustomerService.RetrieveCustomerAsync(studentEmail);

            //Gets the relevant connected account object.
            var account = await _AccountService.RetrieveAccountAsync(teacherEmail);

            //Gets the relevant product.
            var product = await _ProductService.RetrieveProductAsync(productId);

            //Sets the subscription options.
            var options = new SubscriptionCreateOptions
            {
                ApplicationFeePercent = 50,
                Coupon = couponId,
                Customer = customer.Id,
                Items = new List<SubscriptionItemOptions>
                {
                    new() { Price = product.DefaultPriceId }
                },
                TransferData = new SubscriptionTransferDataOptions
                {
                    Destination = account.Id
                },
            };

            var subscription = await _SubscriptionService.CreateAsync(options);

            return subscription.Id;
        }

        public async Task CancelSubscriptionAsync(string subscriptionId) =>
            await _SubscriptionService.CancelAsync(subscriptionId);
        
    }
}
