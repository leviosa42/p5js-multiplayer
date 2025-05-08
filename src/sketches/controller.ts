import p5 from "p5";

interface Touch {
  x: number;
  y: number;
  winX: number;
  winY: number;
  id: number;
}

/**
 * Joystick class to handle joystick input
 * @param p5 - p5 instance
 */

class Joystick {
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

    console.log("touch", touch);
    this.updateInputV(touch.x, touch.y);
  }

  onTouchEnded(_touches: Touch[]) {
    if (this.touchID === null) return;
    this.touchID = null;
    this.inputV = null;
  }

  draw() {
    this.p5.text(`touchID: ${this.touchID}`, 10, 20);
    this.p5.text(`inputV: ${this.inputV}`, 10, 40);
    this.p5.text(`positionV: ${this.positionV}`, 10, 60);

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

export const sketch = (p5: p5) => {
  let joystick: Joystick | null = null;
  let playerV: p5.Vector | null = null; // mockup player variable

  // NOTE: touch{Started, Moved, Ended} are not working...
  p5.mousePressed = (event: MouseEvent) => {
    event.preventDefault(); // Prevent default touch behavior
    if (joystick === null) return;
    joystick.onTouchStarted(p5.touches as Touch[]);
  };

  p5.mouseDragged = (event: MouseEvent) => {
    event.preventDefault();
    if (joystick === null) return;
    joystick.onTouchMoved(p5.touches as Touch[]);
  };

  p5.mouseReleased = (event: MouseEvent) => {
    event.preventDefault();
    if (joystick === null) return;
    joystick.onTouchEnded(p5.touches as Touch[]);
  };

  p5.windowResized = () => {
    const parent = p5.canvas.parentElement!;
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  p5.setup = () => {
    const parent = p5.canvas.parentElement!;
    p5.createCanvas(parent.clientWidth, parent.clientHeight);
    joystick = new Joystick({
      p5,
      touchID: null,
      positionV: p5.createVector(p5.width * 0.2, p5.height * 0.8),
      radius: p5.height * 0.1,
      effectiveRadius: p5.height * 0.15,
    });
    playerV = p5.createVector(p5.width / 2, p5.height / 2);
  };

  p5.draw = () => {
    p5.background(220);

    p5.text(JSON.stringify(p5.touches), 10, 100);

    // grid lines
    p5.push();
    p5.stroke(0, 32);
    p5.strokeWeight(1);
    for (let i = 0; i < p5.width; i += 20) {
      p5.line(i, 0, i, p5.height);
    }
    for (let i = 0; i < p5.height; i += 20) {
      p5.line(0, i, p5.width, i);
    }
    p5.pop();

    joystick!.draw();

    // player
    // player moving
    if (joystick!.inputV) {
      playerV!.add(joystick!.inputV.copy().mult(5));
    }

    p5.push();
    p5.fill(0, 255, 0);
    p5.circle(playerV!.x, playerV!.y, 20);
    const directionV = joystick!.inputV?.copy().mult(50);
    if (directionV) {
      p5.line(
        playerV!.x,
        playerV!.y,
        playerV!.x + directionV.x,
        playerV!.y + directionV.y,
      );
    }
    p5.pop();
  };
};
