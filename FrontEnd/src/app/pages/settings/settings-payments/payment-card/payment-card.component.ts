import {Component, Input, OnInit} from '@angular/core';
import {CardModel} from '../../../../models';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
})
export class PaymentCardComponent implements OnInit {

  @Input() card: CardModel;
  constructor() { }

  ngOnInit() {}

  cardImage(brand: string): string {
    const baseUrl = '../../../../../assets/payments/';
    switch (brand) {
      case 'mastercard':
        return baseUrl + 'mastercard.png';
      case 'american express':
      case 'amex':
        return baseUrl + 'amex.png';
      case 'visa':
      case 'diners club':
      case 'discover':
      case 'eftpos australia':
      case 'JCB':
      case 'unionPay':
        return baseUrl + 'visa-pay-logo.png';

    }
  }


}
