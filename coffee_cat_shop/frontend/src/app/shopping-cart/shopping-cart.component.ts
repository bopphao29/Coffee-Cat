import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  constructor(
    private router: Router,
    private shoppingService: ShoppingCartService
  ) { }

  ngOnInit(): void {
    this.getCartByUser()
  }

  back(){
    this.router.navigate(['/'])
  }

  getCartByUser(){
    this.shoppingService.getCart().subscribe((data)=>{
      console.log(data)
    })
  }


}
