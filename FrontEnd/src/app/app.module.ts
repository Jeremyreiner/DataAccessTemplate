import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import * as pages from './pages';
import * as components from './components';
import * as dialogs from './dialogs';
import * as services from './services';

import { AppComponent } from './app.component';
import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { JwtModule } from '@auth0/angular-jwt';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgxStripeModule } from 'ngx-stripe';
import { MatChipsModule } from '@angular/material/chips';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatSnackBar} from '@angular/material/snack-bar';

export const getToken = () => localStorage.getItem(services.StorageService.tokenKey);

@NgModule({
  declarations: [
     ...Object.values(pages),
    ...Object.values(components),
    ...Object.values(dialogs),
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    NgxStripeModule.forRoot('pk_test_51LK7LZIovkDwUwKMum2KiwiC3vKWQBhTkJKF38IP1YDy2r0DEjGaYNmkKuEi1rgVFJxBGXBRUU1lKklpUjzpvQUc00PMDSgWKE'),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule,
    NgxSkeletonLoaderModule,
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatBottomSheetModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatProgressBarModule,
    NgChartsModule,
    MatTabsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    PdfJsViewerModule,
    NgxExtendedPdfViewerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    YouTubePlayerModule,
    MatChipsModule,
    CdkAccordionModule,
    MatRadioModule,
    NgApexchartsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: [],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    ...Object.values(services),
    NavParams,
    MatSidenav,
    Location,
    MatSnackBar,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
