import * as THREE from 'three';
import image from '@/assets/images/image01.jpg';
import { OrthographicCamera } from '@/script/core/Camera';
import { Three } from '@/script/core/Three';
import { Gui } from '@/script/Gui';
import fragment from './index.frag';
import vertex from './index.vert';

class APP extends Three {
  private readonly camera: OrthographicCamera;
  private texture: THREE.Texture | null = null;
  private mesh!: THREE.Mesh;

  constructor() {
    const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
    super(canvas);

    this.camera = new OrthographicCamera({ left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 });
    this.camera.position.z = 1;

    this.init();

    window.addEventListener('resize', this.resize.bind(this));
    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private async init() {
    await this.loadTexture();
    this.createGeometry();
    this.resize();

    this.setGui();
  }

  private async loadTexture() {
    const loader = new THREE.TextureLoader();
    this.texture = await loader.loadAsync(image.src);
  }

  private createGeometry() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uTexture: { value: this.texture },
        uFreq: { value: 2.5 },
        uRadius: { value: 0.4 },
        uAmp: { value: 0.1 },
        uSeed: { value: 0.0 },
      },
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
  }

  private setGui() {
    const PARAMS = {
      Freq: 2.5,
      Radius: 0.4,
      Amp: 0.1,
      Seed: 0.0,
    };

    const pane = new Gui();
    pane.addBinding(PARAMS, 'Freq', { min: 1, max: 10, step: 0.1 });
    pane.addBinding(PARAMS, 'Radius', { min: 0, max: 1, step: 0.01 });
    pane.addBinding(PARAMS, 'Amp', { min: 0, max: 0.2, step: 0.01 });
    pane.addBinding(PARAMS, 'Seed', { min: 0, max: 100, step: 1 });

    pane.on('change', () => {
      const material = this.mesh.material as THREE.ShaderMaterial;
      material.uniforms.uFreq.value = PARAMS.Freq;
      material.uniforms.uRadius.value = PARAMS.Radius;
      material.uniforms.uAmp.value = PARAMS.Amp;
      material.uniforms.uSeed.value = PARAMS.Seed;
    });
  }

  private animate() {
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    this.camera.update();
  }
}

export const onload = () => {
  new APP();
};
