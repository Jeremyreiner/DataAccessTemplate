import {Component, Input, OnInit} from '@angular/core';
import {Book} from '../../models';

@Component({
  selector: 'app-book-carousel',
  templateUrl: './book-carousel.component.html',
  styleUrls: ['./book-carousel.component.scss'],
})
export class BookCarouselComponent implements OnInit {
  _title: string;
  _books: Book[] = [];
  _elementTag: string;

  constructor() {}

  @Input() set title(title: string) {
    this._title = title;
  }

  @Input() set elementTag(name: string){
    this._elementTag = name;
  }

  @Input() set books(books: Book[]) {
    // @ts-ignore
    this._books = books;
  }

  ngOnInit() {}

  carouselScroll(direction: string) {
    const windowSize = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const carousel = document.getElementById(this._elementTag);
    carousel.scrollBy(-windowSize * 2 / 3, 0);
  }
}
