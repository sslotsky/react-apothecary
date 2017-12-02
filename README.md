# React-Apothecary

React bindings for the [apothecary](https://www.npmjs.com/package/apothecary) state
container. Use this to communicate with the `apothecary` strore.

## Usage

The core API consists of two elements: `Bridge` and `tunnel`.

### Bridge

Normally, your whole app will be wrapped in this component. It provides the `apothecary`
store to a component tree:

```javascript
import React from "react";
import { initialize } from "apothecary";
import { Bridge } from "react-apothecary";
import App from './App';

const store = initialize({ n: 1 });

export default () => <Bridge store={store}><App /></Bridge>;

```

### tunnel

Use this HOC to connect your component to the `apothecary` store. The first argument is
used to inject properties from the store into your component. The second argument can be
used to inject actions, which `react-apothecary` will automatically bind to the `dispatch`.
Example:

```javascript
import React from "react";
import { split } from "apothecary";
import { tunnel } from "react-apothecary";

const increment = split(n => n + 1, "n");

const decrement = split(n => n - 1, "n");

function Counter({ n, inc, dec }) {
  return (
    <div>
      <button onClick={dec}>-</button>{n}<button onClick={inc}>+</button>
    </div>
  );
}

export default tunnel(state => ({ n: state.n }), {
  inc: increment,
  dec: decrement
})(Counter);
```

Let's examine each argument to `tunnel` in detail.

#### First argument: `select(state, inputProps) -> outputProps`

The first argument is a function that you use to inject specific pieces of your
application state into a component. In the example above, we are injecting the `n`
variable from our application state as a prop to our `Counter` component.

The `select` function also accepts the incoming component props as a second argument.
Consider this example:

```javascript
export default tunnel((state, inputProps) => ({
  n: state.n + inputProps.offset || 0
}))(Counter);
```

Now if we were to render our `Counter` component with the `offset` prop, it would change
the value of `n`:

```
<Counter offset={3} />
```

Assuming `n` is equal to `1` in the initial state, our component will render with an `n`
equal to `4`.

#### Second argument: `actions`

The second argument is for injecting `apothecary` actions into your component. The `tunnel` HOC will take
care of binding them to the `dispatch`, so that your component doesn't need to keep a
reference to the `dispatch`. This means that calling the function from the component will
result in a state change in the store. There is a standard and a more advanced way to use this,
both described below.

##### Standard Usage: Object Literals

Normally we use a flat object literal made up of `apothecary` actions. 
Let's look at the original example again:

```javascript
const increment = split(n => n + 1, "n");

const decrement = split(n => n - 1, "n");

export default tunnel(state => ({ n: state.n }), {
  inc: increment,
  dec: decrement
})(Counter);
```

In this case our `Counter` component will receive `inc` and `dec` props. When these are
executed, they will change the value of `n` in the store.

##### Advanced Usage: Using `fromProps(inputProps, outputProps, state)`

A second way to specify the actions is to use the `fromProps` function. Consider this example:

```javascript
import { split } from 'apothecary';
import { fromProps } from 'react-apothecary';

const increment = step => split(n => n + step, "n");

const decrement = step => split(n => n - step, "n");

export default tunnel(state => ({ n: state.n }), fromProps(props => ({
  inc: increment(props.step),
  dec: decrement(props.step)
})))(Counter);
```

In this case, we'd render the component with a `step` prop that indicates how much `n` should
change by when we execute our actions:

```javascript
<Counter step={5} />
```

In addition to the input props, the function that you pass into `fromProps` also accepts
two more arguments. Here are all the arguments described in order:

1. `inputProps`: the props passed into the component by the parent
2. `outputProps`: the props that were computed as a result of the `select` function
3. `state`: the raw `apothecary` state.

These are provided in case they are helpful in the act of composing your actions. Most
of the time, the first argument should be sufficient.

## Contributions

TBD

## Testing

TBD

