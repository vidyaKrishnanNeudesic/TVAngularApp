import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TvShowService } from './TvShowService';
import { environment } from '../../environments/environment';

describe('TvShowService', () => {
  let service: TvShowService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TvShowService],
    });
    service = TestBed.inject(TvShowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

    it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // getShowDetails
  it('should fetch show details', () => {
    const mockShow = { id: '1', name: 'Test Show' };
    service.getShowDetails('1').subscribe(data => {
      expect(data).toEqual(mockShow);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShow);
  });

  it('should handle error in getShowDetails', () => {
    service.getShowDetails('1').subscribe(data => {
      expect(data).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should return null and not make HTTP call if showId is null in getShowDetails', () => {
    service.getShowDetails(null as any).subscribe(data => {
      expect(data).toBeNull();
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/null`);
  });

  it('should return null and not make HTTP call if showId is undefined in getShowDetails', () => {
    service.getShowDetails(undefined as any).subscribe(data => {
      expect(data).toBeNull();
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/undefined`);
  });

  // getShowEpisodes
  it('should fetch show episodes', () => {
    const mockEpisodes = [{ id: 1, name: 'Ep1' }];
    service.getShowEpisodes('1').subscribe(data => {
      expect(data).toEqual(mockEpisodes);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1/episodes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisodes);
  });

  it('should handle error in getShowEpisodes', () => {
    service.getShowEpisodes('1').subscribe(data => {
      expect(data).toEqual([]);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1/episodes`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should return empty array and not make HTTP call if showId is null in getShowEpisodes', () => {
    service.getShowEpisodes(null as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/null/episodes`);
  });

  it('should return empty array and not make HTTP call if showId is undefined in getShowEpisodes', () => {
    service.getShowEpisodes(undefined as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/undefined/episodes`);
  });

  // getShowCasts
  it('should fetch show casts', () => {
    const mockCasts = [{ person: { id: 1, name: 'Actor' } }];
    service.getShowCasts('1').subscribe(data => {
      expect(data).toEqual(mockCasts);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1/cast`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCasts);
  });

  it('should handle error in getShowCasts', () => {
    service.getShowCasts('1').subscribe(data => {
      expect(data).toEqual([]);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/shows/1/cast`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should return empty array and not make HTTP call if showId is null in getShowCasts', () => {
    service.getShowCasts(null as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/null/cast`);
  });

  it('should return empty array and not make HTTP call if showId is undefined in getShowCasts', () => {
    service.getShowCasts(undefined as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/shows/undefined/cast`);
  });

  // searchShows
  it('should search shows', () => {
    const mockResults = [{ show: { id: 1, name: 'Test' } }];
    service.searchShows('Test').subscribe(data => {
      expect(data).toEqual(mockResults);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/search/shows?q=Test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
  });

  it('should handle error in searchShows', () => {
    service.searchShows('Test').subscribe(data => {
      expect(data).toEqual([]);
    });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/search/shows?q=Test`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should return empty array and not make HTTP call if query is null in searchShows', () => {
    service.searchShows(null as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/search/shows?q=null`);
  });

  it('should return empty array and not make HTTP call if query is undefined in searchShows', () => {
    service.searchShows(undefined as any).subscribe(data => {
      expect(data).toEqual([]);
    });
    httpMock.expectNone(`${environment.apiBaseUrl}/search/shows?q=undefined`);
  });

});
