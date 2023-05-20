import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-increase-box',
  templateUrl: './increase-box.component.html',
  styleUrls: ['./increase-box.component.scss'],
})
export class IncreaseBoxComponent implements OnInit {

  _type: string;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() data: number[] = [];

  @Input() set type(type: string) {
    this._type = type;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor() { }

  ngOnInit() {}

}
