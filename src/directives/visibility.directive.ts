import {
  Directive, Output, EventEmitter, ElementRef, HostBinding, NgZone, OnInit, OnDestroy
} from '@angular/core';

/**
 * Visibility Observer Directive
 *
 * Usage:
 *
 * 		<div
 * 			visibility-observer
 * 			(visible)="onVisible($event)">
 * 		</div>
 *
 */
@Directive({ selector: '[visibility-observer]' })
export class VisibilityDirective implements OnInit, OnDestroy {

  @HostBinding('class.visible') 
  isVisible: boolean = false;

  @Output() visible: EventEmitter<any> = new EventEmitter();

  private timeout: any;

  constructor(private element: ElementRef, private zone: NgZone) { }

  ngOnInit() {
    this.runCheck();
  }

  ngOnDestroy() {
    clearTimeout(this.timeout);
  }

  onVisibilityChange() {
    // trigger zone recalc for columns
    this.zone.run(() => {
      this.isVisible = true;
      this.visible.emit(true);
    });
  }

  runCheck() {
    const check = () => {
      // https://davidwalsh.name/offsetheight-visibility
      const { offsetHeight, offsetWidth } = this.element.nativeElement;

      if (offsetHeight && offsetWidth) {
        clearTimeout(this.timeout);
        this.onVisibilityChange();
      } else {
        clearTimeout(this.timeout);
        this.zone.runOutsideAngular(() => {
          this.timeout = setTimeout(() => check(), 50);
        });
      }
    };

    setTimeout(() => check());
  }

}
