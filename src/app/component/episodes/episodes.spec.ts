import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Episodes } from './episodes';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';
import { of } from 'rxjs';

describe('Episodes', () => {
  let component: Episodes;
  let fixture: ComponentFixture<Episodes>;
  let routerSpy: jasmine.SpyObj<Router>;
  let tvShowServiceSpy: jasmine.SpyObj<TvShowService>;
  let activatedRouteStub: any;

 beforeEach(async () => {
  routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  tvShowServiceSpy = jasmine.createSpyObj<any>('TvShowService', ['getShowEpisodes', 'getShowDetails']);
  activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: jasmine.createSpy('get').and.returnValue('456'),
        has: (key: string) => key === 'id',
        getAll: (key: string) => [],
        keys: ['id']
      }
    }
  };

  // Use the spy directly, not as any
  tvShowServiceSpy.getShowEpisodes.and.returnValue(of([
    { id: 1, name: 'Pilot', season: 1, number: 1 },
    { id: 2, name: 'Second', season: 1, number: 2 }
  ]));
  tvShowServiceSpy.getShowDetails.and.returnValue(of({ name: 'Show Name' }));

  await TestBed.configureTestingModule({
    imports: [Episodes],
    providers: [
      { provide: Router, useValue: routerSpy },
      { provide: TvShowService, useValue: tvShowServiceSpy },
      { provide: ActivatedRoute, useValue: activatedRouteStub }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(Episodes);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeInstanceOf(Episodes);
  });

  // it('should initialize id from route', () => {
  //   expect((component as any).id).toBe('456');
  // });

  it('should fetch episodes and set episodes signal', () => {
    expect(tvShowServiceSpy.getShowEpisodes).toHaveBeenCalledWith('456');
    expect(component.episodes()).toEqual([
      { id: 1, name: 'Pilot', season: 1, number: 1 },
      { id: 2, name: 'Second', season: 1, number: 2 }
    ]);
  });

  it('should fetch show details and set showName signal', () => {
    expect(tvShowServiceSpy.getShowDetails).toHaveBeenCalledWith('456');
    expect(component.showName()).toBe('Show Name');
  });

  it('should navigate to show details when goShowDetails is called and id exists', () => {
    component.goShowDetails();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/show', '456']);
  });

  it('should not throw if id is null in goShowDetails', () => {
    (component as any).id = null;
    expect(() => component.goShowDetails()).not.toThrow();
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['/show', null]);
  });

  it('should handle empty episodes and showName if service returns empty', () => {
    tvShowServiceSpy.getShowEpisodes.and.returnValue(of([]));
    tvShowServiceSpy.getShowDetails.and.returnValue(of(null));
    fixture = TestBed.createComponent(Episodes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.episodes()).toEqual([]);
    expect(component.showName()).toBe('');
  });

  // it('should not call services if id is null', () => {
  //   activatedRouteStub.snapshot.paramMap.get.and.returnValue(null);
  //   fixture = TestBed.createComponent(Episodes);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  //   expect(tvShowServiceSpy.getShowEpisodes).not.toHaveBeenCalledWith(null);
  //   expect(tvShowServiceSpy.getShowDetails).not.toHaveBeenCalledWith(null);
  // });

  it('should handle episode with missing fields gracefully', () => {
    tvShowServiceSpy.getShowEpisodes.and.returnValue(of([{ }]));
    fixture = TestBed.createComponent(Episodes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.episodes().length).toBe(1);
  });

  it('should handle show details with missing name gracefully', () => {
    tvShowServiceSpy.getShowDetails.and.returnValue(of({}));
    fixture = TestBed.createComponent(Episodes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.showName()).toBe('');
  });
});
