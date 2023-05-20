import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  isMobile =  window.innerWidth < 768;
  horizontalPosition: MatSnackBarHorizontalPosition = this.isMobile ? 'center' : 'start';
  verticalPosition: MatSnackBarVerticalPosition = this.isMobile ? 'top' : 'bottom';

  constructor(private snackBar: MatSnackBar) { }

  openToast(message: string, success: boolean, duration: number = 6000) {
    setTimeout(() => {
      this.snackBar.open(message, 'Close', {
        duration: duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: success ? ['toast-success'] : ['toast-failure'],
      });
    },1000)
  }

}
