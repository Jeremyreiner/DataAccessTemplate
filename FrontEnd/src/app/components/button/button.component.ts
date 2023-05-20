import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  @Input() public text: string;
  @Input() public isLoading: boolean;
  @Input() public icon: string;
  @Input() disabled: boolean;
  @Input() public iconReverse: boolean;
  @Input() public type?: string;
  @Output() onClick = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {

  }

  emitClick($event: MouseEvent) {
    this.onClick.emit(true);
  }
}
