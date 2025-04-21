import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookUpdModalComponent } from './book-upd-modal.component';

describe('BookUpdModalComponent', () => {
  let component: BookUpdModalComponent;
  let fixture: ComponentFixture<BookUpdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookUpdModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookUpdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
