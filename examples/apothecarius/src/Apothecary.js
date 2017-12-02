import React from "react";
import { initialize, split } from "apothecary";
import { Bridge, tunnel, fromProps } from "react-apothecary";

const store = initialize({ n: 1 });

const increment = split(n => n + 1, "n");

const decrement = split(n => n - 1, "n");

function Counter({ n, inc, dec }) {
  return (
    <div>
      <button onClick={dec}>-</button>{n}<button onClick={inc}>+</button>
    </div>
  );
}

const CounterApp = tunnel(state => ({ n: state.n }), {
  inc: increment,
  dec: decrement
})(Counter);

export default () => <Bridge store={store}><CounterApp /></Bridge>;

