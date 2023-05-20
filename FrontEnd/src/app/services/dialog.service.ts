import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {DialogConfig} from '../models';

@Injectable()
export class DialogService {

  constructor(
    public dialog: MatDialog,
    public bottomSheetRef: MatBottomSheet
  ) {}

  openDialog(dialogConfig: DialogConfig) {
    let ref;
    if (window.innerWidth > 768) {
      ref =  this.dialog.open(dialogConfig.component, {
      width: (dialogConfig.width ?? 500).toString() + 'px',
      data: dialogConfig.data
    });
      ref.afterClosed().subscribe(dialogConfig.afterClosed);
      return ref;
    }
    ref = this.bottomSheetRef.open(dialogConfig.component, {
      data: dialogConfig.data
    });
    ref.afterDismissed().subscribe(dialogConfig.afterClosed);
    return ref;
  }


  async close(dialogRef: MatDialogRef<any> = null, sheetRef: MatBottomSheetRef<any> = null, data: any = null, event: string = null) {
    const dialogResult = {
      event,
      data
    };
    if(dialogRef.id) {
      dialogRef.close(dialogResult);
      return;
    }
    if(sheetRef.containerInstance) {
      sheetRef.dismiss(dialogResult);
    }
  }

}
