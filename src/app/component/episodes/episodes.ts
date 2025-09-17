import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';

@Component({
  selector: 'app-episodes',
  imports: [CommonModule, MatExpansionModule, MatButtonModule],
  templateUrl: './episodes.html',
  styleUrl: './episodes.scss',
})
export class Episodes {
  episodes = signal<any[]>([]);
  groupedEpisodes = signal<{ [season: string]: any[] }>({});
  showName = signal<string>('');
  private showId: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: TvShowService,
  ) {
    this.showId = this.route.snapshot.paramMap.get('id');
    effect(() => {
      if (this.showId) {
        this.tvShowService.getShowEpisodes(this.showId).subscribe((data) => {
          this.episodes.set(data);
          // Group by season
          const grouped: { [season: string]: any[] } = {};
          data.forEach((ep) => {
            if (!grouped[ep.season]) grouped[ep.season] = [];
            grouped[ep.season].push(ep);
          });
          this.groupedEpisodes.set(grouped);
        });

        this.tvShowService.getShowDetails(this.showId).subscribe((data) => {
          if (data && data.name) {
    this.showName.set(data.name);
  } else {
    this.showName.set('');
  }
        });
      }
    });
  }

  watchTrailer(episode: any) {
    window.open(
      'https://www.youtube.com/results?search_query=' +
        encodeURIComponent(this.showName() + ' ' + episode.name + ' trailer'),
      '_blank',
    );
  }

  get groupedSeasons() {
    return Object.keys(this.groupedEpisodes());
  }

  goShowDetails() {
    if (this.showId) {
      this.router.navigate(['/show', this.showId]);
    }
  }
}
