import { TypedComponent } from "./utils/aframe-typescript-utils";

export const KeyboardControlsComponent = new TypedComponent(
  "keyboard-controls",
  {
    boundKeyDownHandler: null as (evt: { key: string }) => null,

    schema: {},
    init() {
      this.boundKeyDownHandler = this.keyDownHandler.bind(this);
    },

    play() {
      window.addEventListener("keydown", this.boundKeyDownHandler);
    },

    pause() {
      window.removeEventListener("keydown", this.boundKeyDownHandler);
    },

    keyDownHandler(evt: { key: string }) {
      let keyLower = evt.key.toLowerCase();
      if (keyLower == "w")
        this.el.emit("set-direction", { direction: { x: 0, y: 1, z: 0 } });
      if (keyLower == "s")
        this.el.emit("set-direction", { direction: { x: 0, y: -1, z: 0 } });
      if (keyLower == "d")
        this.el.emit("set-direction", { direction: { x: 1, y: 0, z: 0 } });
      if (keyLower == "a")
        this.el.emit("set-direction", { direction: { x: -1, y: 0, z: 0 } });
    },
  }
);
