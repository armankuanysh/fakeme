import * as PIXI from "pixi.js";

class Delax {
  constructor(container, image, imageMap) {
    this.container = document.querySelector(container);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      resolution: window.devicePixelRatio,
      autoResize: true
    });
    // this.app = new PIXI.WebGLRenderer(this.width, this.height);
    this.container.appendChild(this.app.view);

    this.stage = new PIXI.Container();
    this.wrapper = new PIXI.Container();
    this.foreground = new PIXI.Container();
    this.stage.addChild(this.wrapper);
    this.stage.addChild(this.foreground);

    this.loader();
  }

  loader(img, imgMap) {
    this.pic = null;
    this.picMap = null;
    const those = this;
    this.mousex = this.width / 2;
    this.mousey = this.height / 2;
    this.myLoader = new PIXI.loaders.Loader();
    this.filter = new PIXI.filters.DisplacementFilter();
    this.myLoader.add("pic", img);
    this.myLoader.add("picMap", imgMap);

    function takeTexture() {
      those.pic = new PIXI.Sprite(those.myLoader.resources.pic.texture);
      those.foreground.addChild(those.pic);

      those.picMap = new PIXI.Sprite(those.myLoader.resources.picMap.texture);
      const map = those.filter(those.picMap, 0);
      those.pic.filters = [map];

      window.addEventListener("mousemove", e => {
        those.mousex = e.clientX;
        those.mousey = e.clientY;
      });

      those.animate();
    }

    this.myLoader.once("complete", takeTexture);
    this.myLoader.load();
  }

  animate() {
    this.filter.scale.x = (window.innerWidth / 2 - this.mousex) / 20;
    this.filter.scale.y = (window.innerHeight / 2 - this.mousey) / 20;

    this.foreground.addChild(this.picMap);
    this.picMap.renderable = false;

    this.app.addChild(this.stage);
    requestAnimationFrame(this.animate);
  }
}

export default Delax;
