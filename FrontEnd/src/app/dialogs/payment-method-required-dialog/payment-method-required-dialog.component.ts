import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services';
import {Router} from "@angular/router";
import {RouteNames} from "../../constants";

@Component({
  selector: 'payment-method-required-dialog',
  templateUrl: './payment-method-required-dialog.component.html'
})

export class PaymentMethodRequiredDialogComponent {
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentMethodRequiredDialogComponent>,
    public sheetRef: MatBottomSheetRef<PaymentMethodRequiredDialogComponent>,
    public dialogService: DialogService,
    private router: Router,
  ){}

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, '', '');
  }

  async openPaymentSettings() {
    this.isLoading = true;
    setTimeout(() => {
      this.router.navigate([RouteNames.settingsPayment]);
      this.close();
      this.isLoading = false;
    }, 1000);
  }
}
