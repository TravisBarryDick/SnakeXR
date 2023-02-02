import { Entity } from "aframe";
import { TypedComponent } from "./utils/aframe-typescript-utils";

export const BoardRepositionComponent = new TypedComponent("board-reposition", {
  schema: {
    target: { type: "selector" },
  },

  events: {
    abuttondown: function () {
      let target = this.data.target as Entity;
      target.object3D.position.copy(this.el.object3D.position);
      target.object3D.position.y -= 0.1;
    },
  },
});
