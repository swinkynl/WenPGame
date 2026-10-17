// Laadt een 3D-model (.glb) uit een ander programma, bijvoorbeeld Blender.
let loader = null;

export async function laadGLB(url) {
  if (!loader) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    loader = new GLTFLoader();
  }
  const gltf = await loader.loadAsync(url);
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return gltf.scene;
}
