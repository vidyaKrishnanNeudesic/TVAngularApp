import { reviewReducer } from './review.reducer';
import { addReview, updateReview, deleteReview } from './review.actions';
import { initialState } from './review.state';
import { ReviewState } from './review.state';
import { Review } from '../../../model/review';

describe('Review Reducer', () => {
  const review1: Review = { id: "1", showId: '123',rating: 1, comment: 'Great product!' };
  const review2: Review = { id: '2', showId: '123',rating: 2,comment: 'Not bad.' };
  const updatedReview1: Review = { id: '1', showId: '123',rating: 1,comment: 'Excellent product!' };

  it('should add a review', () => {
    const action = addReview({ review: review1 });
    const state = reviewReducer(initialState, action);
    expect(state.reviews.length).toBe(1);
    expect(state.reviews[0]).toEqual(review1);
  });

  it('should update a review', () => {
    const preloadedState: ReviewState = {
      ...initialState,
      reviews: [review1, review2]
    };
    const action = updateReview({ review: updatedReview1 });
    const state = reviewReducer(preloadedState, action);
    expect(state.reviews.length).toBe(2);
    expect(state.reviews.find(r => r.id === '1')).toEqual(updatedReview1);
  });

  it('should delete a review', () => {
    const preloadedState: ReviewState = {
      ...initialState,
      reviews: [review1, review2]
    };
    const action = deleteReview({ id: '1' });
    const state = reviewReducer(preloadedState, action);
    expect(state.reviews.length).toBe(1);
    expect(state.reviews[0]).toEqual(review2);
  });
});