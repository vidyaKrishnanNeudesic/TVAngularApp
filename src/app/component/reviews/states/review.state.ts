import { Review } from '../../../model/review';

export interface ReviewState {
  reviews: Review[];
}

export const initialState: ReviewState = {
  reviews: [],
};
