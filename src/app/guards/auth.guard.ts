import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private auth: AuthService,
		private router: Router,
	) {}

	canActivate() {
		return combineLatest([this.auth.isAuthenticated$, this.auth.docsMode$]).pipe(
			take(1),
			map(([isAuthenticated, docsMode]) => {
				if (!isAuthenticated) {
					this.router.navigateByUrl('/');
					return false;
				}
				if (docsMode) {
					this.router.navigateByUrl('/docs');
					return false;
				}
				return true;
			}),
		);
	}
}
