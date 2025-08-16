import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrder } from './new-order';

describe('NewOrder', () => {
  let component: NewOrder;
  let fixture: ComponentFixture<NewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
