import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {Book, UserModel} from './models';
import {RouteNames} from './constants';
import {ApiService, AuthService, LoginService, StorageService} from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('profilePic', {static: false}) profilePic: ElementRef;

  user: UserModel;
  books: Book[] = [];
  menu: string;
  url = '';
  isLoading = true;

  //TODO create metadata colum on user table to store random stuff, e.g last read books, last visited page, etc
  // it will be a json object, emoji preferenace and other bs

  constructor(
    private router: Router,
    private location: Location,
    public api: ApiService,
    private storage: StorageService,
    public authService: AuthService,
    private loginService: LoginService,
    public dialog: MatDialog,
    ) {
  //  this.disableLogsInProduction();
  }

  async ngOnInit() {
    let url = this.location.path();
    const authorised = await this.loginService.refreshToken();
    if (this.validateRoute(url)) {
      // console.log('ROUTE VALID');
      if (!authorised) {
        url = RouteNames.landing;
      } else {
        switch(url.substring(1)) {
          //1.  substring(1) just removes initial slash of url.
          //2. prevents students seeing teacher dashboard and vice versa
          // empty string redirects to dynamic route e.g. localhost:4400/ => /dashboard
          case RouteNames.dashboard:
          case RouteNames.studentDashboard:
          case '':
            url = RouteNames.dynamicRoute(this.storage.getUser().isTeacher);
            break;
          default:
            break;
        }
      }
    } else {
      url = RouteNames.pageNotFound;
      // console.log('ROUTE INVALID');
    }
    await this.router.navigate([url]);
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    window.addEventListener('beforeunload',  () => {
      // beforeunload is called on tab close, if user unchecks remember me then will log out
      if(!this.storage.rememberMe) {
        this.storage.logout();
      }
    });
  }

  validateRoute(url: string): boolean {
    // console.log('VALIDATING ROUTE');
    const routeNames = Object.values(RouteNames);
    for (const routeName of routeNames) {
      const regex = new RegExp(`^/?${routeName.replace(/:[^/]+/g, '[^/]+')}$`);
      if (regex.test(url)) {
        return true;
      }
    }
    return false;
  }

  disableLogsInProduction(): void {
      if (window) {
        window.console.log = () => {};
      }
  }
}
