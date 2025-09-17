import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CastCrew } from './cast-crew';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';
import { of } from 'rxjs';

describe('CastCrew', () => {
  let component: CastCrew;
  let fixture: ComponentFixture<CastCrew>;
  let routerSpy: jasmine.SpyObj<Router>;
  let tvShowServiceSpy: jasmine.SpyObj<TvShowService>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    tvShowServiceSpy = jasmine.createSpyObj('TvShowService', ['getShowCasts', 'getShowDetails']);
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123',
          has: (key: string) => key === 'id',
          getAll: (key: string) => [],
          keys: ['id']
        }
      }
    };

    tvShowServiceSpy.getShowCasts.and.returnValue(of([{ person: { name: 'Actor 1' } }]));
    tvShowServiceSpy.getShowDetails.and.returnValue(of({ name: 'Test Show' }));

    await TestBed.configureTestingModule({
      imports: [CastCrew],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TvShowService, useValue: tvShowServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CastCrew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(CastCrew);
  });

 it('should initialize id from route', () => {
    expect((component as any).id).toBe('123');
  });

  it('should fetch cast and set cast signal', () => {
    expect(tvShowServiceSpy.getShowCasts).toHaveBeenCalledWith('123');
    expect(component.cast()).toEqual([{ person: { name: 'Actor 1' } }]);
  });

  it('should fetch show details and set showName signal', () => {
    expect(tvShowServiceSpy.getShowDetails).toHaveBeenCalledWith('123');
    expect(component.showName()).toBe('Test Show');
  });

  it('should navigate to show details when goShowDetails is called and id exists', () => {
    component.goShowDetails();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '123']);
  });

  it('should not throw if id is null in goShowDetails', () => {
    (component as any).id = null;
    expect(() => component.goShowDetails()).not.toThrow();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/show', null]);
  });

  it('should handle empty cast and showName if service returns empty', () => {
    tvShowServiceSpy.getShowCasts.and.returnValue(of([]));
    tvShowServiceSpy.getShowDetails.and.returnValue(of(null));
    // Re-run effect by creating a new component
    fixture = TestBed.createComponent(CastCrew);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.cast()).toEqual([]);
    expect(component.showName()).toBe('');
  });

});
