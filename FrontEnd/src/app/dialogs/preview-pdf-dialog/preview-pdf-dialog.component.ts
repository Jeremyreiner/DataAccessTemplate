import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ApiService} from '../../services';

@Component({
  selector: 'app-preview-pdf-dialog',
  templateUrl: './preview-pdf-dialog.component.html',
  styleUrls: ['./preview-pdf-dialog.component.css']
})
export class PreviewPdfDialogComponent implements OnInit {

  @ViewChild('pdfViewer') public pdfViewer;
  file: any;
  isLoading = true;

  constructor(private api: ApiService, @Inject(MAT_DIALOG_DATA) public data?: string) {
  }

  async ngOnInit(): Promise<void> {
    await this.downloadPdfNgJs(this.data);
   // this.file = await this.api.downloadFile(this.data.fileName); //ngx
  }

  downloadPdfNgJs(filename: string) {
    this.api.downloadFile(filename).subscribe(
      (res) => {
        this.pdfViewer.pdfSrc = res;
        this.pdfViewer.refresh();
        this.isLoading = false;
      }
    );
  }

  downloadPdfNgx(filename: string) {
    this.api.downloadFile(filename).subscribe(
      (res) => {
        this.file = res;
      }
    );
  }
}
