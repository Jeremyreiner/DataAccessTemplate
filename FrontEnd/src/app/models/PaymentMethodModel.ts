import {PaymentMethodType} from "@stripe/stripe-js";

export enum PaymentType {

  /// <summary>
  /// Affirm is a buy now, pay later payment method in the US.
  /// </summary>
  affirm,

  /// <summary>
  /// Afterpay / Clearpay is a buy now, pay later payment method used in Australia, Canada, France, New Zealand, Spain, the UK, and the US.
  /// </summary>
  afterpay_clearpay,

  /// <summary>
  /// Card payments are supported through many networks and card brands.
  /// </summary>
  card,

  /// <summary>
  /// Uses a customer’s cash balance for the payment.
  /// </summary>
  customer_balance,

  /// <summary>
  /// Link allows customers to pay with their saved payment details.
  /// </summary>
  link,

  /// <summary>
  /// ACH Direct Debit is used to debit US bank accounts through the Automated Clearing House (ACH) payments system.
  /// </summary>
  us_bank_account
}

export class PaymentMethodModel {
  card: Card;
  bankAccountOptions: BankAccountOptions;
  email: string;
  paymentType: PaymentType;
  fullName: string;
}

export class Card {
  cvc = '';
  expMonth = 0;
  expYear = 0;
  // eslint-disable-next-line id-blacklist
  number = 0;
  token = '';
}

export class BankAccountOptions {
  accountHolderType: string;
  accountNumber: string;
  accountType: string;
  financialConnectionsAccount: string;
  routingNumber: string;
}
