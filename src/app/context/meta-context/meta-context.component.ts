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
    <b>{{ parentMC ? "WithParent" : "NoParent"}}</b> {{_parentBindings()}}
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetaContextComponent implements OnInit, AfterViewInit, AfterContentInit, AfterContentChecked,
  AfterViewChecked, AfterViewInit, OnChanges, DoCheck {
  @Input()
  module: string;

  @Input()
  operation: string;

  @Input()
  class: string;

  @Input()
  field: string;

  /**
   * Fixes the issue with nesting our code with ng-template where dependency inject does not work and component does not
   * inject parent
   */
  @Input()
  parentMC: MetaContextComponent;

  protected _bindingsMap: Map<string, any>;


  private _viewInitialized: boolean = false;
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
    if (!this.parentMC) {
      this.parentMC = this._parentMC;
    }

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
      this._bindingsMap.forEach((v, k) => line += `${k}=>${v}; `);
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

    return `${contexPath}`;
  }

  private initBindings(): void {
    // this._bindingsMap = this.parentMC ? new Map<string, any>(this.parentMC._bindingsMap) : new Map<string, any>();
    this._bindingsMap = new Map<string, any>();

    this.inputs.forEach((input) => {
      if (input.propName !== 'parentMC' && this[input.propName]) {
        this._bindingsMap.set(input.propName, this[input.propName]);
      }
    });
  }

  _parentBindings(): string {
    if (!this.parentMC) {
      return '';
    }
    let bindings = '[';
    this.parentMC._bindingsMap.forEach((v, k) => bindings += `${k}:${v}; `);
    bindings += ']';

    return bindings;
  }


}
