import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-privacy-policy',
  templateUrl: './settings-privacy-policy.component.html',
  styleUrls: ['./settings-privacy-policy.component.scss'],
})
export class SettingsPrivacyPolicyComponent implements OnInit {


  apiLoaded = false;

  playerConfig = {
    controls: 0,
    mute: 0,
    autoplay: 1
  };

  constructor() {
  }


  ngOnInit() {
    if (!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

  }
}
