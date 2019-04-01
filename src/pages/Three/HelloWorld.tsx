import * as React from 'react';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three';
import BaseComponent from '@components/Base';

export default class HelloWorld extends BaseComponent {

  container: HTMLDivElement = null;

  componentDidMount() {
    setTimeout(() => {
      this.init();
    }, 100);
  }

  init = () => {
    const { clientWidth, clientHeight } = this.container;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, clientWidth / (clientHeight - 5), 0.1, 1000);
    const renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setSize(clientWidth, (clientHeight - 5));
    this.container.appendChild(renderer.domElement);
    var geometry = new BoxGeometry(1, 1, 1);
    var material = new MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new Mesh(geometry, material);
    camera.position.z = 5;
    scene.add(cube);
    function render() {
      cube.rotation.x += .01;
      cube.rotation.y += .01;
      renderer.render(scene, camera);
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