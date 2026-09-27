import * as THREE from "three";

export interface EnvironmentController {
  islandGroup: THREE.Group;
  update: (time: number) => void;
}

/**
 * Creates a procedural retro-styled cobblestone canvas texture
 */
function createCobblestoneTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    const fallback = { width: 1, height: 1 } as unknown as HTMLCanvasElement;
    return new THREE.CanvasTexture(fallback);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Mortar / grout base
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const stoneColors = [
      "#64748b",
      "#475569",
      "#94a3b8",
      "#6b7280",
      "#4b5563",
      "#71717a",
      "#52525b",
    ];

    const rows = 16;
    const cols = 16;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let r = 0; r < rows; r++) {
      const offsetX = r % 2 === 0 ? 0 : cellW * 0.5;
      for (let c = -1; c <= cols; c++) {
        const x = c * cellW + offsetX + 3;
        const y = r * cellH + 3;
        const w = cellW - 6;
        const h = cellH - 6;

        const color = stoneColors[(r * 7 + c * 13 + 31) % stoneColors.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, [5]);
        ctx.fill();

        // Stone bevel highlight
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + h - 2);
        ctx.lineTo(x + 2, y + 2);
        ctx.lineTo(x + w - 2, y + 2);
        ctx.stroke();

        // Stone bevel shadow
        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w - 2, y + 2);
        ctx.lineTo(x + w - 2, y + h - 2);
        ctx.lineTo(x + 2, y + h - 2);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createEnvironment(scene: THREE.Scene): EnvironmentController {
  const envGroup = new THREE.Group();
  scene.add(envGroup);

  // Common Materials
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Dark rustic oak timber
    roughness: 0.7,
    flatShading: true,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.8,
    flatShading: true,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Grey stone blocks
    roughness: 0.85,
    flatShading: true,
  });

  const plasterMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a, // Warm medieval cream plaster
    roughness: 0.9,
    flatShading: true,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Deep terracotta / rustic red shingles
    roughness: 0.65,
    flatShading: true,
  });

  const goldBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.25,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    metalness: 0.85,
    roughness: 0.2,
    flatShading: true,
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    metalness: 0.6,
    roughness: 0.5,
  });

  const windowGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfbbf24,
    emissiveIntensity: 0.7,
    roughness: 0.2,
  });

  const fireMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
  });

  // 1. Cobblestone Plaza Ground
  const cobbleTex = createCobblestoneTexture();
  const groundGeo = new THREE.PlaneGeometry(32, 32);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    map: cobbleTex,
    roughness: 0.8,
    metalness: 0.1,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.position.y = 1.48; // Floor level right where character stands
  groundMesh.receiveShadow = true;
  envGroup.add(groundMesh);

  // Stone curbs & plaza borders
  for (let i = -1; i <= 1; i += 2) {
    const curbGeo = new THREE.BoxGeometry(0.35, 0.16, 20);
    const curb = new THREE.Mesh(curbGeo, stoneMat);
    curb.position.set(i * 5.2, 1.56, 0);
    curb.receiveShadow = true;
    envGroup.add(curb);
  }

  // 2. Tavern / Guild Facade positioned snug right behind the Merchant
  const guildGroup = new THREE.Group();
  guildGroup.position.set(0, 1.48, 0.35);

  // Stone Foundation Base
  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(11.5, 1.1, 2.2),
    stoneMat
  );
  foundation.position.set(0, 0.55, 0);
  foundation.receiveShadow = true;
  foundation.castShadow = true;
  guildGroup.add(foundation);

  // First Floor Plaster Body
  const firstFloor = new THREE.Mesh(
    new THREE.BoxGeometry(11.0, 2.0, 2.0),
    plasterMat
  );
  firstFloor.position.set(0, 2.1, 0);
  firstFloor.receiveShadow = true;
  firstFloor.castShadow = true;
  guildGroup.add(firstFloor);

  // Second Floor (Jetty Overhang)
  const secondFloor = new THREE.Mesh(
    new THREE.BoxGeometry(11.4, 1.9, 2.3),
    plasterMat
  );
  secondFloor.position.set(0, 4.05, 0.15);
  secondFloor.receiveShadow = true;
  secondFloor.castShadow = true;
  guildGroup.add(secondFloor);

  // Timber framing beams (horizontal & vertical struts)
  const addBeam = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    rotZ = 0
  ) => {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), darkWoodMat);
    beam.position.set(x, y, z);
    beam.rotation.z = rotZ;
    beam.castShadow = true;
    guildGroup.add(beam);
  };

  // Horizontal floor dividing beams
  addBeam(11.6, 0.18, 0.2, 0, 1.15, 1.05);
  addBeam(11.6, 0.22, 0.25, 0, 3.1, 1.25);
  addBeam(11.6, 0.22, 0.25, 0, 5.0, 1.25);

  // Vertical timber pillars
  for (const x of [-5.2, -3.2, -1.3, 1.3, 3.2, 5.2]) {
    addBeam(0.18, 2.0, 0.15, x, 2.1, 1.05);
    addBeam(0.18, 1.9, 0.18, x, 4.05, 1.32);
  }

  // Diagonal cross-bracing struts on upper floor
  addBeam(0.12, 1.4, 0.12, -2.25, 4.05, 1.33, 0.65);
  addBeam(0.12, 1.4, 0.12, -2.25, 4.05, 1.33, -0.65);
  addBeam(0.12, 1.4, 0.12, 2.25, 4.05, 1.33, 0.65);
  addBeam(0.12, 1.4, 0.12, 2.25, 4.05, 1.33, -0.65);

  // Medieval Peaked Roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(8.2, 2.6, 4),
    roofMat
  );
  roof.position.set(0, 6.3, 0.15);
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1.1, 1.0, 0.65);
  roof.castShadow = true;
  guildGroup.add(roof);

  // Grand Entrance Arched Wooden Door
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0, 1.1, 1.02);
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.12), darkWoodMat);
  doorGroup.add(door);

  // Door iron hinges & knocker
  for (const dy of [-0.6, 0.5]) {
    const hinge = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.16), ironMat);
    hinge.position.set(0, dy, 0);
    doorGroup.add(hinge);
  }
  const knocker = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.025, 8, 12),
    goldBrassMat
  );
  knocker.position.set(0.35, 0.1, 0.08);
  doorGroup.add(knocker);
  guildGroup.add(doorGroup);

  // Glowing Upper Floor Leaded Windows
  for (const wx of [-3.2, 0, 3.2]) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.1, 0.1),
      windowGlowMat
    );
    win.position.set(wx, 4.1, 1.3);
    guildGroup.add(win);

    // Window cross frame
    const hFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.12), darkWoodMat);
    hFrame.position.set(wx, 4.1, 1.32);
    const vFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.12, 0.12), darkWoodMat);
    vFrame.position.set(wx, 4.1, 1.32);
    guildGroup.add(hFrame, vFrame);
  }

  // Hanging Guild Tavern Sign
  const signGroup = new THREE.Group();
  signGroup.position.set(1.4, 2.7, 1.1);
  const signBracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.75),
    ironMat
  );
  signBracket.position.set(0, 0, 0.35);
  signGroup.add(signBracket);

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.65, 0.7),
    woodMat
  );
  signBoard.position.set(0, -0.36, 0.45);
  signBoard.castShadow = true;
  signGroup.add(signBoard);

  const emblem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.08, 8),
    goldBrassMat
  );
  emblem.rotation.z = Math.PI / 2;
  emblem.position.set(0, -0.36, 0.45);
  signGroup.add(emblem);
  guildGroup.add(signGroup);

  // Guild Chimney with rising smoke puffs
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 4.2, 0.85),
    stoneMat
  );
  chimney.position.set(-4.2, 4.8, 0);
  chimney.castShadow = true;
  guildGroup.add(chimney);

  const smokeCount = 7;
  const smokeParticles: THREE.Mesh[] = [];
  const smokeGeo = new THREE.DodecahedronGeometry(0.22, 1);
  const smokeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.9,
    transparent: true,
    opacity: 0.5,
    flatShading: true,
  });

  for (let i = 0; i < smokeCount; i++) {
    const sm = new THREE.Mesh(smokeGeo, smokeMat);
    sm.position.set(
      -4.2 + (Math.random() - 0.5) * 0.2,
      7.0 + i * 0.4,
      (Math.random() - 0.5) * 0.2
    );
    guildGroup.add(sm);
    smokeParticles.push(sm);
  }

  // Wall Torches with warm glow on either side of entrance
  const torches: { mesh: THREE.Mesh; light: THREE.PointLight }[] = [];
  for (const tx of [-1.5, 1.5]) {
    const bracket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6),
      ironMat
    );
    bracket.position.set(tx, 2.2, 1.15);
    bracket.rotation.x = Math.PI / 4;
    guildGroup.add(bracket);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.2, 6),
      fireMat
    );
    flame.position.set(tx, 2.38, 1.28);
    guildGroup.add(flame);

    const tLight = new THREE.PointLight(0xf59e0b, 1.4, 4.5);
    tLight.position.set(tx, 2.45, 1.35);
    guildGroup.add(tLight);

    torches.push({ mesh: flame, light: tLight });
  }

  envGroup.add(guildGroup);

  // 3. Quest Board (Tábua de Avisos de Missões) on the Right
  const questBoardGroup = new THREE.Group();
  questBoardGroup.position.set(2.8, 1.48, 1.35);
  questBoardGroup.rotation.y = -0.32;

  // Rustic Wooden Posts
  for (const px of [-0.9, 0.9]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 2.4, 8),
      darkWoodMat
    );
    post.position.set(px, 1.2, 0);
    post.castShadow = true;
    questBoardGroup.add(post);
  }

  // Backing Notice Board
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.9, 1.25, 0.08),
    woodMat
  );
  board.position.set(0, 1.45, 0);
  board.castShadow = true;
  questBoardGroup.add(board);

  // Little canopy roof on top of board
  const boardRoof = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.08, 0.45),
    darkWoodMat
  );
  boardRoof.position.set(0, 2.1, 0.08);
  boardRoof.rotation.x = 0.2;
  boardRoof.castShadow = true;
  questBoardGroup.add(boardRoof);

  // "QUESTS" Sign Banner
  const signBanner = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.22, 0.04),
    goldBrassMat
  );
  signBanner.position.set(0, 2.22, 0.1);
  questBoardGroup.add(signBanner);

  // Pinned Parchment Notes
  const parchmentMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.8,
  });
  const waxPinMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });

  const notesConfig = [
    { x: -0.5, y: 1.6, w: 0.42, h: 0.5, rot: 0.06 },
    { x: 0.1, y: 1.65, w: 0.48, h: 0.42, rot: -0.04 },
    { x: 0.55, y: 1.55, w: 0.38, h: 0.52, rot: 0.12 },
    { x: -0.3, y: 1.15, w: 0.46, h: 0.4, rot: -0.08 },
    { x: 0.35, y: 1.18, w: 0.44, h: 0.44, rot: 0.05 },
  ];

  notesConfig.forEach((cfg) => {
    const note = new THREE.Mesh(
      new THREE.BoxGeometry(cfg.w, cfg.h, 0.01),
      parchmentMat
    );
    note.position.set(cfg.x, cfg.y, 0.05);
    note.rotation.z = cfg.rot;
    questBoardGroup.add(note);

    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      waxPinMat
    );
    pin.position.set(cfg.x, cfg.y + cfg.h * 0.42, 0.06);
    questBoardGroup.add(pin);
  });

  envGroup.add(questBoardGroup);

  // 4. Weapon & Equipment Rack on the Left
  const rackGroup = new THREE.Group();
  rackGroup.position.set(-2.8, 1.48, 1.35);
  rackGroup.rotation.y = 0.32;

  // A-Frame Wooden Stand
  const rackBase1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 0.1),
    darkWoodMat
  );
  rackBase1.position.set(-0.8, 0.75, 0);
  rackBase1.rotation.z = -0.15;
  const rackBase2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 0.1),
    darkWoodMat
  );
  rackBase2.position.set(0.8, 0.75, 0);
  rackBase2.rotation.z = 0.15;

  const rackBarTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.08, 0.08),
    darkWoodMat
  );
  rackBarTop.position.set(0, 1.15, 0);

  const rackBarBottom = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.08, 0.08),
    darkWoodMat
  );
  rackBarBottom.position.set(0, 0.35, 0);

  rackGroup.add(rackBase1, rackBase2, rackBarTop, rackBarBottom);

  // Steel Longsword 1
  const createSword = (x: number, rotZ = 0) => {
    const sw = new THREE.Group();
    sw.position.set(x, 0.75, 0.06);
    sw.rotation.z = rotZ;

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.85, 0.02),
      steelMat
    );
    blade.castShadow = true;
    const crossguard = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.04, 0.05),
      goldBrassMat
    );
    crossguard.position.y = 0.42;
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.18, 6),
      darkWoodMat
    );
    grip.position.y = 0.52;
    const pommel = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 6, 6),
      goldBrassMat
    );
    pommel.position.y = 0.63;

    sw.add(blade, crossguard, grip, pommel);
    return sw;
  };

  rackGroup.add(createSword(-0.4, 0.05));
  rackGroup.add(createSword(-0.1, -0.04));

  // Round Knight Shield
  const shield = new THREE.Group();
  shield.position.set(0.42, 0.7, 0.1);
  const shieldFace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.04, 16),
    woodMat
  );
  shieldFace.rotation.x = Math.PI / 2;
  const shieldRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.03, 8, 16),
    ironMat
  );
  const shieldBoss = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 8, 8),
    goldBrassMat
  );
  shieldBoss.position.z = 0.03;
  shield.add(shieldFace, shieldRim, shieldBoss);
  shield.castShadow = true;
  rackGroup.add(shield);

  // Leaning Spear
  const spear = new THREE.Group();
  spear.position.set(0.85, 0.85, 0.08);
  spear.rotation.z = -0.22;
  const spearShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.8, 8),
    woodMat
  );
  const spearHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.28, 6),
    steelMat
  );
  spearHead.position.y = 0.95;
  spear.add(spearShaft, spearHead);
  rackGroup.add(spear);

  // Stacked Barrels & Crates nearby
  const crateMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    roughness: 0.7,
  });
  const barrelMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.6,
  });

  const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), crateMat);
  crate1.position.set(-1.1, 0.3, 0.35);
  crate1.castShadow = true;
  rackGroup.add(crate1);

  const barrel1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.7, 10),
    barrelMat
  );
  barrel1.position.set(-1.0, 0.35, -0.4);
  barrel1.castShadow = true;
  rackGroup.add(barrel1);

  envGroup.add(rackGroup);



  // 5. Medieval Street Lanterns on Plaza Edges
  const lanterns: { light: THREE.PointLight; flame: THREE.Mesh }[] = [];
  const createStreetLantern = (x: number, z: number) => {
    const lamp = new THREE.Group();
    lamp.position.set(x, 1.48, z);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.09, 2.8, 8),
      darkWoodMat
    );
    post.position.set(0, 1.4, 0);
    post.castShadow = true;
    lamp.add(post);

    const crossArm = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.08, 0.08),
      ironMat
    );
    crossArm.position.set(0.15, 2.7, 0);
    lamp.add(crossArm);

    // Iron Lantern Housing
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.35, 0.24),
      ironMat
    );
    box.position.set(0.38, 2.5, 0);
    lamp.add(box);

    const lFlame = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 6, 6),
      windowGlowMat
    );
    lFlame.position.set(0.38, 2.5, 0);
    lamp.add(lFlame);

    const pLight = new THREE.PointLight(0xfef08a, 1.1, 5.0);
    pLight.position.set(0.38, 2.5, 0);
    lamp.add(pLight);

    lanterns.push({ light: pLight, flame: lFlame });
    return lamp;
  };

  envGroup.add(createStreetLantern(-3.8, 2.2));
  envGroup.add(createStreetLantern(3.8, 2.2));

  // 6. Ambient Morning Dust Motes & Golden Dawn Sparkles
  const sparkleCount = 24;
  const sparkleGeo = new THREE.OctahedronGeometry(0.05, 0);
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const sparkles: THREE.Mesh[] = [];

  for (let i = 0; i < sparkleCount; i++) {
    const sp = new THREE.Mesh(sparkleGeo, sparkleMat);
    sp.position.set(
      (Math.random() - 0.5) * 8,
      1.6 + Math.random() * 3.0,
      (Math.random() - 0.5) * 3 + 1.6
    );
    sparkles.push(sp);
    scene.add(sp);
  }

  // Animation Loop Update
  const update = (time: number) => {
    // Gentle flicker for wall torches and lanterns
    torches.forEach((t, idx) => {
      const flicker = 1.0 + Math.sin(time * 12 + idx * 2.3) * 0.15;
      t.light.intensity = 1.4 * flicker;
      t.mesh.scale.set(flicker, flicker, flicker);
    });

    lanterns.forEach((l, idx) => {
      const flicker = 1.0 + Math.cos(time * 10 + idx * 1.9) * 0.1;
      l.light.intensity = 1.1 * flicker;
    });

    // Chimney smoke slowly rising and cycling
    smokeParticles.forEach((sm, idx) => {
      sm.position.y += 0.012;
      sm.position.x += Math.sin(time * 1.5 + idx) * 0.003;
      sm.scale.setScalar(1 + (sm.position.y - 7.0) * 0.25);
      if (sm.position.y > 9.2) {
        sm.position.y = 7.0;
        sm.position.x = -4.2 + (Math.random() - 0.5) * 0.15;
      }
    });

    // Floating dawn dust motes
    sparkles.forEach((sp, idx) => {
      sp.position.y += Math.sin(time * 1.5 + idx) * 0.002;
      sp.rotation.y += 0.02;
    });
  };

  return { islandGroup: envGroup, update };
}
