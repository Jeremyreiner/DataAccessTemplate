const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter dialog component name (example: ExampleComponentDialog): ', (componentName) => {
  const kebabName = componentName.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();

  const dir = `./src/app/dialogs/${kebabName}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  const tsFileName = `${dir}/${kebabName}.component.ts`;
  const tsFileContent =
`import { Component } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatDialogRef} from '@angular/material/dialog';
import {DialogService} from '../../services';

@Component({
  selector: '${kebabName}',
  templateUrl: './${kebabName}.component.html'
})

export class ${componentName}Component {

  constructor(
    public dialogRef: MatDialogRef<${componentName}Component>,
    public sheetRef: MatBottomSheetRef<${componentName}Component>,
    public dialogService: DialogService,
  ){}

  async close() {
    await this.dialogService.close(this.dialogRef, this.sheetRef, '', '');
  }
}`;

  fs.writeFileSync(tsFileName, tsFileContent);
  console.log(`${componentName} component created successfully!`);

  const htmlFileName = `${dir}/${kebabName}.component.html`;
  const htmlFileContent =
`<div class="relative">
  <header class="mb-4">
    <app-close-dialog-button (click)="close()" class="absolute top-0 right-0"></app-close-dialog-button>
    <h2 class="type-primary font-bold text-xl">${componentName}</h2>
    <p class="type-secondary text-sm">Subheader for dialog</p>
  </header>
<!-- content goes here -->
</div>`;

  fs.writeFileSync(htmlFileName, htmlFileContent);
  console.log(`${componentName} dialog HTML file created successfully!`);

  rl.close();
});

// Enter dialog name LikeThisWithCapitalLettersDialog
