import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        if (error.status === 0) {
          this.snackBar.open('Network error: Unable to reach the server.', 'Close', {
            duration: 4000,
          });
        } else if (error.status === 404) {
          console.log('In 404 error from interceptor');
        } else if (error.status === 401) {
          this.snackBar.open('Unauthorised to access the resource', 'Close', {
            duration: 4000,
          });
        } else if (error.status === 403) {
          this.snackBar.open('Not allowed to access the resource', 'Close', {
            duration: 4000,
          });
        }

        return throwError(() => error);
      })
    );
  }
}

