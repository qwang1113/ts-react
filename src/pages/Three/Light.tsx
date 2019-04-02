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
  Light,
  DirectionalLight,
  MeshLambertMaterial,
  PointLight,
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
    // camera.position.set(5, 0, 2)
    // // camera.up.set(0, 0, 0);
    // camera.lookAt(0, 0, 0);
    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 2;
    camera.lookAt(0, 0, 0);
    this.camera = camera;
    return camera;
  }

  getMesh = () => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshLambertMaterial({ color: 0xffffff });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    // mesh.rotation.set(2, 2, 0);
    return mesh;
  }

  init = () => {
    const { clientWidth, clientHeight } = this.container;
    const scene = new Scene();
    const camera = this.getCamera();
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(clientWidth, clientHeight);
    // this.renderer.setClearColor(0xFFFFFF, 1);
    this.container.appendChild(this.renderer.domElement);

    const mesh = this.getMesh();
    const light = new DirectionalLight(0xf40928, 1);
    light.position.set(0, 0, 1);

    const aLight = new AmbientLight(0x09d2f4);
    aLight.position.set(0, 0, 0);

    const pLight = new PointLight(0x57f409, .2);
    pLight.position.set(2, 0, 50);
    scene.add(pLight);
    scene.add(aLight);
    scene.add(light);
    scene.add(mesh);

    const render = () => {
      if (!this.renderer) {
        return;
      }
      mesh.rotation.x += .01;
      mesh.rotation.y += .01;
      mesh.rotation.z += .01;
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