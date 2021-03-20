import {ChangeDetectionStrategy, Component, DoCheck, OnInit} from '@angular/core';

@Component({
  selector: 'field2',
  template: `
            <<<{{renderedTimes}}>>
    <mc field="birthdate-childView">
      <render></render>
    </mc>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Field2Component implements OnInit, DoCheck {

  renderedTimes = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    this.renderedTimes++;
  }


}
