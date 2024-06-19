import { Injectable } from "@angular/core"

export interface Menu {
    state: string,
    name: string,
    icon: string,
    role:string
}

const MENUITEMS = [
    {
        state: 'dashboard',
        name: 'Thống kê',
        icon: 'dashboard',
        role: 'admin'
    },
    {
        state: 'category',
        name: 'Quản lý danh mục',
        icon: 'category',
        role: 'admin'
    },
    //  {
    //     state: 'promotion',
    //     name: 'Quản lý khuyến mãi',
    //     icon: 'view_quilt',
    //     role: 'admin'
    // },
    {
        state: 'product',
        name: 'Quản lý sản phẩm',
        icon: 'local_parking',
        role: 'admin'
    },
    // {
    //     state: 'order',
    //     name: 'Quản lý đặt hàng',
    //     icon: 'list_alt',
    //     role: 'admin'
    // },
    {
        state: 'user-view-product',
        name: 'Sản phẩm',
        icon: 'local_parking',
        role: 'user'
    },
     {
        state: 'manage-shopping-cart',
        name: 'Giỏ hàng',
        icon:'shopping_cart',
        role: 'user'
    },
    {
        state: 'order',
        name: 'Đơn hàng',
        icon:'description',
        role: ''
    },
    // {
    //     state: 'bill',
    //     name: 'Quản lý hóa đơn',
    //     icon:'description',
    //     role: 'admin'
    // },
    {
        state: 'user',
        name: 'Quản lý người dùng',
        icon: 'people',
        role: 'admin'
    },
    
]

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}