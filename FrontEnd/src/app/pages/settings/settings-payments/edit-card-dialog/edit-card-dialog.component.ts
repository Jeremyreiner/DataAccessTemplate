import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CardModel} from '../../../../models';
import {ApiService} from '../../../../services';

@Component({
  selector: 'app-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: ['./edit-card-dialog.component.scss'],
})
export class EditCardDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardModel,
    private api: ApiService
  ) { }

  ngOnInit() {}

  async setDefaultPaymentMethod() {
    const keyVal = {DefaultPaymentMethodByLast4Digits: this.data.last4Digits};
    // @ts-ignore
    await this.api.updateCustomer(keyVal);
    this.close(true);
  }

  async deleteCard() {
    await this.api.DetachPaymentMethod(this.data.last4Digits);
    this.close(true);
  }

  close(update = false) {
    this.dialogRef.close(update);
  }
}
