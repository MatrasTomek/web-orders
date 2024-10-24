import { createReducer, on } from '@ngrx/store';
import { showSpinner, hideSpinner } from '../actions/spinner.actions';

export const initialState = false;

export const spinnerReducer = createReducer(
	initialState,
	on(showSpinner, () => true),
	on(hideSpinner, () => false)
);
