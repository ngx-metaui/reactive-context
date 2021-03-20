import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';
import {MetaContextComponent} from '../meta-context/meta-context.component';

@Component({
  selector: 'render',
  template: `
    <div>
      => {{stackData | json}}  ({{renderedTimes}})
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RendererComponent implements OnInit, DoCheck {
  renderedTimes = 0;
  stackData = '';

  constructor(public mc: MetaContextComponent, private _cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.mc.contextChanged$.subscribe((stack) => {
      this._handleContextChanged(stack);

    });
    this.renderedTimes++;
  }

  ngDoCheck(): void {
    console.log('Render => ', this.mc.stack + ' -- ' + this.renderedTimes);
    this.renderedTimes++;
    this._cd.detectChanges();

  }


  private _handleContextChanged(stack: string[]): void {
    console.log('rendering: ', stack);
    this.stackData = '';
    this.mc.stack.forEach((item) => {
      this.stackData += `${item} `;
    });
  }
}
