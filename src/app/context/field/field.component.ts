import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit} from '@angular/core';

@Component({
  selector: 'field',
  template: `
    <field2></field2>XX{{renderedTimes}}XXX
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements OnInit, DoCheck {
  renderedTimes = 1;
  constructor(protected cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    console.log('!!!FieldComponent')
    this.renderedTimes++;
    // this.cd.detectChanges();

  }


}
