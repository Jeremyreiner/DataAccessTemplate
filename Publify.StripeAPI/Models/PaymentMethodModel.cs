using Publify.StripeAPI.Enums;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Publify.StripeAPI.Models
{
    public class PaymentMethodModel
    {
        public PaymentMethodCardOptions? Card { get; set; }

        public PaymentMethodUsBankAccountOptions? BankAccountOptions { get; set; }

        public string Email { get; set; }

        public PaymentMethodType PaymentType { get; set; }

        public string FullName { get; set; }

    }
}
