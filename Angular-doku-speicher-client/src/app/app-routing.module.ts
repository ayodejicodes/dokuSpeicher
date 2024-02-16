import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const authModule = () => import('./auth/auth.module').then((m) => m.AuthModule);
const dashboard = () =>
  import('./dashboard/dashboard.module').then((m) => m.DashboardModule);

const routes: Routes = [
  // { path: '', loadChildren: authModule },
  { path: '', loadChildren: dashboard },
  { path: 'dashboard', loadChildren: dashboard },
  { path: 'auth', loadChildren: authModule },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
