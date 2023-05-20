import { Component, OnInit } from '@angular/core';
import {RouteNames} from '../../../constants';
import {Router} from '@angular/router';
import {ApiService} from '../../../services';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  name = '';
  email = '';
  subject = '';
  message = '';
  alert: string;
  routes = RouteNames;
  isLoading = false;

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {}

  async openRegistration() {
    await this.router.navigate([RouteNames.register]);
  }

  async openLogin() {
    await this.router.navigateByUrl(RouteNames.login);
  }

  async openWaitList() {
    await this.router.navigate([RouteNames.waitList]);
  }

  async submitContactForm() {
    this.isLoading = true;
    try {
      await this.api.contactUs({subject: this.name + " " + this.subject,message: this.message },this.email);
      this.name = '';
      this.email = '';
      this.subject = '';
      this.message = '';
    } catch (error) {
      this.isLoading = false;
      return;
    }
    this.isLoading = false;
  }
}
