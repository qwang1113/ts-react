import * as React from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Geometry,
  LineBasicMaterial,
  VertexColors,
  Color,
  Vector3,
  Line,
  AmbientLight,
} from 'three';
import BaseComponent from '@components/Base';

export default class HelloWorld extends BaseComponent {

  container: HTMLDivElement = null;

  renderer: WebGLRenderer;
  camera: PerspectiveCamera;

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 100);
  }

  componentWillUnmount() {
    this.clearWebGlInstance();
  }

  clearWebGlInstance = () => {
    // 释放webgl实例
    this.renderer.forceContextLoss();
    this.renderer = null;
  }

  getCamera = () => {
    const { clientWidth, clientHeight } = this.container;
    const camera = new PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    // camera.position.z = 20;
    camera.position.set(0, 0, 150);
    camera.lookAt(0, 0, 0);
    this.camera = camera;
    return camera;
  }

  getCube = () => {
    const geometry = new BoxGeometry(5, 5, 5);
    const material = new MeshBasicMaterial({ color: 0xff5555 });
    const cube = new Mesh(geometry, material);
    cube.position.set(0, 0, 5);
    return cube;
  }

  getLine = (color1: string | number | Color, color2: string | number | Color, vector1: any, vector2: any) => {
    const geometry = new Geometry();
    const material = new LineBasicMaterial({ vertexColors: VertexColors });
    const cl1 = new Color(color1);
    const cl2 = new Color(color2);
    const p1 = new Vector3(...vector1);
    const p2 = new Vector3(...vector2);
    geometry.vertices.push(p1, p2);
    geometry.colors.push(cl1, cl2);
    const line = new Line(geometry, material);
    return line;
  }

  init = () => {
    const { clientWidth, clientHeight } = this.container;
    const scene = new Scene();
    const camera = this.getCamera();
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setClearColor(0xFFFFFF, 1);
    this.container.appendChild(this.renderer.domElement);

    for (let i = -100; i <= 100; i += 5) {
      const line1 = this.getLine(0x444444, 0xff5555, [-100, i, 5], [100, i, 5]);
      const line2 = this.getLine(0x444444, 0xff5555, [i, -100, 5], [i, 100, 5]);
      scene.add(line1);
      scene.add(line2);
    }

    var light = new AmbientLight(0x000000);

    scene.add(light);

    const render = () => {
      if (!this.renderer) {
        return;
      }
      this.camera.rotation.y += .05;
      this.camera.rotation.z += .05;
      this.camera.rotation.x += .05;
      this.renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();
  }

  render() {
    return (
      <div className="container" ref={ref => this.container = ref} />
    )
  }
}