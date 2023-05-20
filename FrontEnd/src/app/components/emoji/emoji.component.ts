import {Component, Input, OnInit} from '@angular/core';
import Emoji from './emoji-index';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.scss'],
})
export class EmojiComponent implements OnInit {
  _emoji: string;

  constructor() {}

  // @Input() set emoji(emoji: string) {
  //  // this._emoji = Emoji[emoji.toLowerCase()];
  // }

  @Input() set emoji(emoji: string) {
    this._emoji = emoji;
  }

  ngOnInit() {
    if(!this._emoji){
      this._emoji = Emoji.default;
    }
  }

}
