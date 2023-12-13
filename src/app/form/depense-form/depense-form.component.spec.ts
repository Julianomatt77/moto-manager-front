import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepenseFormComponent } from './depense-form.component';

describe('DepenseFormComponent', () => {
  let component: DepenseFormComponent;
  let fixture: ComponentFixture<DepenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepenseFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
