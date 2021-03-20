import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  SkipSelf
} from '@angular/core';
import {Environment} from '../env.service';
import {BehaviorSubject} from 'rxjs';
import {ControlContainer, FormGroup} from '@angular/forms';

export const ACTIVE_CNTX = 'CurrentMC';


@Component({
  selector: 'mc',
  template: `
    <div [ngStyle]="{'padding-left.px':level*10 }">
      <ng-content></ng-content>
    </div>


  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetaContextComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
  @Input()
  module: string;

  @Input()
  object: any;

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

  contextChanged$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  level: number = 0;


  protected _bindingsMap: Map<string, any>;
  protected _form: FormGroup;
  private inputs: { propName: string, templateName: string }[];


  private currentStack: string[] = [];


  get stack(): string[] {
    return this.currentStack;
  }


  constructor(private _cfr: ComponentFactoryResolver, private env: Environment,
              private _cd: ChangeDetectorRef,
              @Optional() private _controlContainer: ControlContainer,
              @Optional() @SkipSelf() private _parentMC?: MetaContextComponent) {
    this.inputs = this._cfr.resolveComponentFactory(MetaContextComponent).inputs;
  }

  ngOnInit(): void {
    this._form = (this._controlContainer ? this._controlContainer.control as FormGroup : new FormGroup({}));

    if (!this.parentMC) {
      this.parentMC = this._parentMC;
    }
    this._setDebugLevel();

    this._initBindings();
    this.pushPop(true);
    this._doUpdateViews();

    console.log('ngOnInit()', this.currentStack);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges()', changes);
    if (!this.isFirstChange(changes)) {
      this._initBindings();
      this.pushPop(false);
      this.pushPop(true);
      this._doUpdateViews();
      this._cd.detectChanges();
    }

  }

  ngDoCheck(): void {
    console.log('ngDoCheck => ', this.currentStack);
  }


  private isFirstChange(changes: SimpleChanges): boolean {
    for (const input of this.inputs) {
      if (changes[input.propName] && changes[input.propName].firstChange) {
        return true;
      }
    }
    return false;
  }


  private pushPop(isPush: boolean): void {
    if (isPush) {
      let line = '(';
      this._bindingsMap.forEach((v, k) => line += `${k}=>${v}; `);
      line += ')';
      this.currentStack.push(line);
    } else {
      this.currentStack.pop();
    }
  }


  private _initBindings(): void {
    this._bindingsMap = this.parentMC ? new Map<string, any>(this.parentMC._bindingsMap) : new Map<string, any>();

    this.inputs.forEach((input) => {
      if (input.propName !== 'parentMC' && this[input.propName]) {
        if (this._bindingsMap.has(input.propName)) {
          this._bindingsMap.set(input.propName + '-1', this[input.propName]);
        } else {
          this._bindingsMap.set(input.propName, this[input.propName]);
        }
      }
    });

    if (this.object) {
      this._form.valueChanges.subscribe((item) => {
        console.log('Value Changed');
        console.log(item);

        this._doUpdateViews();

      });

      this._form.statusChanges.subscribe((item) => {
        console.log('Value Changed');
        console.log(item);

        this._doUpdateViews();
      });
    }

  }

  private _doUpdateViews(): void {
    this.contextChanged$.next(this.currentStack);
    // this._cd.markForCheck();
  }

  private _setDebugLevel(): void {
    let mc: MetaContextComponent = this.parentMC;
    this.level = 1;
    while (mc) {
      mc = mc.parentMC;
      this.level++;
    }
  }

  ngOnDestroy(): void {
  }

}
