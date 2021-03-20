import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MetaContextComponent} from './meta-context/meta-context.component';
import {RendererComponent} from './renderer/renderer.component';
import {FieldComponent} from './field/field.component';
import {Field2Component} from './field2/field2.component';


@NgModule({
  declarations: [MetaContextComponent, RendererComponent, FieldComponent, Field2Component],
  exports: [
    MetaContextComponent,
    RendererComponent,
    FieldComponent,
    Field2Component
  ],
  imports: [
    CommonModule
  ]
})
export class ContextModule {
}
