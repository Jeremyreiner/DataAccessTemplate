import { Component, OnInit } from '@angular/core';
import {Card} from '../../models';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-mobile-credit-card-dialog',
  templateUrl: './mobile-credit-card-dialog.component.html',
  styleUrls: ['./mobile-credit-card-dialog.component.scss'],
})
export class MobileCreditCardDialogComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<MobileCreditCardDialogComponent>,
  ) { }

  ngOnInit() {}

  close(card: boolean = false) {
    this._bottomSheetRef.dismiss({event: 'creditCardUpdated', data: card});
  }

}

