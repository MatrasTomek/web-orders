import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isSpinnerVisible } from './store/selectors/spinner.selector';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'web-order';
	showSpinner$: Observable<boolean>;

	constructor(
		public auth: AuthService,
		private store: Store,
		private router: Router,
	) {
		this.showSpinner$ = this.store.select(isSpinnerVisible);
	}

	isDocsRoute(): boolean {
		return this.router.url.startsWith('/docs');
	}
}
