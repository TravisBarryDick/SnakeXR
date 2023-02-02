import { TypedComponent } from "./utils/aframe-typescript-utils";
import { getGlobalState } from "./global-state";

export const ScoreBoardComponent = new TypedComponent("score-board", {
  schema: {
    text: { type: "string", default: "Score: " },
  },

  init() {
    this.el.setAttribute("text", {
      value: `${this.data.text}0`,
      align: "center",
    });
    getGlobalState().score.addListener(this.onScoreChanged.bind(this));
  },

  onScoreChanged(newValue: number) {
    this.el.setAttribute("text", { value: `${this.data.text}${newValue}` });
  },
});
