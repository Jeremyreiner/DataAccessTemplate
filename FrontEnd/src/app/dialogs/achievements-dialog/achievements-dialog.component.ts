import { Component, OnInit } from '@angular/core';
import {ApiService, StorageService} from '../../services';
import {MatDialogRef} from '@angular/material/dialog';
import {Achievement} from '../../models';

@Component({
  selector: 'app-achievements-dialog',
  templateUrl: './achievements-dialog.component.html',
  styleUrls: ['./achievements-dialog.component.scss'],
})
export class AchievementsDialogComponent implements OnInit {
  achievement = new Achievement();
  isLoading: boolean;

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private dialogRef: MatDialogRef<AchievementsDialogComponent>
  ) {}

  ngOnInit() {
    this.isLoading = false;
  }

  async submit() {
    this.isLoading = true;
    const user = this.storage.getUser();
    const teacher = await this.api.getTeacher(user.email);
    teacher.degrees.push(this.achievement);
    this.closeDialog(true);
    this.isLoading = false;
  }

  closeDialog(updated: boolean = false) {
    this.dialogRef.close(updated);
  }

}
