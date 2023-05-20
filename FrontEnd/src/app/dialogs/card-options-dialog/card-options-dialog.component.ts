import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, StorageService} from '../../services';
import {CardModel, SubscriptionModel, Teacher} from "../../models";

@Component({
  selector: 'card-options-dialog',
  templateUrl: './card-options-dialog.component.html'
})

export class CardOptionsDialogComponent implements OnInit {

  card: CardModel;
  cards: CardModel[];
  isLoading = false;
  isDeleting = false;
  isSettingDefault = false;
  teachers: Teacher[] = [];

  constructor(
    public dialogRef: MatDialogRef<CardOptionsDialogComponent>,
    public sheetRef: MatBottomSheetRef<CardOptionsDialogComponent>,
    public storage: StorageService,
    public dialogService: DialogService,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
  ){
    this.cards = dialogData.cards ?? sheetData.cards;
    this.card = this.cards[dialogData.index ?? sheetData.index];
  }

  async ngOnInit(){
    await this.getSubscriptions();
  }

  async setDefaultPaymentMethod() {
    this.isSettingDefault = true;
    const keyVal = {DefaultPaymentMethodByLast4Digits: this.card.last4Digits};
    // @ts-ignore
    await this.api.updateCustomer(keyVal);
    await this.close('default');
    this.isSettingDefault = false;
  }

  async deleteCard() {
    this.isDeleting = true;
    await this.api.DetachPaymentMethod(this.card.last4Digits);
    await this.close('deleted');
    this.isDeleting = false;
  }

  async getSubscriptions() {
    this.teachers = await this.api.getTeachers();
  }

  async close(data?: any) {
    await this.dialogService.close(this.dialogRef, this.sheetRef, data, '');
  }
}
