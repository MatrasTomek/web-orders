import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCustomerModalComponent } from './get-customer-modal.component';

describe('GetCustomerModalComponent', () => {
  let component: GetCustomerModalComponent;
  let fixture: ComponentFixture<GetCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetCustomerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
