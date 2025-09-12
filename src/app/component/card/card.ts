import { Component, Input, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-card',
  imports: [MatCardModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input({ required: true }) searchResult!: Signal<any[]>;
  @Input({ required: true }) searchText!: Signal<string>;

  constructor(private router: Router) {}

  goToDetails(showId: number) {
    this.router.navigate(['/show', showId]);
  }
}
