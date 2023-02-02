import { Entity } from "aframe";
import { TypedComponent } from "./utils/aframe-typescript-utils";
import { ColliderComponent } from "./collider";
import { getGlobalState } from "./global-state";
import { SnakeComponent } from "./snake";

export const AppleComponent = new TypedComponent("apple", {
  schema: {},

  init() {
    this.moveRandomly();
    ColliderComponent.setComponentData(this.el, { targetSelector: "#head" });
  },

  moveRandomly() {
    let size = getGlobalState().boardSize.get();
    this.el.object3D.position.setX(Math.floor(Math.random() * size.x));
    this.el.object3D.position.setY(Math.floor(Math.random() * size.y));
  },

  events: {
    collided: function (evt: { detail: { entity: Entity } }) {
      let sc = SnakeComponent.getFromEntity(
        evt.detail.entity.parentElement as Entity
      );
      sc.addSegment();
      getGlobalState().score.set(getGlobalState().score.get() + 1);
      this.moveRandomly();
    },
  },
});
