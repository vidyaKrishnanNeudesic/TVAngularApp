import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TvShowService } from '../../service/TvShowService';
import { Card } from '../card/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    Card,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  searchText = signal('');
  searchResult = signal<any[]>([]);
  searching = signal<boolean>(false);

  constructor(
    private tvShowService: TvShowService,
  ) {
    effect(() => {
      console.log('This effect is been called.');
      if (
        typeof window !== 'undefined' &&
        window?.localStorage.getItem('searchText') &&
        this.searchText().length === 0
      ) {
        this.searchText.set(window.localStorage.getItem('searchText') || '');
        this.onSearch();
      }
    });
  }

  onSearch() {
    if (this.searchText()) {
      this.searching.set(true);
      this.tvShowService.searchShows(this.searchText()).subscribe((result) => {
        this.searching.set(false);
        this.searchResult.set(result);
        window.localStorage.setItem('searchText', this.searchText());
      });
    }
  }

  updateSearchText(text : string){
    console.log(text);
    this.searchText.set(text);
    window.localStorage.setItem('searchText', this.searchText());
  }
}
