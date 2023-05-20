import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services';

@Component({
  selector: 'app-book-views',
  templateUrl: './book-views.component.html',
  styleUrls: ['./book-views.component.scss'],
})
export class BookViewsComponent implements OnInit {

  maxViews = 0;
  totalViews = 0;

  constructor(
    public api: ApiService,
  ) { }

  async ngOnInit() {
    this.maxViews = (Math.max(...this.api.myBooks.map(book => book.views))) / 100;
    // divide by 100 to avoid multiple divisions in html
    this.totalViews = this.api.myBooks.reduce((acc, book) => acc + book.views, 0);
  }

  totalViewsText(): string {
    if (this.totalViews === 0) {
      return 'No views yet 😐';
    }
    if (this.totalViews === 1) {
      return '1 view 😊';
    }
    if (this.totalViews < 500) {
      return `${this.totalViews} Total views 😎`;
    }
    if (this.totalViews < 2000) {
      return `${this.totalViews.toLocaleString('en-us')} Total views 😍`;
    }
    if (this.totalViews < 10_000) {
      return `${this.totalViews.toLocaleString('en-us')} Total views 🤩`;
    }
    else {
      return `${this.totalViews.toLocaleString('en-us')} Total views 👑`;
    }
  }

}
