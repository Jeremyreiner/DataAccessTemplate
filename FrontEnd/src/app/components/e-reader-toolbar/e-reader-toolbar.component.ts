import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../../services';
import {RouteNames} from '../../constants';

@Component({
  selector: 'app-e-reader-toolbar',
  templateUrl: './e-reader-toolbar.component.html',
  styleUrls: ['./e-reader-toolbar.component.scss'],
})
export class EReaderToolbarComponent {

  isActive = false;

  constructor(public router: Router, private storage: StorageService) {}

  async goBack() {
    const user = await this.storage.getUser();
    const route = user.isTeacher? RouteNames.course : RouteNames.dashboard;
    await this.router.navigate([route]);
  }
}
