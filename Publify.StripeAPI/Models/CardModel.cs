namespace Publify.StripeAPI.Models
{
    public class CardModel
    {
        public string FullName { get; set; } = null!;

        public string Last4Digits { get; set; } = null!;

        public long ExpMonth { get; set; }

        public long ExpYear { get; set; }

        public string CvcCheck { get; set; } = null!;

        public bool IsDefaultPaymentMethod { get; set; }

        public string Brand { get; set; } = null!;
    }
}
