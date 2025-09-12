import { createAction, props } from '@ngrx/store';
import { Review } from '../../../model/review';

export const addReview = createAction('[Review] Add', props<{ review: Review }>());
export const updateReview = createAction('[Review] Update', props<{ review: Review }>());
export const deleteReview = createAction('[Review] Delete', props<{ id: string }>());
export const loadReviews = createAction('[Review] Load');
