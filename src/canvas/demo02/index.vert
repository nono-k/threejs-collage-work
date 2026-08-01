in float aSeed;
in float aTexIndex;

out vec2 vUv;
out float vSeed;
out float vTexIndex;

void main() {
  vUv = uv;
  vSeed = aSeed;
  vTexIndex = aTexIndex;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}