precision mediump float;

#include '/src/shaders/simplex-3d-noise.glsl'

in vec2 vUv;
in float vSeed;      // インスタンスごとのシード値
in float vTexIndex;  // インスタンスごとのテクスチャ番号

uniform sampler2D uTextures[16]; // テクスチャ配列（枚数に合わせてサイズ変更）
uniform float uFreq;
uniform float uRadius;
uniform float uAmp;

// --- テクスチャ番号に応じてサンプリングを分岐する関数 ---
vec4 sampleTexture(float index, vec2 uv) {
  int id = int(index + 0.5);
  if (id == 0) return texture(uTextures[0], uv);
  if (id == 1) return texture(uTextures[1], uv);
  if (id == 2) return texture(uTextures[2], uv);
  if (id == 3) return texture(uTextures[3], uv);
  if (id == 4) return texture(uTextures[4], uv);
  if (id == 5) return texture(uTextures[5], uv);
  if (id == 6) return texture(uTextures[6], uv);
  if (id == 7) return texture(uTextures[7], uv);
  if (id == 8) return texture(uTextures[8], uv);
  if (id == 9) return texture(uTextures[9], uv);
  if (id == 10) return texture(uTextures[10], uv);
  if (id == 11) return texture(uTextures[11], uv);
  if (id == 12) return texture(uTextures[12], uv);
  if (id == 13) return texture(uTextures[13], uv);
  if (id == 14) return texture(uTextures[14], uv);
  if (id == 15) return texture(uTextures[15], uv);
  return texture(uTextures[0], uv); // デフォルトは最初のテクスチャ
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uv - vec2(0.5);

  float noiseFreq = uFreq;
  float displaceAmp = uAmp;

  // vSeed を使って個別のノイズを生成
  float noiseX = snoise(vec3(uv * noiseFreq, vSeed));
  float noiseY = snoise(vec3(uv * noiseFreq + vec2(123.4, 567.8), vSeed));
  vec2 displaceVector = vec2(noiseX, noiseY) * displaceAmp;

  float edgeFreq = 20.0;
  float edgeAmp = 0.01;
  float edgeX = snoise(vec3(uv * edgeFreq, vSeed));
  float edgeY = snoise(vec3(uv * edgeFreq + vec2(123.4, 567.8), vSeed));

  vec2 displacedUv = uv + displaceVector + vec2(edgeX, edgeY) * edgeAmp;
  float dist = length(displacedUv - vec2(0.5));

  float imageRadius = uRadius;
  float borderWidth = 0.01;
  float outerRadius = imageRadius + borderWidth;
  float edgeSmoothing = 0.0001;

  float imageRegion = 1.0 - smoothstep(imageRadius - edgeSmoothing, imageRadius + edgeSmoothing, dist);
  float borderRegion = 1.0 - smoothstep(outerRadius - edgeSmoothing, outerRadius + edgeSmoothing, dist);

  if (borderRegion < 0.01) discard;

  float edgeShadow = smoothstep(imageRadius - 0.015, imageRadius + 0.015, dist);
  edgeShadow *= imageRegion;
  edgeShadow *= 0.4; // フチの影の強さを調整

  vec4 texColor = sampleTexture(vTexIndex, uv);
  vec3 color = mix(vec3(1.0), texColor.rgb, imageRegion); // 白いフチを適用
  color *= 1.0 - edgeShadow;

  gl_FragColor = vec4(color, texColor.a * borderRegion);
}