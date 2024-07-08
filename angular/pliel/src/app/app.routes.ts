import { Routes } from '@angular/router';
import { LoginComponent } from './components/sessions/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LoginCallbackComponent } from './components/sessions/login-callback/login-callback.component';
import { UnauthorizedComponent } from './shared/components/errors/unauthorized/unauthorized.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { BadRequestComponent } from './shared/components/errors/bad-request/bad-request.component';
import { ServerErrorComponent } from './shared/components/errors/server-error/server-error.component';
import { RegisterComponent } from './components/sessions/register/register.component';
import { ForgotPasswordComponent } from './components/sessions/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/sessions/reset-password/reset-password.component';
import { BookComponent } from './shared/components/book/book.component';
import { SubcategoryComponent } from './shared/components/subcategory/subcategory.component';
import { CategoriesComponent } from './shared/components/categories/categories.component';
import { ProfileComponent } from './components/sessions/profile/profile.component';
import { LoggedGuard } from './guards/logged.guard';
import { AdminManagementComponent } from './components/admin/admin-management/admin-management.component';
import { AdminGuard } from './guards/admin.guard';
import { BooksComponent } from './components/books/books.component';
import { ChartsComponent } from './components/admin/charts/charts.component';
import { RouteTitleResolver } from './services/route-title.resolver';

export const routes: Routes = [

  /*
   *************************************************************
   *                          DEFAULT                          *
   *************************************************************
  */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  /*
   **************************************************************
   *                          SESSIONS                          *
   **************************************************************
  */
  { path: 'login', component: LoginComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.LOGIN' } },
  { path: 'login-callback', component: LoginCallbackComponent },
  { path: 'register', component: RegisterComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.REGISTER' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.FORGOT_PASSWORD' } },
  { path: 'password-reset/:token', component: ResetPasswordComponent },
  { path: 'profile', component: ProfileComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.PROFILE' }, canActivate: [LoggedGuard]},

  /*
   **************************************************************
   *                            HOME                            *
   **************************************************************
  */
  { path: 'home', component: HomeComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.HOME' } },

  /*
   **************************************************************
   *                         ERROR PAGES                        *
   **************************************************************
   */
  {
    path: 'unauthorized', component: UnauthorizedComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.UNAUTHORIZED' }
  },
  {
    path: 'not-found', component: NotFoundComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.NOT_FOUND' }
  },
  {
    path: 'server-error', component: ServerErrorComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.SERVER_ERROR' }
  },
  {
    path: 'bad-request', component: BadRequestComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.BAD_REQUEST' }
  },
  {
    path: 'forbidden', component: UnauthorizedComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.FORBIDDEN' }
  },

  /*
   **************************************************************
   *                         MAIN PAGES                         *
   **************************************************************
  */
  { path: 'book/:id', component: BookComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.BOOK_DETAILS' } },
  { path: 'subcategory/:id', component: SubcategoryComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.SUBCATEGORY' } },
  { path: 'categories', component: CategoriesComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.CATEGORIES' } },
  { path: 'books', component: BooksComponent, resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.BOOKS' } },


  /*
   **************************************************************
   *                         ADMIN PAGES                         *
   **************************************************************
  */
   { path: 'admin-management', component: AdminManagementComponent, title: 'Administración', canActivate: [AdminGuard], resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.ADMIN_MANAGEMENT' } },
   { path: 'admin-dashboard', component: ChartsComponent, title: 'Dashboard', canActivate: [AdminGuard], resolve: { title: RouteTitleResolver }, data: { titleKey: 'ROUTES.ADMIN_DASHBOARD' } },


  /*
   ***************************************************************
   *  NOT FOUND (SE PONE AL FINAL PARA NO CHOCAR CON LAS OTRAS)  *
   ***************************************************************
  */
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }

];
