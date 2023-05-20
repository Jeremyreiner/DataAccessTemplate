import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Card, PaymentMethodModel, PaymentType} from '../../models';
import {ApiService, DialogService, StorageService} from '../../services';
import {ModalController} from '@ionic/angular';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-credit-card-dialog',
  templateUrl: './credit-card-dialog.component.html',
  styleUrls: ['./credit-card-dialog.component.scss'],
})
export class CreditCardDialogComponent implements OnInit {


  card = new Card();
  fullName = '';
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private storage: StorageService,
    private _sheetRef: MatBottomSheetRef<CreditCardDialogComponent>,
    private dialogRef: MatDialogRef<CreditCardDialogComponent>,
    public dialogService: DialogService,
  ) { }

  ngOnInit() {}

  async createPaymentMethod() {
    this.isLoading = true;
    const paymentMethodModel = new PaymentMethodModel();
    paymentMethodModel.card = this.card;
    paymentMethodModel.paymentType = PaymentType.card;
    paymentMethodModel.email = this.storage.getUser().email;
    paymentMethodModel.fullName = this.fullName;
    await this.api.createPaymentMethod(paymentMethodModel);
    this.close(true);
    this.isLoading = false;
  }

  async close(card: boolean = false) {
    await this.dialogService.close(this.dialogRef, this._sheetRef, {event: 'creditCardUpdated', data: card});
  }
}
