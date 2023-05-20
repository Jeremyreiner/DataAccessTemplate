import {Component, OnDestroy, OnInit} from '@angular/core';
import {Teacher, UniversityModel, Achievement, Accolade, DialogConfig,} from '../../../models';
import {IDashboardComponent} from '../../idashboard';
import {ComponentType} from '@angular/cdk/overlay';
import {Constants} from '../../../constants';
import {
  BioDialogComponent,
  AffiliationDialogComponent,
  AchievementsDialogComponent,
  AddBioDialogComponent,
  UpdatePasswordDialogComponent
} from "../../../dialogs";

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent extends IDashboardComponent implements OnInit, OnDestroy {

  url = '';
  message = '';
  teacher?: Teacher;
  bio: string;
  accolades: Accolade[] = [];
  achievements: Achievement[] | string[] = [];
  isEditMode = false;
  bioDialog = BioDialogComponent;
  affiliationDialog = AffiliationDialogComponent;
  achievementsDialog = AchievementsDialogComponent;
  changePasswordDialog = UpdatePasswordDialogComponent;
  addBioDialog = AddBioDialogComponent;
  constants = Constants;

  async ngOnInit() {
    super.ngOnInit();
    if(!this.user.isVerified) {
      this.ngOnDestroy();
      return;
    }
    if (this.user.isTeacher) {
      await this.updateTeacher();
    }
    await this.getUniversities();
    this.isLoading = false;
  }

  async getUniversities() {
    this.accolades = await this.api.getAccolades(this.user.email, this.user.isTeacher);
  }

  async removeAccolade(accolade: Accolade) {
    const index = this.accolades.indexOf(accolade);
    this.accolades.splice(index, 1);
    await this.api.updateAccolades(accolade);
  }

  async updateTeacher() {
    this.teacher = await this.api.getTeacher(this.user.email);
    if (this.teacher) {
      this.bio = this.teacher.bio ? this.teacher.bio : null;
      this.achievements = this.teacher.degrees ? this.teacher.degrees : ['brag'];
    }
  }

  /**
   * Name is of type Component<unkonwn> so it is the name of the Dialog, they are listed above as variables
   *
   * @param component
   * @param props
   * @param getUniversities
   */
  openDialog(component: ComponentType<unknown>, {props = null, getUniversities = false} = {}) {
    const dialog = new DialogConfig(component, props);
    dialog.afterClosed = async (result) => {
      if (result) {
        await this.updateTeacher();
        if (getUniversities) {
          await this.getUniversities();
        }
      }
    }
    const ref = this.dialogService.openDialog(dialog);

    ref.componentInstance?.componentInstance?.colorSelected?.subscribe(async (color) => {
      if (color) {
        this.user = this.storage.getUser();
      }
    });
  }
}
