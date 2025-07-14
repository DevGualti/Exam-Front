import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[appIfNotAuthenticated]'
})
export class IfNotAuthenticatedDirective {
    protected destroyed$ = new Subject<void>();
    protected isVisible = false;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        protected authSrv: AuthService
    ) { }

    ngOnInit() {
        this.authSrv.currentUser$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(_ => {
                this.updateView();
            });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    private updateView() {
        if (!this.authSrv.isLoggedIn()) {
            if (!this.isVisible) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.isVisible = true;
            }
        } else {
            this.viewContainer.clear();
            this.isVisible = false;
        }
    }
}
