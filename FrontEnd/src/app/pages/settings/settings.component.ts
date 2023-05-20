import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  selectedPage = 'profile';
  options = [
    {
      name:'profile',
      icon: 'account_circle',
      id: 0
    },
    {
      name:'payments',
      icon: 'credit_card',
      id: 1
    },
    {
      name:'subscriptions',
      icon: 'bookmark_border',
      id: 2
    },
    {
      name:'privacy policy',
      icon: 'security',
      id: 3
    },
  ];

  constructor() { }

  @Input() set page(page: string) {
    if(page !== null) {
      if (page.length !== 0) {
        this.selectedPage = page;
      }
    }
  }

  ngOnInit() {}

  selectPage(option: string) {
    this.selectedPage = option;
  }
}
