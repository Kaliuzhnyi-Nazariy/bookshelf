import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDelModalComponent } from './del-modal.component';

describe('OpenDelModalComponent', () => {
  let component: OpenDelModalComponent;
  let fixture: ComponentFixture<OpenDelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenDelModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenDelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
