import "./style.css";

import p5 from "p5";

import { sketch } from "./sketches/controller.ts";

new p5(sketch, document.getElementById("canvas-a") as HTMLElement);
new p5(sketch, document.getElementById("canvas-b") as HTMLElement);
