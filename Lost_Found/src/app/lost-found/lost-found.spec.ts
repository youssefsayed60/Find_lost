import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostFound } from './lost-found';

describe('LostFound', () => {
  let component: LostFound;
  let fixture: ComponentFixture<LostFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LostFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
