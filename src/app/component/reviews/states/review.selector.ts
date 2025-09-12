import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewState } from './review.state';

// If your state is { reviews: Review[] }
export const selectReviewState = createFeatureSelector<ReviewState>('reviews');
export const selectReviews = createSelector(selectReviewState, (state) => state.reviews);
