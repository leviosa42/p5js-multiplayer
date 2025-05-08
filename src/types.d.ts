import _p5 from "p5";

export interface Touch {
  x: number;
  y: number;
  winX: number;
  winY: number;
  id: number;
}

declare module "p5" {
  // NOTE: psInstanceExtension という拡張用と思われる便利なinterfaceがあるので、これを使う
  interface p5InstanceExtensions {
    // WHY:
    //   p5.canvas は p5.js の内部で定義されているが、@types/p5 では定義されていない．
    //   これを定義することで、p5.canvas を使用できるようにする．
    canvas: HTMLCanvasElement;
    // REF: https://github.com/processing/p5.js/blob/31aebe1fc38153dffa34627aa5490e328dbe06f1/src/events/touch.js#L111C1-L123C1
    // touches: Touch[];
  }
}
