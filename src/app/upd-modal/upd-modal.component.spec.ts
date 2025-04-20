import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdModalComponent } from './upd-modal.component';

describe('UpdModalComponent', () => {
  let component: UpdModalComponent;
  let fixture: ComponentFixture<UpdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
