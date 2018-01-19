import React, { Component } from 'react';
import T from 'prop-types';

export default function connect(select, actions = {}) {
  return C =>
    class extends Component {
      static contextTypes = {
        store: T.shape({
          dispatch: T.func,
          getState: T.func,
          subscribe: T.func
        })
      };

      state = this.context.store.getState();

      listen = state => {
        if (this.mounted) {
          this.setState(state);
        }
      }

      componentDidMount() {
        this.mounted = true;
        this.context.store.subscribe(this.listen);
      }

      componentWillUnmount() {
        this.mounted = false;
        this.context.store.unsubscribe(this.listen);
      }

      rawState() {
        return this.context.store.getState();
      }

      transformedState() {
        return select(this.rawState(), this.props);
      }

      childProps() {
        return {
          ...this.props,
          ...this.transformedState()
        };
      }

      mappedActions() {
        const actionProps = actions.fromProps ?
          actions(this.props, this.transformedState(), this.rawState()) :
          actions;

        return Object.entries(actionProps).reduce(
          (mapped, [name, a]) => ({
            ...mapped,
            [name]: () => this.context.store.dispatch(a)
          }),
          {}
        );
      }

      render() {
        return (
          <C
            {...this.childProps()}
            {...this.mappedActions()}
          />
        );
      }
    };
}
