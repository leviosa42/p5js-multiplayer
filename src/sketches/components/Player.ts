import p5 from "p5";

export class Player {
  private p5: p5;
  public positionV: p5.Vector;
  public velocityV: p5.Vector;
  public accelerationV: p5.Vector;
  public radius: number;
  public weight: number;
  public maxSpeed: number;
  public maxForce: number;
  public friction: number;

  constructor(options: {
    p5: p5;
    positionV: p5.Vector;
    radius: number;
    weight: number;
    maxSpeed: number;
    maxForce: number;
    friction: number;
  }) {
    this.p5 = options.p5;
    this.positionV = options.positionV.copy();
    this.velocityV = this.p5.createVector(0, 0);
    this.accelerationV = this.p5.createVector(0, 0);
    this.radius = options.radius;
    this.weight = options.weight;
    this.maxSpeed = options.maxSpeed;
    this.maxForce = options.maxForce;
    this.friction = options.friction;
  }

  public applyForce(force: p5.Vector) {
    this.accelerationV.add(force);
  }

  public applyFriction() {
    const frictionV = this.velocityV.copy().mult(-1).normalize().mult(
      this.friction,
    );
    if (this.velocityV.mag() < frictionV.mag()) { // stop the player if the velocity is very small
      this.velocityV.set(0, 0);
    } else {
      this.velocityV.add(frictionV);
    }
  }
  public update() {
    // update velocity
    // weighing acceleration by weight
    this.velocityV.add(this.accelerationV.copy().div(this.weight));

    // limit velocity
    if (this.velocityV.mag() > this.maxSpeed) {
      this.velocityV.setMag(this.maxSpeed);
    }
    // update position
    this.positionV.add(this.velocityV);
    // reset acceleration
    this.accelerationV.mult(0);
    // apply friction
    this.applyFriction();

    // wrap around screen
    if (this.positionV.x < 0) {
      this.positionV.x = this.p5.width;
    } else if (this.positionV.x > this.p5.width) {
      this.positionV.x = 0;
    }
    if (this.positionV.y < 0) {
      this.positionV.y = this.p5.height;
    } else if (this.positionV.y > this.p5.height) {
      this.positionV.y = 0;
    }
  }

  public draw() {
    this.p5.push();

    // player position
    this.p5.ellipse(this.positionV.x, this.positionV.y, this.radius * 2);

    // player velocity
    this.p5.stroke(255, 0, 0);
    this.p5.strokeWeight(4);
    this.p5.line(
      this.positionV.x,
      this.positionV.y,
      this.positionV.x + this.velocityV.x * 10,
      this.positionV.y + this.velocityV.y * 10,
    );

    // player acceleration
    this.p5.stroke(0, 255, 0);
    this.p5.strokeWeight(2);
    this.p5.line(
      this.positionV.x,
      this.positionV.y,
      this.positionV.x + this.accelerationV.x * 10,
      this.positionV.y + this.accelerationV.y * 10,
    );

    this.p5.pop();
  }
}
