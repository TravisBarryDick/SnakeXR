// States:
// 1. Menu: Start button to begin the game.
// 2. Playing: Game is currently playing.
// 3.

import { AppleComponent } from "./apple";
import { getGlobalState } from "./global-state";
import { KeyboardControlsComponent } from "./keyboard-controls";
import { SnakeComponent } from "./snake";
import { StateMachine } from "./utils/state-machine";

export interface GameState {
  onEnter?(): GameState;
  onStart?(): GameState;
  onDeath?(): GameState;
  onExit?(): void;
}

let menuState: GameState = {
  onEnter() {
    let menu = document.querySelector("#menu");
    if (menu) menu.setAttribute("visible", true);
    return undefined;
  },

  onExit() {
    let menu = document.querySelector("#menu");
    if (menu) menu.setAttribute("visible", false);
  },

  onStart() {
    return playingState;
  },
};

let playingState: GameState = {
  onEnter() {
    getGlobalState().score.set(0);
    let boardSize = getGlobalState().boardSize.get();

    let gameArea = document.querySelector("#game-dynamic");
    let container = document.createElement("a-entity");
    container.id = "container";
    container.object3D.position.x = -boardSize.x / 2 + 0.5;
    container.object3D.position.y = -boardSize.y / 2 + 0.5;
    gameArea.appendChild(container);

    // Create the board and append it to the game area.
    let board = document.createElement("a-plane");
    board.id = "board";
    board.setAttribute("width", boardSize.x);
    board.setAttribute("height", boardSize.y);
    board.setAttribute("position", {
      x: boardSize.x / 2 - 0.5,
      y: boardSize.y / 2 - 0.5,
      z: 0,
    });
    board.setAttribute("color", "#222");
    container.appendChild(board);

    // Create the snake and append it to the game area.
    let snake = document.createElement("a-entity");
    snake.id = "snake";
    SnakeComponent.setComponentData(snake, {
      speed: 10,
      direction: { x: 1, y: 0, z: 0 },
    });
    KeyboardControlsComponent.setComponentData(snake, {});
    container.appendChild(snake);

    // Create the apple and append it to the game area.
    let apple = document.createElement("a-box");
    apple.id = "apple";
    apple.setAttribute("color", "#F00");
    AppleComponent.setComponentData(apple, {});
    AppleComponent.getFromEntity(apple).moveRandomly();
    container.append(apple);

    document.querySelector("#game").setAttribute("visible", true);

    return undefined;
  },

  onDeath() {
    return menuState;
  },

  onExit() {
    let gameArea = document.querySelector("#game-dynamic");
    let container = document.querySelector("#container");
    gameArea.removeChild(container);
    document.querySelector("#game").setAttribute("visible", false);
  },
};

getGlobalState().gameState.set(new StateMachine<GameState>(menuState));
