import { Entity } from "aframe";
import { TypedComponent } from "./utils/aframe-typescript-utils";
import { ColliderComponent } from "./collider";
import { getGlobalState } from "./global-state";

export const SnakeComponent = new TypedComponent("snake", {
  segments: null as Array<Entity>,
  timeToMove: 0,

  schema: {
    speed: { type: "number", default: 20 },
    direction: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
  },

  init() {
    this.segments = new Array<Entity>();
    this.addSegment();
    this.segments[0].id = "head";
  },

  moveSegments() {
    for (let i = this.segments.length - 1; i >= 1; i--) {
      this.segments[i].object3D.position.copy(
        this.segments[i - 1].object3D.position
      );
    }
    let head = this.segments[0];
    let headPos = head.object3D.position;
    headPos.x += this.data.direction.x;
    headPos.y += this.data.direction.y;
    headPos.z += this.data.direction.z;
    this.timeToMove += 1.0 / this.data.speed;
  },

  checkForDeath() {
    let headPos = this.segments[0].object3D.position;
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].object3D.position.equals(headPos)) {
        getGlobalState().gameState.get().dispatch("onDeath");
      }
    }
    let boardSize = getGlobalState().boardSize.get();
    if (
      headPos.x < 0 ||
      headPos.x >= boardSize.x ||
      headPos.y < 0 ||
      headPos.y >= boardSize.y
    ) {
      getGlobalState().gameState.get().dispatch("onDeath");
    }
  },

  tick(_time: number, timeDelta: number) {
    this.timeToMove -= timeDelta / 1000;
    if (this.timeToMove <= 0) {
      this.moveSegments();
      this.checkForDeath();
    }
  },

  addSegment() {
    let nextSegment = document.createElement("a-box");
    if (this.segments.length > 0) {
      let lastSegment = this.segments[this.segments.length - 1];
      nextSegment.object3D.position.copy(lastSegment.object3D.position);
    }

    ColliderComponent.setComponentData(nextSegment, {
      targetSelector: "#head",
    });

    this.el.appendChild(nextSegment);
    this.segments.push(nextSegment);
  },

  events: {
    "set-direction": function (evt: {
      detail: { direction: { x: number; y: number; z: number } };
    }) {
      SnakeComponent.setComponentData(this.el, evt.detail);
    },
  },
});
