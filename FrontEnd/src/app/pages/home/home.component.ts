import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services';
import {UserModel} from '../../models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  user: UserModel;
  isTeacher = false;

  constructor(
    private storage: StorageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.storage.getUser();
    this.isTeacher = this.user.isTeacher;
  }

}
