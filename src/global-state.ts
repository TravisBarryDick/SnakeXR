import { Entity } from "aframe";
import { StateMachine } from "./utils/state-machine";
import { GameState } from "./game-state";

type StateListener<T> = (value: T) => void;

class StateEntry<T> {
  listeners = new Set<StateListener<T>>();
  value: T;

  constructor(value?: T) {
    this.value = value;
  }

  addListener(listener: StateListener<T>) {
    this.listeners.add(listener);
  }

  removeListener(listener: StateListener<T>) {
    this.listeners.delete(listener);
  }

  set(value: T) {
    this.value = value;
    for (let listener of this.listeners) {
      listener(this.value);
    }
  }

  get() {
    return this.value;
  }
}

let globalState = {
  gameState: new StateEntry<StateMachine<GameState>>(),
  score: new StateEntry<number>(0),
  boardSize: new StateEntry<{ x: number; y: number }>({ x: 30, y: 30 }),
};

export function getGlobalState() {
  return globalState;
}
(window as any).getGlobalState = getGlobalState;
