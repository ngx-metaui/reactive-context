# ReactiveContext

This project tries to simulate current problem in MetaUI and to see if we can improve the way we currently 
manipulate the context.

When we are setting the context we expect angular components are executing our PushPop calls at certain order. 
The context is a stack of nested assignments (contextual values (key, value pairs)). 

```html
  <Node1 object operation > - PUSH <!-- let;s assume we have these bindings there -->
       <Node2 class> - PUSH  <!-- object, operation, class -->
           <Node3 field1> - PUSH  <!-- object, operation, class, field1 -->
           <Node3> - POP
           <Node4 field2> - PUSH  <!-- object, operation, class, field2 -->
           <Node4> - POP
       <Node2> - POP
  <Node1> - POP
```

Currently we are using CD callbacks to manage both push and pop, but sometimes its pretty challenging. 
The idea is that we should be able to reuse assignments created by parent (stored on the page level) to 
either add new contextual values as we keep stepping down (Node1, Node2, Node3), but also popping out so we can 
be back at parent level (Node1) to be ready to push new child (Node4).

This is all about performance. Here is the example what is happing in our API. 

````ts
const context = env.get new stack or create new for pages;

context.push()
context.set('object', object);
context.set('operation', operation);

    context.push()
    context.set('class', class);
        context.push()
        context.set('field', field1);
        context.pop()

        context.push()
        context.set('field', field1);
        context.pop()
    context.pop()
context.pop()

````

In every step we evaluate and calculate effective map of properties for current stack of assignments. Here 
we want to reuse whatever was already calculated at the parent level.

We could also reuse parent component and inject to see what parent are bindings assignments on the parent level

```ts

class Node {
    @Input
    object
    
    @Input
    operation
    
    @Input
    class
    
    @Input
    field
    
    constructur(@SkipSelf @Optional parent?: Node){}s
}

``` 

We can access our parent for most cases, but there also situation where parent injection does not work, when use 
ng-template to refactor some of the part of our code.


```html
  <Node1 object operation > - PUSH 
       <Node2 class> - PUSH 
           <Node3 field1> - PUSH
           <Node3> - POP
           <ng-container call-RenderField with field4></ng-container>
       <Node2> - POP
  <Node1> - POP


<ng-template renderField let-name>
   <Node4 name> - PUSH
    Node4> - POP
</ng-template>

```

But in these situaion we can pass parent context down to ng-template, its not ideal but not a problem. The problem is pushing 
assignments in `ngInit`, `ngDoCheck` (as we have it now) and popping in `ngAfterViewInit`, `ngAfterViewChecked`. 
The `ngAfterViewXXX` is at the moment something we can relay on. The `ngAfterContentXXX` is our of question here as it 
executes irregularly out of order of anything.

Manipulating the context in these callback is pretty expensive as we have to also create the actual component 
and add it to the view.




 






