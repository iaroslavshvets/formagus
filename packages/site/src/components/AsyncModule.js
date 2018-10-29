import React from 'react';

export class AsyncModule extends React.Component {
  state = { mod: null };

  componentDidMount() {
    this.props.load().then(mod => {
      this.setState({ mod });
    });
  }

  render() {
    return this.props.children(this.state.mod);
  }
}
