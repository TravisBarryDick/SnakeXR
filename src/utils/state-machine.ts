import { MethodKeys, RestOfArgs } from "./type-utils";

export class StateMachine<State extends object> {
  state: State;
  constructor(state: State) {
    this.state = state;
    (this as any).dispatch("onEnter");
  }
  transition(nextState: State) {
    let state = this.state as any;
    if ("onExit" in state) state.onExit();
    this.state = nextState;
    (this as any).dispatch("onEnter");
  }
  dispatch<FName extends MethodKeys<State>>(
    name: FName,
    ...args: RestOfArgs<State[FName]>
  ): void {
    if (name in this.state) {
      let state = this.state as any;
      let nextState = state[name].call(state, ...args);
      if (nextState !== undefined) this.transition(nextState);
    }
  }
}
