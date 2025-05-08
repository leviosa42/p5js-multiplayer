import p5 from "p5";

import { Joystick } from "./components/Joystick.ts";
import { Touch } from "../types.d.ts";

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
