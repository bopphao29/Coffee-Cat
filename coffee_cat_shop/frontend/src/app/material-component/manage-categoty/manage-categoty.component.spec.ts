import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategotyComponent } from './manage-categoty.component';

describe('ManageCategotyComponent', () => {
  let component: ManageCategotyComponent;
  let fixture: ComponentFixture<ManageCategotyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCategotyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCategotyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
