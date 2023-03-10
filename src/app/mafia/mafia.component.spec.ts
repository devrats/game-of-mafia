import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MafiaComponent } from './mafia.component';

describe('MafiaComponent', () => {
  let component: MafiaComponent;
  let fixture: ComponentFixture<MafiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MafiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MafiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
