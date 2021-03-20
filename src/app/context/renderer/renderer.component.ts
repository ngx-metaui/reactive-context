import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
export class RendererComponent implements OnInit {
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

  private _handleContextChanged(stack: string[]): void {
    console.log('rendering: ', stack);
    this.stackData = '';
    this.mc.stack.forEach((item) => {
      this.stackData += `${item} `;
    });

    this.renderedTimes++;
    this._cd.detectChanges();
  }
}
