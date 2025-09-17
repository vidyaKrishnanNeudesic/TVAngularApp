// global-interceptor.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalInterceptor } from './global-interceptor-interceptor';

describe('GlobalInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MatSnackBar, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GlobalInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  function simulateError(status: number) {
    httpClient.get('/test').subscribe({
      next: () => fail('Should have failed with an error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(status);
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush('Error', { status, statusText: 'Error' });
  }
 
  it('should handle status 0 (network error)', (done) => {
    httpClient.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(0);
        expect(snackBarSpy.open).toHaveBeenCalledWith(
          'Network error: Unable to reach the server.',
          'Close',
          { duration: 4000 }
        );
        done();
      },
    });

    const req = httpMock.expectOne('/test');
    req.error(new ProgressEvent('error'), {
      status: 0,
      statusText: 'Unknown Error',
    });
  });

  it('should log message for 404 error', () => {
    spyOn(console, 'log');
    simulateError(404);
    expect(console.log).toHaveBeenCalledWith('In 404 error from interceptor');
  });

  it('should show snackbar for 401 error', () => {
    simulateError(401);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Unauthorised to access the resource',
      'Close',
      { duration: 4000 }
    );
  });

  it('should show snackbar for 403 error', () => {
    simulateError(403);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Not allowed to access the resource',
      'Close',
      { duration: 4000 }
    );
  });
});

