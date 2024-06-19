import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategotyComponent } from './manage-categoty/manage-categoty.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { ManageShoppingCartComponent } from './manage-shopping-cart/manage-shopping-cart.component';
import { UserViewProductComponent } from './user-view-product/user-view-product.component';
import { ManagePromotionComponent } from './manage-promotion/manage-promotion.component';
import { CheckoutComponent } from './dialog/checkout/checkout.component';

export const MaterialRoutes: Routes = [
  {
    path: 'category',
    component: ManageCategotyComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
    {
    path: 'promotion',
    component: ManagePromotionComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'product',
    component: ManageProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'order',
    component: ManageOrderComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin', 'user']
    }
  },
  {
    path: 'bill',
    component: ViewBillComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'user',
    component: ManageUserComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['admin']
    }
  },
  {
    path: 'manage-shopping-cart',
    component: ManageShoppingCartComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['user']
    }
  },
  {
    path: 'user-view-product',
    component: UserViewProductComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['user']
    }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [RouteGuardService],
    data: {
      expectedRole: ['user']
    }
  }
];
