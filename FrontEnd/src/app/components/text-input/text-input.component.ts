import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})

export class TextInputComponent implements OnInit {
  @Input() inputId = '';
  @Input() label = '';
  @Input() maxlength = null;
  @Input() value: string;
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Input() type: string;

  @Input() inputModel: any;
  @Output() inputModelChange = new EventEmitter<any>();

  onInput(value: string) {
    this.value = value;
    this.inputModelChange.emit(value);
  }

  isFocused = false;
  inputValue: '';

  constructor() { }

  ngOnInit() {}
}

