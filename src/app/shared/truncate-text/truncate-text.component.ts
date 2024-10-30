import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';

@Component({
	selector: 'app-truncate-text',
	templateUrl: './truncate-text.component.html',
	styleUrls: ['./truncate-text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TruncateTextComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>();

	@Input() textToTruncate: string = '';
	@Input() maxVisibleChars: number = 200;
	@Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';
	@Input() flexibleTruncate: boolean = false;
	@Input() maxRows?: number = 3;

	@Input() customResizeSubject?: Observable<any>;

	isTooltipHeightVisible = false;

	elementRef?: ElementRef;
	elementRefChanged$ = new BehaviorSubject<any>(null);
	@ViewChild('trimmedValueElement', { static: false }) set setElementRef(elementRef: ElementRef) {
		if (this.elementRef === elementRef) return;

		this.elementRef = elementRef;
		this.elementRefChanged$.next(null);
	}

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit() {
		if (this.customResizeSubject) {
			combineLatest([this.customResizeSubject.pipe(startWith({})), this.elementRefChanged$])
				.pipe(
					debounceTime(100),
					tap(() => this.onResize()),
					takeUntil(this.destroy$)
				)
				.subscribe();
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onResize() {
		this.isTooltipHeightVisible = this.elementRef?.nativeElement?.offsetHeight < this.elementRef?.nativeElement?.scrollHeight;
		if (this.customResizeSubject) this.cd.markForCheck();
	}
}
