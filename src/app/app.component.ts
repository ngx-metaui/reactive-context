import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'reactive-context';

  classVal = 'User';
  fieldVal = 'age-Content';
  field2Val = 'content-ViewField';

  user: User;
  formGroup: FormGroup = new FormGroup({});
  operation: string;


  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.user = new User('12', 'John', 'Flinstone', 33);

    for (const field in this.user) {
      if (field) {
        this.formGroup.addControl(field, new FormControl(this.user[field]));
      }

    }


  }


  changeClass(): void {
    this.classVal = 'Order';
    this.cd.detectChanges();
  }


  changeField(): void {
    this.fieldVal = 'Changed-Field-Content';
    this.cd.detectChanges();
  }

  changeField2(): void {
    this.field2Val = 'Changed-field2Val';
    this.cd.detectChanges();
  }

  changeFirstName(): void {
    this.formGroup.controls.firstName.patchValue('Kevin');
    this.cd.detectChanges();
  }

  changeOp() {
    this.operation = this.operation === 'edit' ? 'view' : 'edit';
  }
}


export class User {
  constructor(public id: string, public firstName: string, public lastName: string, age: number) {
  }
}
