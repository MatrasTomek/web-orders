import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectSpinnerState = createFeatureSelector<boolean>('spinner');

export const isSpinnerVisible = createSelector(selectSpinnerState, (state: boolean) => state);
