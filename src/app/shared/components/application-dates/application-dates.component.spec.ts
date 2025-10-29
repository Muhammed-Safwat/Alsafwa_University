import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDatesComponent } from './application-dates.component';

describe('ApplicationDatesComponent', () => {
  let component: ApplicationDatesComponent;
  let fixture: ComponentFixture<ApplicationDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
