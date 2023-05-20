import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DataService, ApiService, StorageService} from '../../services';
import {LastReadBook, UserModel} from '../../models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-ereader',
  templateUrl: './ereader.component.html',
  styleUrls: ['./ereader.component.scss'],
})
export class EReaderComponent implements OnInit {

  @ViewChild('pdfViewer') public pdfViewer;
  user: UserModel;
  isLoading = false;
  file: any;
  init = true;

  constructor(private api: ApiService, private router: Router,
              private storage: StorageService,
              private dataService: DataService,
              private dialogRef: MatDialogRef<EReaderComponent>) {}

  async ngOnInit(): Promise<void> {
    const lastRead = this.storage.getLastRead();
    const index = lastRead.findIndex(a => a.id === this.dataService.bookId);
    const page = index !== -1? lastRead[index].pageNo : 1;
    await this.downloadPdfNgJs(this.dataService.bookId, page);
    this.init = false;
    await this.api.incrementBookViews(this.dataService.bookId);
  }

  downloadPdfNgJs(filename: string, page: number) {
    this.api.downloadFile(filename).subscribe(
      (res) => {
        this.pdfViewer.pdfSrc = res;
        this.pdfViewer.page = page;
        this.pdfViewer.refresh();
        this.isLoading = false;
      }
    );
  }

  async goBack() {
    const lastRead = this.storage.getLastRead();
    const oldEntry = lastRead.findIndex(a => a.id === this.dataService.bookId);
    if(oldEntry !== -1) {
      lastRead.splice(oldEntry, 1);
    }
    lastRead.unshift(new LastReadBook(this.dataService.bookId, this.pdfViewer.page));
    if (lastRead.length > 5) {
      lastRead.pop();
    }
    this.storage.setLastRead(lastRead);
    this.dialogRef.close();
  }
}






//alternative pdf viewer keep as option if needed in future dont delete it you sharmoota

//this.file = await this.api.downloadFile(this.dataService.bookId); //ngx
// this.downloadPdfNgx(this.dataService.bookId);

// downloadPdfNgx(filename: string) {
//   this.api.downloadFile(filename).subscribe(
//     (res) => {
//       this.file = res;
//     }
//   );
// }
