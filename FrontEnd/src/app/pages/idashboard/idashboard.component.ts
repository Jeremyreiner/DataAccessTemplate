import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService, StorageService, ToastService} from '../../services';
import {Book, Course, UserModel} from '../../models';
import {ActivatedRoute, Router} from '@angular/router';
import {WelcomeDialogComponent} from '../../dialogs';
import {Constants, RouteNames} from '../../constants';
import { Location } from '@angular/common';
import {DialogService} from '../../services';



@Component({
  selector: 'app-idashboard',
  templateUrl: './idashboard.component.html',
  styleUrls: ['./idashboard.component.scss'],
})
export class IDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  continueReading?: Book[];
  user: UserModel;
  isLoading = true;
  courses: Course[] = [];
  routes = RouteNames;
  books: Book[] = [];
  colors = [];

  constructor(
    public dialog: MatDialog,
    public storage: StorageService,
    public api: ApiService,
    public location: Location,
    public router: Router,
    protected activatedRoute: ActivatedRoute,
    protected toastService: ToastService,
    protected dialogService: DialogService
  ) {
    this.user = new UserModel(this.storage.getUser());

  }

  /**
   * Implement ngOnInit in the child component and after all is loaded call super.ngOnInit()
   */
  ngOnInit() {
    if (!this.user.isVerified) {
      console.log('user is not verified');
      this.router.navigate([RouteNames.emailVerificationPending]);
      this.ngOnDestroy();
      return;
    }    // console.log('IDashboardComponent.ngOnInit()');
    this.isLoading = false;
  }
  /**
   * Opens the welcome dialog if it's the first time the user logs in
   */
  ngAfterViewInit() {
    if(StorageService.firstTimeLogin) {
      this.dialog.open(WelcomeDialogComponent); // todo dynamic student / teacher
      StorageService.firstTimeLogin = false;
    }
  }

  goBack() {
    this.location.back();
  }

  greeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }
    return 'Good Evening';
  }

  carouselScroll(direction: string, directive: string) {
    const windowSize = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const carousel = document.getElementById(directive);
    carousel.scrollBy(-windowSize * 2 / 3, 0);
  }

  /**
   * Repeats the colors in the array to the given number
   *
   * @param length
   */
  repeatColors(length: number): string[][] {
    const repeatedColorArrays: string[][] = new Array(length);
    const numColorArrays = Constants.colors.length;

    for (let i = 0; i < length; i++) {
      const colorArrayIdx = i % numColorArrays;
      repeatedColorArrays[i] = Constants.colors[colorArrayIdx];
    }
    return repeatedColorArrays;
  }

  async initLastReadBooks() {
    if(!this.user.isVerified) {return;}
    const lastReadBooks = this.storage.getLastRead();
    if (lastReadBooks.length) {
      this.continueReading = [];
      for (const book of lastReadBooks) {
        const _book = await this.api.getBookById(book.id);
        if (_book) {
          _book.page = book.pageNo;
          this.continueReading.push(_book);
        }
      }
    }
  }

  ngOnDestroy() {

  }
}
