import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShoppingCartComponent } from './manage-shopping-cart.component';

describe('ManageShoppingCartComponent', () => {
  let component: ManageShoppingCartComponent;
  let fixture: ComponentFixture<ManageShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageShoppingCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
