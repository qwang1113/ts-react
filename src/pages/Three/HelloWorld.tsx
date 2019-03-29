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

  container: any = null;

  componentDidMount() {
    this.init(this.container);
  }

  init = (current) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    current.appendChild(renderer.domElement);
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
      <div ref={ref => this.container = ref} />
    )
  }
}