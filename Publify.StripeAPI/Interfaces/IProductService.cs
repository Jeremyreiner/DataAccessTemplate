using Publify.StripeAPI.Models;
using Stripe;

namespace Publify.StripeAPI.Interfaces
{
    public interface IProductService
    {
        /// <summary>
        /// Creates a product..
        /// </summary>
        /// <param name="priceOptions">An object to set the wanted options for the price.</param>
        /// <param name="description">Description of the product.</param>
        /// <param name="name">Name of the product</param>
        /// <param name="publicKey">Account connection to product</param>
        /// <returns>product Id</returns>
        Task<string> CreateProductAsync(PriceOptionsModel priceOptions, string description, string name);

        /// <summary>
        /// Updates a product.
        /// </summary>
        /// <param name="productId"></param>
        /// <param name="parameters">Dictionary where you can set any of the following updateable parameters. Caption, Description & Name</param>
        /// <returns></returns>
        Task UpdateProductAsync(string productId, Dictionary<string, object> parameters);

        /// <summary>
        /// Activates an unactivated product.
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        Task ActivateProductAsync(string productId);

        /// <summary>
        /// Deactivates product.
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        Task DeactivateProductAsync(string productId);

        /// <summary>
        /// Retrieves a product.
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        Task<Product> RetrieveProductAsync(string productId);
    }
}
