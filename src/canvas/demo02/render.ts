import * as THREE from 'three';
import image01 from '@/assets/images/image01.jpg';
import image02 from '@/assets/images/image02.jpg';
import image03 from '@/assets/images/image03.jpg';
import image04 from '@/assets/images/image04.jpg';
import image05 from '@/assets/images/image05.jpg';
import image06 from '@/assets/images/image06.jpg';
import image07 from '@/assets/images/image07.jpg';
import image08 from '@/assets/images/image08.jpg';
import image09 from '@/assets/images/image09.jpg';
import image10 from '@/assets/images/image10.jpg';
import image11 from '@/assets/images/image11.jpg';
import image12 from '@/assets/images/image12.jpg';
import image13 from '@/assets/images/image13.jpg';
import image14 from '@/assets/images/image14.jpg';
import image15 from '@/assets/images/image15.jpg';
import image16 from '@/assets/images/image16.jpg';
import { OrthographicCamera } from '@/script/core/Camera';
import { Three } from '@/script/core/Three';
import { Gui } from '@/script/Gui';
import fragment from './index.frag';
import vertex from './index.vert';

class APP extends Three {
  private readonly camera: OrthographicCamera;
  private textures: THREE.Texture[] = [];
  private mesh!: THREE.InstancedMesh;

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

    // this.setGui();
  }

  private async loadTexture() {
    const loader = new THREE.TextureLoader();
    this.textures = await Promise.all([
      loader.loadAsync(image01.src),
      loader.loadAsync(image02.src),
      loader.loadAsync(image03.src),
      loader.loadAsync(image04.src),
      loader.loadAsync(image05.src),
      loader.loadAsync(image06.src),
      loader.loadAsync(image07.src),
      loader.loadAsync(image08.src),
      loader.loadAsync(image09.src),
      loader.loadAsync(image10.src),
      loader.loadAsync(image11.src),
      loader.loadAsync(image12.src),
      loader.loadAsync(image13.src),
      loader.loadAsync(image14.src),
      loader.loadAsync(image15.src),
      loader.loadAsync(image16.src),
    ]);
  }

  private createGeometry() {
    const geometry = new THREE.PlaneGeometry(2, 2);

    const count = this.textures.length;
    const seeds = new Float32Array(count);
    const texIndices = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      texIndices[i] = i % this.textures.length;
    }

    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    geometry.setAttribute('aTexIndex', new THREE.InstancedBufferAttribute(texIndices, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      uniforms: {
        uTextures: { value: this.textures },
        uFreq: { value: 2.5 },
        uRadius: { value: 0.4 },
        uAmp: { value: 0.1 },
      },
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, count);

    const aspect = window.innerWidth / window.innerHeight;
    const width = aspect * 2;
    const height = 2;

    const positions: THREE.Vector2[] = [];
    const minDistance = 0.35; // 被らない最小距離（オブジェクトのサイズに応じて調整）
    const maxAttempts = 100; // 再試行の上限回数

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      let px = 0;
      let py = 0;
      let valid = false;

      // 被らない位置が見つかるまでループ
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        px = (Math.random() - 0.5) * width;
        py = (Math.random() - 0.5) * (height * 0.8);

        // 既存のすべての点と minDistance 以上離れているか確認
        const isTooClose = positions.some(p => p.distanceTo(new THREE.Vector2(px, py)) < minDistance);

        if (!isTooClose) {
          valid = true;
          break;
        }
      }

      positions.push(new THREE.Vector2(px, py));

      dummy.position.set(px, py, 0);
      dummy.rotation.z = Math.random() * Math.PI * 0.3;
      dummy.scale.setScalar(0.22 + Math.random() * 0.4);
      dummy.updateMatrix();

      this.mesh.setMatrixAt(i, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.mesh);
  }

  private setGui() {
    const PARAMS = {
      Freq: 2.5,
      Radius: 0.4,
      Amp: 0.1,
    };

    const pane = new Gui();
    pane.addBinding(PARAMS, 'Freq', { min: 1, max: 10, step: 0.1 });
    pane.addBinding(PARAMS, 'Radius', { min: 0, max: 1, step: 0.01 });
    pane.addBinding(PARAMS, 'Amp', { min: 0, max: 0.2, step: 0.01 });

    pane.on('change', () => {
      const material = this.mesh.material as THREE.ShaderMaterial;
      material.uniforms.uFreq.value = PARAMS.Freq;
      material.uniforms.uRadius.value = PARAMS.Radius;
      material.uniforms.uAmp.value = PARAMS.Amp;
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
