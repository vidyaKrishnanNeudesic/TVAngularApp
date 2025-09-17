import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TvShowService {
  constructor(private http: HttpClient) {}

  getShowDetails(showId: string): Observable<any> {
  if (showId === null || showId === undefined) {
    return of(null);
  }
  return this.http.get<any>(`${environment.apiBaseUrl}/shows/${showId}`).pipe(
    catchError((error) => {
      console.error(`Error fetching show details for ID ${showId}:`, error);
      return of(null);
    }),
  );
}

  getShowEpisodes(showId: string): Observable<any[]> {
    if (showId === null || showId === undefined) {
    return of([]);
  }
    
    return this.http.get<any[]>(`${environment.apiBaseUrl}/shows/${showId}/episodes`).pipe(
      catchError((error) => {
        console.error(`Error fetching episodes for ID ${showId}:`, error);
        return of([]);
      }),
    );
  }

  searchShows(query: string): Observable<any[]> {
    if (query === null || query === undefined) {
    return of([]);
  }
    return this.http
      .get<any[]>(`${environment.apiBaseUrl}/search/shows?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError((error) => {
            console.error(`Error fetching shows`, error);
          return of([]);
        }),
      );
  }

  getShowCasts(showId: string): Observable<any[]> {
    if (showId === null || showId === undefined) {
    return of([]);
  }
    return this.http.get<any[]>(`${environment.apiBaseUrl}/shows/${showId}/cast`).pipe(
      catchError((error) => {
        console.error(`Error fetching casts of show for ID ${showId}:`, error);

        return of([]);
      }),
    );
  }
}
