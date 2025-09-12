import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../../model/review';
import { addReview, deleteReview, updateReview } from './states/review.actions';
import { selectReviews } from './states/review.selector';
import { ReviewState } from './states/review.state';

@Component({
  selector: 'app-reviews',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  @Input({ required: true }) showId!: string;

  rating = signal<number | null>(null);
  comment = signal<string>('');
  editingId = signal<string | null>(null);

  reviews = signal<Review[]>([]);

  //reviews$ : Observable<Review[]> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<ReviewState>,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.showId = id;
    } else {
      throw new Error('showId is required');
    }
    this.store.select(selectReviews).subscribe((reviews) => {
      this.reviews.set(reviews.filter((r) => r.showId === this.showId));
    });
  }

  ngOnInit() {
    this.store.select(selectReviews).subscribe((reviews) => {
      this.reviews.set(reviews.filter((r) => r.showId === this.showId));
    });
  }
  submitReview(event: Event) {
    event.preventDefault();
    if (!this.rating() || !this.comment()) return;

    if (this.editingId()) {
      this.store.dispatch(
        updateReview({
          review: {
            id: this.editingId()!,
            showId: this.showId,
            rating: this.rating()!,
            comment: this.comment(),
          },
        }),
      );
      this.editingId.set(null);
    } else {
      this.store.dispatch(
        addReview({
          review: {
            id: uuidv4(),
            showId: this.showId,
            rating: this.rating()!,
            comment: this.comment(),
          },
        }),
      );
    }
    this.rating.set(null);
    this.comment.set('');
  }

  editReview(review: Review) {
    this.editingId.set(review.id);
    this.rating.set(review.rating);
    this.comment.set(review.comment);
  }

  deleteReview(id: string) {
    this.store.dispatch(deleteReview({ id }));
    if (this.editingId() === id) {
      this.editingId.set(null);
      this.rating.set(null);
      this.comment.set('');
    }
  }

  cancelEdit() {
    this.editingId.set(null);
    this.rating.set(null);
    this.comment.set('');
  }

  goShowDetails() {
    if (this.showId) {
      this.router.navigate(['/show', this.showId]);
    }
  }
}
