import { TypedComponent } from "./utils/aframe-typescript-utils";
import { getGlobalState } from "./global-state";

export const TouchControlsComponent = new TypedComponent("touch-controls", {
  schema: {
    target: { type: "string" },
  },

  events: {
    thumbstickmoved: function (evt: { detail: { x: number; y: number } }) {
      let scores = [evt.detail.y, -evt.detail.y, evt.detail.x, -evt.detail.x];
      let dirs = [
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
      ];
      let highestScore = 0.5;
      let highestIx = -1;
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > highestScore) {
          highestScore = scores[i];
          highestIx = i;
        }
      }
      if (highestIx != -1) {
        let target = document.querySelector(this.data.target);
        target.emit("set-direction", { direction: dirs[highestIx] });
      }
    },

    abuttondown: function () {
      getGlobalState().gameState.get().dispatch("onStart");
    },
  },
});
