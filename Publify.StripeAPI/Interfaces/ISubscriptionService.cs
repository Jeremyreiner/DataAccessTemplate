namespace Publify.StripeAPI.Interfaces;

public interface ISubscriptionService
{
    /// <summary>
    /// Creates a subscription.
    /// </summary>
    /// <param name="studentEmail"></param>
    /// <param name="teacherEmail"></param>
    /// <param name="productId"></param>
    /// <param name="couponId">Optional field for adding a coupon.</param>
    /// <returns></returns>
    Task<string> CreateSubscriptionAsync(string studentEmail, string teacherEmail, string productId, string? couponId = null);

    Task CancelSubscriptionAsync(string subscriptionId);
}