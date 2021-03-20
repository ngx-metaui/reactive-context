import {ChangeDetectionStrategy, Component, DoCheck, OnInit} from '@angular/core';
import {MetaContextComponent} from '../meta-context/meta-context.component';

@Component({
  selector: 'render',
  template: `
    <div>
      <li>{{stackData | json}}</li>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RendererComponent implements OnInit, DoCheck {
  renderedTimes = 0;
  stackData = '';

  constructor(public mc: MetaContextComponent) {
  }

  ngOnInit(): void {
    this.mc.stack.forEach((item) => {
      this.stackData += `${item} `;
    });
    this.renderedTimes++;
  }

  ngDoCheck(): void {
    this.renderedTimes++;
  }
}
