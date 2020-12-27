import { Component, ComponentType } from "react";

export function  withTryToChangeEvent<P extends object>(Wrapper: ComponentType<P>) {

  return class extends Component {
    render() {
      return <Wrapper {...this.props as P} />;
    }
  };
}
