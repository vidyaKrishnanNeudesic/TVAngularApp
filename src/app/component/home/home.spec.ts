import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { TvShowService } from '../../service/TvShowService';
import { of } from 'rxjs';

describe('Home', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let tvShowServiceSpy: jasmine.SpyObj<TvShowService>;

  beforeEach(() => {
    tvShowServiceSpy = jasmine.createSpyObj('TvShowService', ['searchShows']);

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: TvShowService, useValue: tvShowServiceSpy }],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchText from localStorage and call onSearch in effect', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue('Breaking Bad');
    spyOn(component, 'onSearch');

    component.searchText.set('');
    fixture.detectChanges();

    expect(window.localStorage.getItem).toHaveBeenCalledWith('searchText');
    expect(component.searchText()).toBe('Breaking Bad');
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('should not call onSearch if localStorage is empty or searchText is not empty', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    spyOn(component, 'onSearch');

    component.searchText.set('Some Text');
    fixture.detectChanges();

    expect(component.onSearch).not.toHaveBeenCalled();
  });

  it('should perform search and update signals correctly', () => {
    const mockResult = [{ name: 'Mock Show' }];
    tvShowServiceSpy.searchShows.and.returnValue(of(mockResult));

    component.searchText.set('Friends');
    spyOn(window.localStorage, 'setItem');

    component.onSearch();

    expect(tvShowServiceSpy.searchShows).toHaveBeenCalledWith('Friends');
    expect(component.searching()).toBeFalse();
    expect(component.searchResult()).toEqual(mockResult);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('searchText', 'Friends');
  });

  it('should not perform search if searchText is empty', () => {
    component.searchText.set('');
    component.onSearch();

    expect(tvShowServiceSpy.searchShows).not.toHaveBeenCalled();
  }); 
});

