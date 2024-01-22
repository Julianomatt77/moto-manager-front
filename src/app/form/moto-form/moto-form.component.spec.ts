import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoFormComponent } from './moto-form.component';

describe('MotoFormComponent', () => {
  let component: MotoFormComponent;
  let fixture: ComponentFixture<MotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
