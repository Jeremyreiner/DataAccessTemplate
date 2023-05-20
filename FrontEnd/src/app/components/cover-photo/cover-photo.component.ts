import {Component, Input, OnInit} from '@angular/core';
import {Constants} from '../../constants';
import {DialogConfig, UserModel} from '../../models';
import {DialogService, StorageService} from '../../services';
import {MatDialog} from '@angular/material/dialog';
import {CoverDialogComponent} from '../../dialogs';

@Component({
  selector: 'app-cover-photo',
  templateUrl: './cover-photo.component.html',
  styleUrls: ['./cover-photo.component.scss'],
})
export class CoverPhotoComponent implements OnInit {

  @Input() user: UserModel;
  @Input() guid: string;

  imagePath: string;
  imageLoaded: boolean;
  color: string;

  isImage = true;

  constructor(
    private storage: StorageService,
    private dialogService: DialogService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.imageLoaded = false;
    this.imagePath = '';
    if (this.guid) {
      if (Constants.guidNotEmpty(this.guid)) {
        this.imagePath = Constants.cloudinaryUrl + this.guid + '.jpeg';
      }
      this.imageLoaded = true;
      return;
    }
      this.storage.getUserObservable().subscribe(
        (user) => {
          if (Constants.guidNotEmpty(user.coverPicture)) {
            this.imagePath = Constants.cloudinaryUrl + user.coverPicture + '.jpeg';
          } else {
              this.isImage = false;
              this.color = Constants.parseMetaData(user.metaData)?.coverColor;
            }
        }
      );
    console.log(' end init color', this.color);
    console.log(this.storage.getUser());
    this.imageLoaded = true;
  }

  openCoverDialog() {
    const dialog = new DialogConfig(CoverDialogComponent);
    const ref = this.dialogService.openDialog(dialog);
    ref.componentInstance.colorSelected?.subscribe(async (imageModel) => {
      if (imageModel.color) {
        this.isImage = false;
        this.color = imageModel.color;
      }
      if (imageModel.guid) {
        this.ngOnInit();
        this.isImage = true;
      }
    });
  }
}
