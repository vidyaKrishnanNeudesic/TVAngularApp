import { createReducer, on } from '@ngrx/store';
import { addReview, deleteReview, updateReview } from './review.actions';
import { Review } from '../../../model/review';
import { initialState } from './review.state';

export const reviewReducer = createReducer(
  initialState,
  on(addReview, (state, { review }) => ({
    ...state,
    reviews: [...state.reviews, review],
  })),
  on(updateReview, (state, { review }) => ({
    ...state,
    reviews: [...state.reviews.filter((r) => r.id !== review.id), review],
  })),
  on(deleteReview, (state, { id }) => ({
    ...state,
    reviews: state.reviews.filter((r) => r.id !== id),
  })),
);
