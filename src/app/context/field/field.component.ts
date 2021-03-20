import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'field',
  template: `
   <field2></field2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
