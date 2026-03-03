import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmdelete } from './confirmdelete';

describe('Confirmdelete', () => {
  let component: Confirmdelete;
  let fixture: ComponentFixture<Confirmdelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmdelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confirmdelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
