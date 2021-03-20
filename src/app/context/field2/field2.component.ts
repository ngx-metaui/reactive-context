import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'field2',
  template: `
    <mc field="birthdate-childView">
      <render></render>
    </mc>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Field2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
