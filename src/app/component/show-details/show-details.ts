import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';
import { Reviews } from '../reviews/reviews';

@Component({
  selector: 'app-show-details',
  standalone: true,
  imports: [ MatButtonModule, Reviews],
  templateUrl: './show-details.html',
  styleUrl: './show-details.scss',
})
export class ShowDetails {
  show = signal<any>(null);

  showReviews = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: TvShowService,
  ) {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.tvShowService.getShowDetails(id).subscribe((data) => {
          this.show.set(data);
        });
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  onCastCrewClick() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate(['/show', id, 'cast']);
    }
  }

  onEpisodesClick() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigate(['/show', id, 'episodes']);
    }
  }

  onReviewClick() {
    this.showReviews.set(true);
  }
}
