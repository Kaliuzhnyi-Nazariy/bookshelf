import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavShelfComponent } from './fav-shelf.component';

describe('FavShelfComponent', () => {
  let component: FavShelfComponent;
  let fixture: ComponentFixture<FavShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavShelfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
