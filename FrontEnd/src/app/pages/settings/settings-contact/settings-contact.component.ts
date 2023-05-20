import { Component, OnInit } from '@angular/core';
import {ApiService, StorageService} from '../../../services';
import {Router} from '@angular/router';
import {RouteNames} from '../../../constants';

@Component({
  selector: 'app-settings-contact',
  templateUrl: './settings-contact.component.html',
  styleUrls: ['./settings-contact.component.scss'],
})
export class SettingsContactComponent implements OnInit {

  email = '';
  subject = '';
  message = '';
  sent = false;
  isLoading = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
  ) { }

  ngOnInit() {}

  async submitContactForm() {
    this.isLoading = true;
    this.sent = await this.api.contactUs({subject: this.subject, message: this.message}, this.email);
    this.isLoading = false;
    this.subject = '';
    this.message = '';
  }

  async goBack() {
    await this.router.navigate([RouteNames.dynamicRoute(this.storage.getUser().isTeacher)]);
  }
}
