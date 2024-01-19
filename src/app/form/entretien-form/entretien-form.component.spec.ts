import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienFormComponent } from './entretien-form.component';

describe('EntretienFormComponent', () => {
  let component: EntretienFormComponent;
  let fixture: ComponentFixture<EntretienFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntretienFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntretienFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
