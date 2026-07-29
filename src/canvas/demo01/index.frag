precision mediump float;

#include '/src/shaders/simplex-3d-noise.glsl'

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uFreq;
uniform float uRadius;
uniform float uAmp;
uniform float uSeed;

void main() {
  vec2 uv = vUv;
  vec2 pos = uv - vec2(0.5);

  float noiseFreq = uFreq;
  float displaceAmp = uAmp;

  float noiseX = snoise(vec3(uv * noiseFreq, uSeed));
  float noiseY = snoise(vec3(uv * noiseFreq + vec2(123.4, 567.8), uSeed));

  vec2 displaceVector = vec2(noiseX, noiseY) * displaceAmp;

  float edgeFreq = 20.;
  float edgeAmp = 0.01;
  float edgeX = snoise(vec3(uv * edgeFreq, uSeed));
  float edgeY = snoise(vec3(uv * edgeFreq + vec2(123.4, 567.8), uSeed));

  vec2 displacedUv = uv + displaceVector + vec2(edgeX, edgeY) * edgeAmp;

  float dist = length(displacedUv - vec2(0.5));

  float imageRadius = uRadius; // 画像の半径
  float borderWidth = 0.006; // 白いフチの幅
  float outerRadius = imageRadius + borderWidth; // フチの外側の半径

  float edgeSmoothing = 0.0001;

  // 画像領域のマスク（0 or 1に近い）
  float imageRegion = 1.0 - smoothstep(imageRadius - edgeSmoothing, imageRadius + edgeSmoothing, dist);

  // フチを含む全体のマスク（0 or 1に近い）
  float borderRegion = 1.0 - smoothstep(outerRadius - edgeSmoothing, outerRadius + edgeSmoothing, dist);

  // 全体の切り抜き（フチの外側を透明にする）
  float finalAlpha = borderRegion;

  // 透明領域は破棄
  if(finalAlpha < 0.01) discard;

  float edgeShadow = smoothstep(imageRadius - 0.015, imageRadius + 0.015, dist);
  edgeShadow *= imageRegion;
  edgeShadow *= 0.8; // フチの影の強さを調整

  vec4 texColor = texture(uTexture, uv);
  vec3 color = mix(vec3(1.0), texColor.rgb, imageRegion); // 白いフチを適用
  color *= 1.0 - edgeShadow;

  gl_FragColor = vec4(color, texColor.a * finalAlpha);
}