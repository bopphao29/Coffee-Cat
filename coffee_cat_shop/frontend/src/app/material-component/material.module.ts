import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ConfimationComponent } from './dialog/confimation/confimation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageCategotyComponent } from './manage-categoty/manage-categoty.component';
import { CategoryComponent } from './dialog/category/category.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ProductComponent } from './dialog/product/product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManagePromotionComponent } from './manage-promotion/manage-promotion.component';
import { ManageShoppingCartComponent } from './manage-shopping-cart/manage-shopping-cart.component';
import { UserViewProductComponent } from './user-view-product/user-view-product.component';
import { ComfirmDeleteProductInCartComponent } from './dialog/comfirm-delete-product-in-cart/comfirm-delete-product-in-cart.component';
import { PromotionComponent } from './dialog/promotion/promotion.component';
import { CheckoutComponent } from './dialog/checkout/checkout.component';
import { ConfirmOrderComponent } from './dialog/confirm-order/confirm-order.component';
import { MomopaymentDialogComponent } from './dialog/momopayment-dialog/momopayment-dialog.component';
import { ViewOrderDialogComponent } from './dialog/view-order-dialog/view-order-dialog.component';
import { DeleteProductComponent } from './dialog/delete-product/delete-product.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatFormFieldModule
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfimationComponent,
    ChangePasswordComponent,
    ManageCategotyComponent,
    CategoryComponent,
    ManageProductComponent,
    ProductComponent,
    ManageOrderComponent,
    ViewBillComponent,
    ManageUserComponent,
    ManagePromotionComponent,
    ManageShoppingCartComponent,
    UserViewProductComponent,
    ComfirmDeleteProductInCartComponent,
    PromotionComponent,
    CheckoutComponent,
    ConfirmOrderComponent,
    MomopaymentDialogComponent,
    ViewOrderDialogComponent,
    DeleteProductComponent    
  ]
})
export class MaterialComponentsModule {}
