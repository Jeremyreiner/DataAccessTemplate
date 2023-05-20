import { Component, OnInit } from '@angular/core';
import {RouteNames} from '../../../constants';
import {Router} from '@angular/router';
import {ApiService} from '../../../services';

@Component({
  selector: 'app-join-waitlist',
  templateUrl: './join-waitlist.component.html',
  styleUrls: ['./join-waitlist.component.scss'],
})
export class JoinWaitlistComponent implements OnInit {
  isLoading = false;
  firstName = '';
  lastName = '';
  email = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {}

  async joinWaitList() {
    this.isLoading = true;
    await this.api.joinWaitList(this.email, this.firstName, this.lastName);
    this.isLoading = false;
  }

  async openLogin() {
    await this.router.navigateByUrl(RouteNames.login);
  }

  async openLanding() {
    await this.router.navigate([RouteNames.landing]);
  }
}
