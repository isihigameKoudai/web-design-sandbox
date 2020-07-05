(() => {
  const width = 960;
  const height = 540;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas')
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンの追加
  const scene = new THREE.Scene();

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +1000);

  // 箱の作成
  // const geometry = new THREE.BoxGeometry(400, 400, 400);
  // const material = new THREE.MeshNormalMaterial();
  // const box = new THREE.Mesh(geometry, material);
  // scene.add(box);

  // 球の設定
  const geometory = new THREE.SphereGeometry(300, 30, 30);
  // 地球儀の作成
  const texture = new THREE.TextureLoader().load('./img/earthmap1k.jpg');
  const material = new THREE.MeshStandardMaterial({ color: '#ffee00', map: texture });
  const mesh = new THREE.Mesh(geometory, material);
  scene.add(mesh);

  let lightX = 1;
  let lightY = 1;
  let lightZ = 1;
  const $rangeX = document.querySelector('.light-x');
  const $rangeY = document.querySelector('.light-y');
  const $rangeZ = document.querySelector('.light-z');
  $rangeX.addEventListener('input', e => {
    lightX = e.target.value;
  });

  $rangeY.addEventListener('input', e => {
    lightY = e.target.value;
  });

  $rangeZ.addEventListener('input', e => {
    lightZ = e.target.value;
  });

  // 平行光源の設定
  // THREE.DirectionalLight 平行光源
  // THREE.AmbientLight 環境光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(lightX, lightY, lightZ);

  scene.add(directionalLight);

  const render = () => {
    // box.rotation.y += 0.01;
    mesh.rotation.y += 0.01;
    directionalLight.position.x = lightX;
    directionalLight.position.y = lightY;
    directionalLight.position.z = lightZ;
    // mesh.rotation.y += 0.01;
    renderer.render(scene, camera); // レンダリング

    requestAnimationFrame(render);
  };

  render();
})()
