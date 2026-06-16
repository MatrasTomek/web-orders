import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { isSpinnerVisible } from './store/selectors/spinner.selector';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'web-order';
	showSpinner$: Observable<boolean>;
	isDocsRoute$: Observable<boolean>;

	constructor(
		public auth: AuthService,
		private store: Store,
		private router: Router,
	) {
		this.showSpinner$ = this.store.select(isSpinnerVisible);
		this.isDocsRoute$ = this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map(() => this.router.url.startsWith('/docs')),
			startWith(this.router.url.startsWith('/docs')),
		);
	}
}
