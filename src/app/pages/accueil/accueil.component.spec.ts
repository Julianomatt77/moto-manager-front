import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilComponent } from './accueil.component';
import {RouterModule} from '@angular/router';

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilComponent, RouterModule.forRoot([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
