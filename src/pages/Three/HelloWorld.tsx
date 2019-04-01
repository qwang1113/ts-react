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
} from 'three';
import BaseComponent from '@components/Base';

export default class HelloWorld extends BaseComponent {

  container: HTMLDivElement = null;

  renderer: WebGLRenderer;

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 100);
  }

  componentWillUnmount() {
    this.renderer.forceContextLoss();
    this.renderer = null;
  }

  getCube = () => {
    const geometry = new BoxGeometry(1, 1, 5);
    const material = new MeshBasicMaterial({ color: 0xff5555 });
    return new Mesh(geometry, material);
  }

  getLine = () => {
    const geometry = new Geometry();
    const material = new LineBasicMaterial({vertexColors: VertexColors});
    const color1 = new Color(0x444444);
    const color2 = new Color(0xff5555);
    const p1 = new Vector3(-1, 0, 1);
    const p2 = new Vector3(1, 0, -1);
    geometry.vertices.push(p1, p2);
    geometry.colors.push(color1, color2);
    return new Line(geometry, material);
  }

  init = () => {
    const { clientWidth, clientHeight } = this.container;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setClearColor(0xFFFFFF, 1);
    this.container.appendChild(this.renderer.domElement);
    camera.position.z = 5;
    const cube = this.getCube();
    const line = this.getLine();
    scene.add(cube);
    scene.add(line);
    const render = () => {
      if (!this.renderer) {
        return;
      }
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