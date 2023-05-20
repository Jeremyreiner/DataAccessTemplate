import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Inject, InjectionToken} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, StorageService} from '../../services';

@Component({
  selector: 'app-subjects-dialog',
  templateUrl: './subjects-dialog.component.html',
  styleUrls: ['./subjects-dialog.component.scss'],
})
export class SubjectsDialogComponent implements OnInit{
  @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  subjectCtrl = new FormControl('');
  filteredSubjects: Observable<string[]>;
  subjects: string[] = [];
  isLoading: boolean;
  allSubjects: string[] = [];

  constructor(private storage: StorageService,
    private dialogRef: MatDialogRef<SubjectsDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data?: string,
  ) {
    this.filteredSubjects = this.subjectCtrl.valueChanges.pipe(
      startWith(null),
      map((subject: string | null) => (subject ? this._filter(subject) : this.allSubjects.slice())),
    );
  }

  async ngOnInit() {
    this.allSubjects = await this.api.getSubjects();
    this.isLoading = false;
    this.subjects = JSON.parse(this.data.toString());
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our subject
    if (value) {
      this.subjects.push(value);
    }
    // Clear the input value
    event.chipInput.clear();
    this.subjectCtrl.setValue(null);
  }

  remove(subject: string): void {
    const index = this.subjects.indexOf(subject);
    if (index >= 0) {
      this.subjects.splice(index, 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.subjects.push(event.option.viewValue);
    this.subjectInput.nativeElement.value = '';
    this.subjectCtrl.setValue(null);
  }

  async submit() {
    this.isLoading = true;
    const user = this.storage.getUser();
    const teacher = await this.api.getTeacher(user.email);
    // todo get the subjects dont need a second call here temp ;

    const updateSubjects = [];
    teacher.subjects.forEach(a => updateSubjects.push(a));
    this.subjects.forEach(a => updateSubjects.push(a));
    await this.api.updateTeacherSubjects(user.email, updateSubjects);
    this.closeDialog();
    this.isLoading = false;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSubjects.filter(subject => subject.toLowerCase().includes(filterValue));
  }
}
