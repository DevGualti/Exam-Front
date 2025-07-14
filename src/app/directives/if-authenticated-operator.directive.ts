import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appIfAuthenticatedOperator]'
})
export class IfAuthenticatedOperatorDirective {
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
        
        if (this.authSrv.isLoggedIn()) {
            this.authSrv.currentUser$.subscribe(user => {
                if (user?.isOperator) {
                    if (!this.isVisible) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                    this.isVisible = true;
                    }
                }
                else {
                        this.viewContainer.clear();
                        this.isVisible = false;
                }
            });
        } 
        else {
            this.viewContainer.clear();
            this.isVisible = false;
        }
    }
}
