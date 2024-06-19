import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomopaymentDialogComponent } from './momopayment-dialog.component';

describe('MomopaymentDialogComponent', () => {
  let component: MomopaymentDialogComponent;
  let fixture: ComponentFixture<MomopaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomopaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomopaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
