import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Environment {
  private stacksVariables: Map<string, any[]> = new Map<string, any[]>();

  peak<T>(key: string): T {
    const stack: T[] = this.stacksVariables.get(key) || [];

    return stack.slice(-1).pop();
  }


  pop<T>(key: string): T {
    const stack: T[] = this.stacksVariables.get(key) || [];
    return stack.pop();
  }


  push<T>(key: string, value: T): void {
    const stack: T[] = this.stacksVariables.get(key) || [];
    stack.push(value);
    this.stacksVariables.set(key, stack);
  }
}
