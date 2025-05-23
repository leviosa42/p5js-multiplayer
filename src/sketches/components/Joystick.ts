import p5 from "p5";
import { Touch } from "../../types.d.ts";
/**
 * Joystick class to handle joystick input
 * @param p5 - p5 instance
 */

export class Joystick {
  private p5: p5;
  public touchID: number | null;
  private positionV: p5.Vector;
  public inputV: p5.Vector | null;
  public radius: number;
  private effectiveRadius: number;

  constructor(options: {
    p5: p5;
    touchID: number | null;
    positionV: p5.Vector;
    radius: number;
    effectiveRadius: number;
  }) {
    this.p5 = options.p5;
    this.touchID = options.touchID;
    this.positionV = options.positionV;
    this.inputV = null;
    this.radius = options.radius;
    this.effectiveRadius = options.effectiveRadius;
  }

  public updateInputV(x: number, y: number) {
    this.inputV = this.p5.createVector(x, y)
      .sub(this.positionV)
      .div(this.radius)
      .limit(1);
  }

  /**
   * @example
   * const joystick = new Joystick(...);
   * p5.touchStarted = () => {
   *   joystick.onTouchStarted(p5.touches);
   * }
   */
  onTouchStarted(touches: Touch[]) {
    // Detect which touch is inside the joystick area

    if (this.touchID !== null) return;
    if (touches.length === 0) return;

    const touch = touches.find((touch: Touch) => {
      const d = this.p5.dist(
        touch.x,
        touch.y,
        this.positionV.x,
        this.positionV.y,
      );
      return d < this.effectiveRadius;
    });
    // console.log("touches", touches);
    if (!touch) return;

    this.touchID = touch.id;
    this.updateInputV(touch.x, touch.y);
  }

  onTouchMoved(touches: Touch[]) {
    if (this.touchID === null) return;

    const touch = touches.find((touch: Touch) => touch.id === this.touchID);
    if (!touch) return;
    this.p5.text(`touchID: ${touch.id}`, 200, 20);
    if (this.inputV === null) return;

    // console.log("touch", touch);
    this.updateInputV(touch.x, touch.y);
  }

  onTouchEnded(_touches: Touch[]) {
    if (this.touchID === null) return;
    this.touchID = null;
    this.inputV = null;
  }

  draw() {
    // this.p5.text(`touchID: ${this.touchID}`, 10, 20);
    // this.p5.text(`inputV: ${this.inputV}`, 10, 40);
    // this.p5.text(`positionV: ${this.positionV}`, 10, 60);

    // effective area
    this.p5.push();
    this.p5.strokeWeight(1);
    this.p5.circle(
      this.positionV.x,
      this.positionV.y,
      this.effectiveRadius * 2,
    );
    this.p5.pop();

    // joystick area
    this.p5.push();
    this.p5.circle(
      this.positionV.x,
      this.positionV.y,
      this.radius * 2,
    );
    this.p5.pop();

    // joystick input
    if (this.inputV) {
      this.p5.push();
      this.p5.fill(255, 0, 0);
      this.p5.circle(
        this.positionV.x + this.inputV.x * this.radius,
        this.positionV.y + this.inputV.y * this.radius,
        (this.effectiveRadius - this.radius) * 2,
      );
      this.p5.pop();
    }
  }
}
