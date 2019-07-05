import * as PIXI from "pixi.js";
import GyroNorm from "./lib/gyronorm";

class Fakeme {
  constructor(container, img, imgMap) {
    this.container = document.querySelector(container);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      resolution: window.devicePixelRatio,
      autoResize: true
    });
    this.container.appendChild(this.app.view);

    this.loader(img, imgMap);
    this.mouseMove();
    this.touchMove();
    this.gyro();
  }

  loader(a, b) {
    // eslint-disable-next-line new-cap
    this.image = new PIXI.Sprite.from(a);
    this.image.width = this.width;
    this.image.height = this.height;
    this.image.position.x = 0;
    this.image.position.y = 0;
    this.app.stage.addChild(this.image);

    // eslint-disable-next-line new-cap
    this.map = new PIXI.Sprite.from(b);
    this.map.width = this.image.width;
    this.map.height = this.image.height;
    this.map.position.x = 0;
    this.map.position.y = 0;
    this.map.pivot.x = 0.5;
    this.app.stage.addChild(this.map);

    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.map);
    this.app.stage.filters = [this.displacementFilter];
  }

  interaction(x, y) {
    this.displacementFilter.scale.x = (window.innerWidth / 2 - x) / 20;
    this.displacementFilter.scale.y = (window.innerHeight / 2 - y) / 20;
  }

  mouseMove() {
    const those = this;
    window.addEventListener("mousemove", e => {
      those.interaction(e.clientX, e.clientY);
    });
  }

  touchMove() {
    const those = this;
    window.addEventListener("touchmove", e => {
      const x = e.pageX;
      const y = e.pageY;
      those.interaction(x, y);
    });
  }

  // deviceMove() {
  //   const those = this;

  //   function moveCalibration(e) {
  //     let x = e.beta;
  //     let y = e.gamma;

  //     if (x > 90) {
  //       x = 90;
  //     }
  //     if (x < -90) {
  //       x = -90;
  //     }

  //     x += 90;
  //     y += 90;

  //     document.querySelector("#pp").innerHTML = Math.round(x);

  //     those.interaction(x, y);
  //   }
  //   if (!window.DeviceOrientationEvent) {
  //     alert("not supported");
  //   } else {
  //     window.addEventListener("deviceorientation", moveCalibration);
  //   }
  // }

  gyro() {
    this.gyro = new GyroNorm.GyroNorm();

    const those = this;

    this.maxTilt = 15;

    const rotationCoef = 0.15;

    this.gyro
      .init({ gravityNormalized: true })
      .then(() => {
        those.gyro.start(data => {
          const y = data.do.gamma;
          const x = data.do.beta;

          those.interaction(x, y);
        });
      })
      .catch(e => {
        alert("not supported");
      });
  }
}

export default Fakeme;
