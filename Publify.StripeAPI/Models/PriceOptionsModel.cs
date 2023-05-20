namespace Publify.StripeAPI.Models
{
    public class PriceOptionsModel
    {
        /// <summary>
        /// Three-letter <a href="https://www.iso.org/iso-4217-currency-codes.html">ISO currency
        /// code</a>, in lowercase. Must be a <a href="https://stripe.com/docs/currencies">supported
        /// currency</a>.
        /// </summary>
        public string Currency { get; set; } = null!;

        /// <summary>
        /// Specifies billing frequency. Either <c>day</c>, <c>week</c>, <c>month</c> or
        /// <c>year</c>.
        /// One of: <c>day</c>, <c>month</c>, <c>week</c>, or <c>year</c>.
        /// </summary>
        public string Interval { get; set; } = null!;

        /// <summary>
        /// The number of intervals between subscription billings. For example,
        /// <c>interval=month</c> and <c>interval_count=3</c> bills every 3 months. Maximum of one
        /// year interval allowed (1 year, 12 months, or 52 weeks).
        /// </summary>
        public long? IntervalCount { get; set; }

        /// <summary>
        /// A positive integer in cents (or local equivalent) (or 0 for a free price) representing
        /// how much to charge.
        /// </summary>
        public long? UnitAmount { get; set; }
    }
}
