import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserModel} from '../../models';
import {Constants} from '../../constants';
import {ApiService, StorageService} from '../../services';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements OnInit {


  @Output() clicked = new EventEmitter<boolean>();
  @Input() editable = false;

  /**
   * The profile picture GUID only
   */
  @Input() guid: string;

  _user: UserModel;
  imagePath = '';
  isLoading = true;
  initials = false;

  constructor(private storageService: StorageService, public api: ApiService) {}

  /**
   *  Can be used instead of profilePicture GUID to provide whole user
   *  and enables back up display Initials if no profile picture is found
   */
  @Input() set user(user: UserModel) {
    if(user) {
      this._user = new UserModel(user);
    }
  };

  ngOnInit() {
    if(!this.guid && !this.user) {
      this.storageService.getUserObservable().subscribe(
        (user) => {
          this._user = user;
          if (Constants.guidNotEmpty(user.profilePicture)) {
            this.imagePath = Constants.cloudinaryUrl + user.profilePicture + '.jpeg';
            this.initials = false;
          }
        }
      );
    }
    this.imagePath = this.createImgPath();
    this.isLoading = false;
  }

  createImgPath() {
    const guid = this.guid? this.guid : this._user?.profilePicture;
    if (Constants.guidNotEmpty(guid)) {
      return Constants.cloudinaryUrl + guid + '.jpeg';
    }
    this.initials = true;
    // display user initials
  }

  emitClickEvent() {
    this.clicked.emit(true);
  }

  showDefImg($event: ErrorEvent) {
    this.imagePath = '';
  }

  async postProfilePicture(fileInputEvent: any) {
    const formData = new FormData();
    for (const item of fileInputEvent.target.files) {
      formData.append('file', new Blob([item]), 'profile.jpeg');
    }
    await this.api.postProfilePhoto(formData);
  }
}
