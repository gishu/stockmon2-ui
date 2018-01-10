import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GainsListComponent } from './gains-list.component';

describe('GainsListComponent', () => {
  let component: GainsListComponent;
  let fixture: ComponentFixture<GainsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
