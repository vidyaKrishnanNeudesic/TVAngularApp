/*import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetails } from './show-details';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TvShowService } from '../../service/TvShowService';
import { MatButtonModule } from '@angular/material/button';
import { Reviews } from '../reviews/reviews';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

describe('ShowDetails', () => {
  let tvShowServiceSpy: jasmine.SpyObj<TvShowService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;
  let fixture;
  let component: ShowDetails;

  beforeEach(async () => {
    tvShowServiceSpy = jasmine.createSpyObj('TvShowService', ['getShowDetails']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((key: string) => key === 'id' ? '123' : null)
        }
      }
    };

    // This must be before component creation!
    tvShowServiceSpy.getShowDetails.and.returnValue(of({ id: '123', name: 'Test Show' }));

    await TestBed.configureTestingModule({
      imports: [ShowDetails, MatButtonModule, Reviews],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
        { provide: TvShowService, useValue: tvShowServiceSpy },
        { provide: Store, useValue: jasmine.createSpyObj('Store', ['select', 'dispatch']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getShowDetails with id from route and set show signal', () => {
    expect(activatedRouteStub.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(tvShowServiceSpy.getShowDetails).toHaveBeenCalledWith('123');
    expect(component.show()).toEqual({ id: '123', name: 'Test Show' });
  });

  it('should not call getShowDetails if id is missing', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    tvShowServiceSpy.getShowDetails.calls.reset();
    fixture = TestBed.createComponent(ShowDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(tvShowServiceSpy.getShowDetails).not.toHaveBeenCalled();
  });

  it('should navigate to home on goHome()', () => {
    component.goHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to cast page on onCastCrewClick() if id exists', () => {
    component.onCastCrewClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '123', 'cast']);
  });

  it('should not navigate to cast page if id is missing', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    routerSpy.navigate.calls.reset();
    component.onCastCrewClick();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/show', null, 'cast']);
  });

  it('should navigate to episodes page on onEpisodesClick() if id exists', () => {
    component.onEpisodesClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '123', 'episodes']);
  });

  it('should not navigate to episodes page if id is missing', () => {
    activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
    routerSpy.navigate.calls.reset();
    component.onEpisodesClick();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/show', null, 'episodes']);
  });

  it('should set showReviews to true on onReviewClick()', () => {
    expect(component.showReviews()).toBeFalse();
    component.onReviewClick();
    expect(component.showReviews()).toBeTrue();
  }); 
}); */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowDetails } from './show-details';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';


 
@Component({
  selector: 'app-reviews',
  standalone: true,
  template: ''
})
class MockReviews {
  @Input() showId: string= '';;
}


describe('ShowDetails', () => {
  let component: ShowDetails;
  let fixture: ComponentFixture<ShowDetails>;
  let routerSpy: jasmine.SpyObj<Router>;
  let tvShowServiceSpy: jasmine.SpyObj<TvShowService>;
  let storeSpy: jasmine.SpyObj<Store<any>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    tvShowServiceSpy = jasmine.createSpyObj('TvShowService', ['getShowDetails']);
    storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    // ✅ Mock return values for observables
    tvShowServiceSpy.getShowDetails.and.returnValue(of({ id: '123', name: 'Test Show' }));
    storeSpy.select.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ShowDetails, MatButtonModule, MockReviews],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null)
              }
            }
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: TvShowService, useValue: tvShowServiceSpy },
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should fetch show details on init via effect', () => {
    expect(component.show()).toEqual({ id: '123', name: 'Test Show' });
    expect(tvShowServiceSpy.getShowDetails).toHaveBeenCalledWith('123');
  });

  it('should navigate to home on goHome()', () => {
    component.goHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to cast on onCastCrewClick()', () => {
    component.onCastCrewClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '123', 'cast']);
  });

  it('should navigate to episodes on onEpisodesClick()', () => {
    component.onEpisodesClick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '123', 'episodes']);
  });

  it('should set showReviews to true on onReviewClick()', () => {
    component.onReviewClick();
    expect(component.showReviews()).toBeTrue();
  });
});
