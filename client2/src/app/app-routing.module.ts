import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/standers/products.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './guards/admin-guard.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
