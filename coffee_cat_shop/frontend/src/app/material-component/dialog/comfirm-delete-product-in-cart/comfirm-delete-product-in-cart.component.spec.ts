import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmDeleteProductInCartComponent } from './comfirm-delete-product-in-cart.component';

describe('ComfirmDeleteProductInCartComponent', () => {
  let component: ComfirmDeleteProductInCartComponent;
  let fixture: ComponentFixture<ComfirmDeleteProductInCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComfirmDeleteProductInCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComfirmDeleteProductInCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
