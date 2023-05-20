export class CardModel {
  fullName: string;
  last4Digits: string;
  expMonth: number;
  expYear: number;
  cvcCheck: string;
  isDefaultPaymentMethod: boolean;
  /**
   * possible values
   * American Express, Diners Club, Discover, Eftpos Australia, JCB, MasterCard, UnionPay, Visa
   *
   */
  brand: string;
}
