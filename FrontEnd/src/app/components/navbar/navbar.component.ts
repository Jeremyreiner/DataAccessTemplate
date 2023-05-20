import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Course, DialogConfig, Teacher} from '../../models';
import {RouteNames} from '../../constants';
import {ConfirmLogoutDialogComponent, CreateCourseDialogComponent, SearchDialogComponent} from '../../dialogs';
import {IDashboardComponent} from '../../pages';

class Button {
  route: string[];
  name: string;
  constructor(name: string, route: string[]) {
    this.name = name;
    this.route = route;
  }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})

export class NavbarComponent extends IDashboardComponent implements OnInit {
  @Output() closeDrawer = new EventEmitter<boolean>();

  @Input() courses: Course[];
  @Input() teachers: Teacher[];

  settingsButtons: Button[] = [];

  ngOnInit() {
    const buttons = [
      ['Profile', RouteNames.settingsProfile],
      ['Payment', RouteNames.settingsPayment],
      ['Contact us', RouteNames.settingsContact],
      ['Privacy Policy', RouteNames.settingsPrivacy],
    ];
    buttons.forEach(a => this.settingsButtons.push(new Button(a[0], [a[1]])));
    this.isLoading = false;
  }

  async update() {
    await this.api.updateUi();
  }

  async toProfile() {
    await this.router.navigate([RouteNames.settingsProfile]);
    this.emitCloseDrawer();
  }

  emitCloseDrawer() {
    this.closeDrawer.emit(true);
  }

  openCreateCourseDialog() {
    const dialog = new DialogConfig();
    dialog.component = CreateCourseDialogComponent;
    dialog.afterClosed = (result) => {

    };
    this.dialogService.openDialog(dialog);
  }

  openConfirmLogoutDialog() {
    this.dialogService.openDialog(new DialogConfig(ConfirmLogoutDialogComponent));
  }

  openSearchDialog() {
    this.dialogService.openDialog(new DialogConfig(SearchDialogComponent));
  }
}
