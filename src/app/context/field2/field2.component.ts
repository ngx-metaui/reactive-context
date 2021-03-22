import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';

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

  constructor(protected cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    console.log('Field2Component do Check');
    this.renderedTimes++;
    this.cd.detectChanges();
  }


}
