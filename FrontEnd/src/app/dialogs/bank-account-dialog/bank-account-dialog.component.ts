import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services';
import {Card, BankAccountOptions, PaymentMethodModel, PaymentType} from '../../models';


@Component({
  selector: 'bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html'
})

export class BankAccountDialogComponent {
  bankAccount = new BankAccountOptions();

  constructor(
    public dialogRef: MatDialogRef<BankAccountDialogComponent>,
    public sheetRef: MatBottomSheetRef<BankAccountDialogComponent>,
    public dialogService: DialogService,
  ){}

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, '', '');
  }
}
