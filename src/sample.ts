import p5 from "p5";
export const sketch = (p5: p5) => {
  p5.windowResized = () => {
    const parent = p5.canvas.parentElement!;
    p5.resizeCanvas(parent.clientWidth, parent.clientHeight);
  };

  p5.setup = () => {
    const parent = p5.canvas.parentElement!;
    p5.createCanvas(parent.clientWidth, parent.clientHeight);
  };

  p5.draw = () => {
    p5.background(220);
    // p5.textSize(16);
    p5.text(`width: ${p5.width}, height: ${p5.height}`, 10, 20);
    p5.text(`mouseX: ${p5.mouseX}, mouseY: ${p5.mouseY}`, 10, 40);
    p5.text(`frameCount: ${p5.frameCount}`, 10, 60);
    p5.text(`FPS: ${p5.frameRate().toFixed(2)}`, 10, 80);
    p5.circle(p5.mouseX, p5.mouseY, 50);
  };
};
