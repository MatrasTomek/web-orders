import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderModalComponent } from '../show-order-modal.component';

describe('ShowOrderModalComponent', () => {
  let component: ShowOrderModalComponent;
  let fixture: ComponentFixture<ShowOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
