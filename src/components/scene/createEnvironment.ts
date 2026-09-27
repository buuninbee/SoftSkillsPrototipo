import * as THREE from "three";

export interface EnvironmentController {
  islandGroup: THREE.Group;
  update: (time: number) => void;
}

export function createEnvironment(scene: THREE.Scene): EnvironmentController {
  const islandGroup = new THREE.Group();
  scene.add(islandGroup);

  // Materials
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Vibrant turquoise ocean
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
    flatShading: true,
  });

  const foamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.65,
  });

  const sandMat = new THREE.MeshStandardMaterial({
    color: 0xfde047, // Golden sunny beach sand
    roughness: 0.8,
    flatShading: true,
  });

  const grassMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80, // Lush tropical grass
    roughness: 0.7,
    flatShading: true,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.6,
    flatShading: true,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.7,
    flatShading: true,
  });

  const palmLeafMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.4,
    flatShading: true,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.8,
    flatShading: true,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
  });

  const yellowLightMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.35,
  });

  // 1. Water surface (wave animated plane)
  const waterGeo = new THREE.PlaneGeometry(40, 40, 32, 32);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = -0.05;
  scene.add(waterMesh);

  // Foam ring around island
  const foamGeo = new THREE.RingGeometry(4.8, 5.8, 32);
  foamGeo.rotateX(-Math.PI / 2);
  const foamMesh = new THREE.Mesh(foamGeo, foamMat);
  foamMesh.position.y = 0.02;
  scene.add(foamMesh);

  // 2. Island Base (Sand cylinder)
  const sandGeo = new THREE.CylinderGeometry(5.0, 6.0, 1.4, 24);
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.position.y = 0.6;
  sandMesh.receiveShadow = true;
  islandGroup.add(sandMesh);

  // Grass plateau (terrace)
  const grassGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.45, 24);
  const grassMesh = new THREE.Mesh(grassGeo, grassMat);
  grassMesh.position.y = 1.4;
  grassMesh.receiveShadow = true;
  islandGroup.add(grassMesh);

  // Secondary elevated hill
  const hillGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.6, 18);
  const hillMesh = new THREE.Mesh(hillGeo, grassMat);
  hillMesh.position.set(-1.8, 1.85, -1.2);
  hillMesh.receiveShadow = true;
  islandGroup.add(hillMesh);

  // Wooden dock / pier extending towards front
  const dockGroup = new THREE.Group();
  dockGroup.position.set(0, 0.9, 4.4);
  for (let i = 0; i < 4; i++) {
    const plankGeo = new THREE.BoxGeometry(1.6, 0.12, 0.35);
    const plank = new THREE.Mesh(plankGeo, woodMat);
    plank.position.set(0, 0.06, i * 0.4);
    plank.castShadow = true;
    plank.receiveShadow = true;
    dockGroup.add(plank);
  }
  islandGroup.add(dockGroup);

  // 3. Lighthouse on the hill
  const lighthouseGroup = new THREE.Group();
  lighthouseGroup.position.set(-2.2, 2.15, -1.3);

  const lhBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.8, 0.3, 12),
    stoneMat
  );
  lighthouseGroup.add(lhBase);

  const tower1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.65, 0.6, 12),
    redMat
  );
  tower1.position.y = 0.45;
  const tower2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.55, 0.6, 12),
    whiteMat
  );
  tower2.position.y = 1.05;
  const tower3 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.48, 0.6, 12),
    redMat
  );
  tower3.position.y = 1.65;
  const tower4 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.42, 0.5, 12),
    whiteMat
  );
  tower4.position.y = 2.15;
  lighthouseGroup.add(tower1, tower2, tower3, tower4);

  const balcony = new THREE.Mesh(
    new THREE.CylinderGeometry(0.46, 0.46, 0.08, 12),
    darkWoodMat
  );
  balcony.position.y = 2.45;
  const lantern = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.35, 8),
    yellowLightMat
  );
  lantern.position.y = 2.65;
  const lhRoof = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.4, 12), redMat);
  lhRoof.position.y = 2.95;
  lighthouseGroup.add(balcony, lantern, lhRoof);

  // Rotating light beam
  const lightBeamGeo = new THREE.ConeGeometry(1.6, 6, 12);
  lightBeamGeo.rotateX(Math.PI / 2);
  lightBeamGeo.translate(0, 0, 3);
  const lightBeam = new THREE.Mesh(lightBeamGeo, yellowLightMat);
  lightBeam.position.y = 2.65;
  lighthouseGroup.add(lightBeam);

  islandGroup.add(lighthouseGroup);

  // 4. Palm Trees
  const createPalmTree = (x: number, z: number, scale = 1, rotationY = 0) => {
    const tree = new THREE.Group();
    tree.position.set(x, 1.45, z);
    tree.scale.set(scale, scale, scale);
    tree.rotation.y = rotationY;

    let prevY = 0;
    let prevX = 0;
    for (let i = 0; i < 5; i++) {
      const segGeo = new THREE.CylinderGeometry(
        0.12 - i * 0.012,
        0.14 - i * 0.012,
        0.45,
        7
      );
      const seg = new THREE.Mesh(segGeo, woodMat);
      seg.castShadow = true;
      const lean = (i + 1) * 0.06;
      seg.position.set(prevX + lean * 0.15, prevY + 0.22, 0);
      seg.rotation.z = -lean * 0.4;
      tree.add(seg);
      prevY += 0.4;
      prevX += lean * 0.15;
    }

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leafGeo = new THREE.ConeGeometry(0.35, 1.6, 4);
      leafGeo.rotateX(Math.PI / 2.6);
      const leaf = new THREE.Mesh(leafGeo, palmLeafMat);
      leaf.position.set(prevX, prevY + 0.1, 0);
      leaf.rotation.y = angle;
      leaf.rotation.z = -0.3;
      leaf.castShadow = true;
      tree.add(leaf);
    }

    const coconutGeo = new THREE.SphereGeometry(0.09, 6, 6);
    const coco1 = new THREE.Mesh(coconutGeo, darkWoodMat);
    coco1.position.set(prevX + 0.08, prevY - 0.02, 0.06);
    const coco2 = new THREE.Mesh(coconutGeo, darkWoodMat);
    coco2.position.set(prevX - 0.08, prevY - 0.02, -0.06);
    tree.add(coco1, coco2);

    return tree;
  };

  islandGroup.add(createPalmTree(2.6, -0.6, 1.1, 0.3));
  islandGroup.add(createPalmTree(3.0, 1.5, 0.9, 1.2));
  islandGroup.add(createPalmTree(-2.8, 1.8, 0.85, 2.1));
  islandGroup.add(createPalmTree(-3.4, -0.4, 0.95, -0.8));

  // Rocks
  const rockGeo = new THREE.DodecahedronGeometry(0.28, 0);
  const rocks = [
    { x: 2.1, y: 1.45, z: 2.2, s: 0.8 },
    { x: -1.6, y: 1.45, z: 2.8, s: 1.1 },
    { x: 3.5, y: 0.7, z: -2.0, s: 1.3 },
  ];
  rocks.forEach((r) => {
    const rock = new THREE.Mesh(rockGeo, stoneMat);
    rock.position.set(r.x, r.y, r.z);
    rock.scale.set(r.s, r.s * 0.7, r.s);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    islandGroup.add(rock);
  });

  // 5. Stylized Clouds
  const cloudsGroup = new THREE.Group();
  scene.add(cloudsGroup);

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    flatShading: true,
  });

  const createCloud = (x: number, y: number, z: number, scale = 1) => {
    const c = new THREE.Group();
    c.position.set(x, y, z);
    c.scale.set(scale, scale, scale);

    const sphereGeo = new THREE.DodecahedronGeometry(0.8, 1);
    const p1 = new THREE.Mesh(sphereGeo, cloudMat);
    const p2 = new THREE.Mesh(sphereGeo, cloudMat);
    p2.position.set(0.7, -0.1, 0);
    p2.scale.set(0.75, 0.75, 0.75);
    const p3 = new THREE.Mesh(sphereGeo, cloudMat);
    p3.position.set(-0.7, -0.15, 0);
    p3.scale.set(0.7, 0.7, 0.7);
    const p4 = new THREE.Mesh(sphereGeo, cloudMat);
    p4.position.set(0.2, 0.45, 0.1);
    p4.scale.set(0.65, 0.65, 0.65);

    c.add(p1, p2, p3, p4);
    return c;
  };

  const cloud1 = createCloud(-7, 6.5, -4, 1.2);
  const cloud2 = createCloud(8, 7.8, -6, 1.5);
  const cloud3 = createCloud(6, 5.8, 5, 0.9);
  const cloud4 = createCloud(-8, 6.2, 4, 1.1);
  cloudsGroup.add(cloud1, cloud2, cloud3, cloud4);

  // 6. Floating Sparkles
  const sparkleCount = 20;
  const sparkleGeo = new THREE.OctahedronGeometry(0.08, 0);
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const sparkles: THREE.Mesh[] = [];

  for (let i = 0; i < sparkleCount; i++) {
    const sp = new THREE.Mesh(sparkleGeo, sparkleMat);
    sp.position.set(
      (Math.random() - 0.5) * 8,
      1.5 + Math.random() * 3.5,
      (Math.random() - 0.5) * 8
    );
    sparkles.push(sp);
    scene.add(sp);
  }

  // Update animation loop
  const update = (time: number) => {
    lightBeam.rotation.z += 0.025;

    // Gentle wave undulation
    const pos = waterGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z =
        Math.sin(time * 1.8 + u * 0.6) * 0.06 +
        Math.cos(time * 1.4 + v * 0.6) * 0.06;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    foamMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.02);

    cloud1.position.x = -7 + Math.sin(time * 0.2) * 1.2;
    cloud2.position.x = 8 + Math.cos(time * 0.15) * 1.4;
    cloud3.position.x = 6 + Math.sin(time * 0.25) * 1.0;
    cloud4.position.x = -8 + Math.cos(time * 0.18) * 1.1;

    sparkles.forEach((sp, idx) => {
      sp.position.y += Math.sin(time * 2 + idx) * 0.003;
      sp.rotation.y += 0.02;
    });
  };

  return { islandGroup, update };
}
