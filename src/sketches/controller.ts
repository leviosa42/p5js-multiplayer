import p5 from "p5";
import mqtt from "mqtt";

import { Joystick } from "./components/Joystick.ts";
import { Touch } from "../types.d.ts";
import { Player } from "./components/Player.ts";
// import { Buffer } from "node:buffer";

interface PlayerDataModel {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  clientId: string;
  timestamp: number;
}
export const sketch = (p5: p5) => {
  const MQTT_URL = "http://localhost:1884";
  const MQTT_TOPIC = "game";
  const MQTT_OPTIONS = {
    clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  };
  let mqttClient: mqtt.MqttClient | null = null;
  mqttClient = mqtt.connect(MQTT_URL, MQTT_OPTIONS);
  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    mqttClient!.subscribe(MQTT_TOPIC, (err: Error | null) => {
      if (err) {
        console.error("Failed to subscribe to topic:", err);
      } else {
        console.log("Subscribed to topic:", MQTT_TOPIC);
      }
    });
  });
  mqttClient.on("message", (_topic: string, payload: any) => {
    const data: PlayerDataModel = JSON.parse(
      payload.toString(),
    ) as PlayerDataModel;
    console.log("Received data:", data);
    onlinePlayers.set(data.clientId, data);
  });
  const onlinePlayers: Map<string, PlayerDataModel> = new Map();

  let joystick: Joystick | null = null;
  // let playerV: p5.Vector | null = null; // mockup player variable
  let player: Player | null = null;

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

    // playerV = p5.createVector(p5.width / 2, p5.height / 2);
    player = new Player({
      p5,
      positionV: p5.createVector(p5.width / 2, p5.height / 2),
      radius: 20,
      weight: 1,
      maxSpeed: 5,
      maxForce: 10,
      friction: 0.5,
    });
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
      // playerV!.add(joystick!.inputV.copy().mult(5));
      player!.applyForce(joystick!.inputV.copy().mult(1));
    }

    player!.update();
    player!.draw();
    // other players
    onlinePlayers.forEach((data: PlayerDataModel, clientId: string) => {
      p5.push();
      p5.fill("#008800");
      p5.ellipse(data.position.x, data.position.y, 20);
      p5.text(
        `lag: ${Date.now() - data.timestamp}`,
        data.position.x,
        data.position.y,
      );
      p5.pop();
    });

    mqttClient!.publish(
      MQTT_TOPIC,
      JSON.stringify({
        position: {
          x: player!.positionV.x,
          y: player!.positionV.y,
        },
        velocity: {
          x: player!.velocityV.x,
          y: player!.velocityV.y,
        },
        clientId: mqttClient!.options.clientId,
        timestamp: Date.now(),
      }),
    );

    // debug
    p5.text(`mqtt clientId: ${mqttClient!.options.clientId}`, 10, 80);
    // debug
    p5.text(`frameRate: ${p5.frameRate().toFixed(2)}`, 10, 20);
  };
};
