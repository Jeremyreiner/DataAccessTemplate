import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ApiService, DialogService, StorageService, ToastService} from '../../services';
import {Accolade, UniversityModel, UserModel} from '../../models';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-affiliation-dialog',
  templateUrl: './affiliation-dialog.component.html',
  styleUrls: ['./affiliation-dialog.component.scss'],
})
export class AffiliationDialogComponent implements OnInit {

  search = '';
  searchOptions: UniversityModel[] = [];
  affiliatedUniversities: UniversityModel[] = [];
  selectedUniversity: UniversityModel;
  isLoading: boolean;
  user: UserModel;

  constructor(
    public dialogRef: MatDialogRef<AffiliationDialogComponent>,
    private sheetRef: MatBottomSheetRef<AffiliationDialogComponent>,
    private storage: StorageService,
    private api: ApiService,
    private toastService: ToastService,
    private dialogService: DialogService,
    ) {
  }

  async ngOnInit() {
    this.isLoading = false;
    this.user = await this.storage.getUser();
  }

  async searchUniversities() {
    if (this.search?.length > 2) {
      this.searchOptions = await this.api.searchUniversities(this.search);
    }
  }

  async close(updated: boolean = false) {
    await this.dialogService.close(this.dialogRef, this.sheetRef, updated, 'updated');
  }

  async selectUniversity(university: UniversityModel) {
    this.search = university.name;
    this.selectedUniversity = university;
    this.affiliatedUniversities.push(university);
  }

  async submit() {
    this.isLoading = true;
    const accolade = new Accolade(this.selectedUniversity);
    accolade.id = 'NO ID';
    accolade.degree = 'NO DEGREE';
    accolade.graduationYear = '2018';
    accolade.currentlyAttending = true;
    await this.api.updateAccolades(accolade)
      .then(universitiesUpdated => {
        console.log(universitiesUpdated);
        this.toastService.openToast(`"Universities updated`, true);
      })
      .catch(error => {
        console.log(error, 'something went wrong...');
        this.toastService.openToast(`Whoops, something went wrong...`, false, 3600 * 10);
      });
    await this.close(true);
    this.isLoading = false;
  }
}
