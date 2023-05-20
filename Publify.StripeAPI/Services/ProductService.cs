using System.Runtime.InteropServices;
using Microsoft.Extensions.Configuration;
using Publify.StripeAPI.Exceptions;
using Publify.StripeAPI.Interfaces;
using Publify.StripeAPI.Models;
using Stripe;


namespace Publify.StripeAPI.Services
{
    public class ProductService : IProductService
    {
        readonly Stripe.ProductService _ProductService = new();
        readonly Stripe.PriceService _PriceService = new();
        private readonly IAccountService _AccountService;

        public ProductService(IAccountService accountService, IConfiguration configuration)
        {
            _AccountService = accountService;

            StripeConfiguration.ApiKey = configuration["TestKey"];
            //StripeConfiguration.ApiKey =
            //    "sk_test_51MUUgmAbs4VLClbtlND3SoCPq9J5RLtnaO5BWTGToxos7mMu3pWlF73S6138WP0GxT070vnHbJg8dLxbxsikPMoB00sJYXvoSb";
        }

        public async Task<string> CreateProductAsync(PriceOptionsModel priceOptions, string description, string name)
        {
            //Sets the product creation options.
            var options = new ProductCreateOptions
            {
                //Sets the price data/options.
                DefaultPriceData = new ProductDefaultPriceDataOptions
                {
                    Currency = priceOptions.Currency,
                    Recurring = new ProductDefaultPriceDataRecurringOptions
                    {
                        Interval = priceOptions.Interval,
                        IntervalCount = priceOptions.IntervalCount
                    },
                    UnitAmountDecimal = priceOptions.UnitAmount
                },
                Description = description,
                Name = name,
            };

            var product = await _ProductService.CreateAsync(options);

            return product.Id;
        }

        public async Task UpdateProductAsync(string productId, Dictionary<string, object> parameters)
        {
            var options = new ProductUpdateOptions();

            //Sets the fields wanted to be updated.
            foreach (var parameter in parameters)
            {
                switch (parameter.Key)
                {
                    case "Caption":
                        options.Caption = parameter.Value.ToString(); 
                        break;
                    case "Description":
                        options.Description = parameter.Value.ToString();
                        break;
                    case "Name":
                        options.Name = parameter.Value.ToString();
                        break;
                }
            }

            await _ProductService.UpdateAsync(productId, options);
        }

        public async Task ActivateProductAsync(string productId)
        {
            var productUpdateOptions = new ProductUpdateOptions
            {
                Active = true,
            };

            var product = await _ProductService.UpdateAsync(productId, productUpdateOptions);

            var priceUpdateOptions = new PriceUpdateOptions
            {
                Active = true
            };

            await _PriceService.UpdateAsync(product.DefaultPriceId, priceUpdateOptions);
        }

        //Deactivates product
        //Product cannot be deleted once created. For future reconciliation purposes.
        public async Task DeactivateProductAsync(string productId)
        {
            var productUpdateOptions = new ProductUpdateOptions
            {
                Active = false,
            };

            var product = await _ProductService.UpdateAsync(productId, productUpdateOptions);
            
            var priceUpdateOptions = new PriceUpdateOptions
            {
                Active = false
            };

            await _PriceService.UpdateAsync(product.DefaultPriceId, priceUpdateOptions);
        }

        public async Task<Product> RetrieveProductAsync(string productId)
        {
            var product = await _ProductService.GetAsync(productId);

            if (product is null)
                throw new NotFoundException($"Product with the ID {productId} was not found");
            
            return product;
        }
    }
}
