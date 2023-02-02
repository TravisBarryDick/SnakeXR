import { Entity } from "aframe";
import { TypedComponent } from "./utils/aframe-typescript-utils";

export const ColliderComponent = new TypedComponent("collider", {
  schema: {
    targetSelector: { type: "string" },
  },

  tick() {
    let targets = document.querySelectorAll(
      this.data.targetSelector
    ) as NodeListOf<Entity>;
    for (let target of targets) {
      if (target == this.el) continue;
      if (target.object3D.position.equals(this.el.object3D.position)) {
        this.el.emit("collided", { entity: target });
      }
    }
  },
});
