import React, { Component } from 'react';
import T from 'prop-types';

export default class Bridge extends Component {
  static childContextTypes = {
    store: T.shape({
      dispatch: T.func,
      getState: T.func,
      subscribe: T.func
    })
  };

  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}
