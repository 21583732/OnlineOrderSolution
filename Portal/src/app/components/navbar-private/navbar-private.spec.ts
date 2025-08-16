import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPrivate } from './navbar-private';

describe('NavbarPrivate', () => {
  let component: NavbarPrivate;
  let fixture: ComponentFixture<NavbarPrivate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarPrivate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPrivate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
