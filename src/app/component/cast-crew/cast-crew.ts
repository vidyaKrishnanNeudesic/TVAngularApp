import { Component, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { TvShowService } from '../../service/TvShowService';

@Component({
  selector: 'app-cast-crew',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cast-crew.html',
  styleUrl: './cast-crew.scss',
})
export class CastCrew {
  cast = signal<any[]>([]);
  showName = signal<string>('');
  private id: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tvShowService: TvShowService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    effect(() => {
      if (this.id) {
        this.tvShowService.getShowCasts(this.id).subscribe((data) => {
          this.cast.set(data);
        });
        this.tvShowService.getShowDetails(this.id).subscribe((data) => {
          if (data) {
            this.showName.set(data.name);
          }
        });
      }
    });
  }

  goShowDetails() {
    if (this.id) {
      this.router.navigate(['/show', this.id]);
    }
  }
}
