import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf
} from '@angular/core';
import {Environment} from '../env.service';

export const ACTIVE_CNTX = 'CurrentMC';


@Component({
  selector: 'mc',
  template: `
    {{hasParent ? "WithParent" : "NoParent"}}
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetaContextComponent implements OnInit, AfterViewInit, AfterContentInit, AfterContentChecked,
  AfterViewChecked, AfterViewInit, OnChanges, DoCheck {
  @Input()
  module: string;

  @Input()
  layout: string;

  @Input()
  operation: string;

  @Input()
  class: string;

  @Input()
  object: any;

  @Input()
  field: string;


  hasParent = false;

  private _viewInitialized: boolean = false;
  private _contentInitialized: boolean = false;
  _bindingsMap: Map<string, any>;
  private inputs: { propName: string, templateName: string }[];
  private _contextCreated: boolean;


  get stack(): string[] {
    return this.env.peak(ACTIVE_CNTX);
  }


  constructor(private _cfr: ComponentFactoryResolver, private env: Environment,
              @Optional() @SkipSelf() private _parentMC?: MetaContextComponent) {
    this.inputs = this._cfr.resolveComponentFactory(MetaContextComponent).inputs;

  }

  ngOnInit(): void {
    this.hasParent = this._parentMC !== undefined && this._parentMC !== null;


    this.initBindings();
    this.pushPop(true);
    console.log('ngOnInit()', this.debugStrings());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes[name] && (changes[name].currentValue !== changes[name].previousValue)) {
      this.initBindings();

      console.log('ngOnChanges()', this.debugStrings());
    }
  }

  ngDoCheck(): void {
    if (this._viewInitialized) {
      // this.pushPop(true);
      console.log('DoCheck()', this.debugStrings());
    }

  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit()', this.debugStrings());
    if (!this._contentInitialized) {
      // this.pushPop(false);
      this._contentInitialized = true;
    }

  }


  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked()', this.debugStrings());
  }

  ngAfterViewChecked(): void {
    if (this._viewInitialized) {
      // this.pushPop(false);
    }
    console.log('ngAfterViewChecked()', this.debugStrings());
  }

  ngAfterViewInit(): void {
    if (!this._viewInitialized) {
      this.pushPop(false);
      console.log('ngAfterViewInit()', this.debugStrings());
      this._viewInitialized = true;
    }
  }

  private pushPop(isPush: boolean): void {
    let stack: string[] = this.stack;
    if (!stack) {
      stack = [];
      this._contextCreated = true;
      this.env.push(ACTIVE_CNTX, stack);
    }


    if (isPush) {
      let line = '(';
      this._bindingsMap.forEach((v, k) => line += `${k}=${v};`);
      line += ')';

      stack.push(line);
      if (!stack) {
        this.env.push(ACTIVE_CNTX, stack);
      }
    } else {
      stack.pop();
      if (this._contextCreated) {
        this.env.pop(ACTIVE_CNTX);
      }
    }
  }

  debugStrings(): string {
    let contexPath = '';
    const stack: string[] = this.env.peak(ACTIVE_CNTX);
    if (!stack) {
      return '';
    }
    stack.forEach((record) => {
      contexPath += `${record}; `;
    });

    let bindings = '[';
    this._bindingsMap.forEach((v, k) => bindings = `${k}:${v};`);
    bindings += ']';

    return `${bindings} | ${contexPath}`;
  }

  private initBindings(): void {
    this._bindingsMap = this._parentMC ? new Map<string, any>(this._parentMC._bindingsMap) : new Map<string, any>();

    this.inputs.forEach((input) => {
      if (this[input.propName]) {
        this._bindingsMap.set(input.propName, this[input.propName]);
      }
    });


  }


}
