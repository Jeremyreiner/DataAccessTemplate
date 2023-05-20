import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardService as AuthGuard} from './services';
import {RouteNames} from './constants';
import * as pages from './pages';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: pages.HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.home,
    pathMatch: 'full',
    component: pages.HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.metrics,
    pathMatch: 'full',
    component: pages.MetricsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.settings,
    pathMatch: 'prefix',
    component: pages.SettingsProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.settingsProfile,
    pathMatch: 'full',
    component: pages.SettingsProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.settingsPayment,
    pathMatch: 'full',
    component: pages.SettingsPaymentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.settingsContact,
    pathMatch: 'full',
    component: pages.SettingsContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.settingsPrivacy,
    pathMatch: 'full',
    component: pages.SettingsPrivacyPolicyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.dashboard,
    pathMatch: 'full',
    component: pages.CoursesDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.coursesWithParam,
    pathMatch: 'full',
    component: pages.CoursesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.studentDashboard,
    pathMatch: 'full',
    component: pages.TeachersDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.teachersWithParam,
    pathMatch: 'full',
    component: pages.TeachersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: RouteNames.forgotPassword,
    pathMatch: 'full',
    component: pages.ForgotPasswordComponent,
  },
  {
    path: RouteNames.resetPassword,
    pathMatch: 'full',
    component: pages.ResetPasswordComponent,
  },
  {
    path: RouteNames.login,
    pathMatch: 'full',
    component: pages.LoginComponent,
  },
  {
    path: RouteNames.landing,
    pathMatch: 'full',
    component: pages.LandingComponent,
  },
  {
    path: RouteNames.register,
    pathMatch: 'full',
    component: pages.RegisterComponent,
  },
  {
    path: RouteNames.waitList,
    pathMatch: 'full',
    component: pages.JoinWaitlistComponent,
  },
  {
    path: RouteNames.eReader,
    pathMatch: 'full',
    component: pages.EReaderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: RouteNames.accountConnected,
    component: pages.AccountConnectedComponent,
  },
  {
    path: RouteNames.emailVerificationPending,
    component: pages.VerifyEmailComponent,
    pathMatch: 'full',
  },
  //!!!!! ANY ROUTE YOU PUT BELOW THIS ** WILL NOT WORK BECAUSE IT WILL ALWAYS MATCH THE ASTERISK FIRST !!!!!!!!
  {
    path: '**',
    redirectTo: RouteNames.pageNotFound
  },
  {
    path: RouteNames.pageNotFound,
    component: pages.PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

