import * as THREE from "three";

export interface ScrollDefinition {
  key: string;
  title: string;
  sub: string;
  icon: string;
  accentColor: string;
}

export const SCROLL_DEFINITIONS: ScrollDefinition[] = [
  {
    key: "emotional_intelligence",
    title: "Inteligência Emocional",
    sub: "Autoconhecimento & Empatia",
    icon: "💖",
    accentColor: "#ec4899",
  },
  {
    key: "leadership_styles",
    title: "Estilos de Liderança",
    sub: "Condução & Visão de Equipe",
    icon: "👑",
    accentColor: "#eab308",
  },
  {
    key: "work_motivation",
    title: "Motivação no trabalho",
    sub: "Propósito & Energia Diária",
    icon: "🔥",
    accentColor: "#f97316",
  },
  {
    key: "creativity",
    title: "Criatividade",
    sub: "Inovação & Resolução Ágil",
    icon: "💡",
    accentColor: "#06b6d4",
  },
];

export interface CounterDeskController {
  group: THREE.Group;
  bell: THREE.Mesh;
  scrollTrigger: THREE.Object3D[];
  update: (time: number) => void;
}

/**
 * Creates the high-resolution canvas texture for the large central Grimoire / Open Scroll on the counter
 */
function createGrimoireCanvasTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    const fallbackCanvas = {
      width: 1,
      height: 1,
    } as unknown as HTMLCanvasElement;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Warm parchment gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#fffef7");
    grad.addColorStop(0.5, "#fef3c7");
    grad.addColorStop(1, "#fde68a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ornate double border
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    ctx.strokeStyle = "rgba(180, 83, 9, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

    // Main Title
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.font = "bold 44px system-ui, -apple-system, sans-serif";
    ctx.fillText("Os 4 Pergaminhos de Autoconhecimento", canvas.width / 2, 150);

    // Skill pills preview
    const skills = [
      { name: "Inteligência Emocional" },
      { name: "Estilos de Liderança" },
      { name: "Motivação no trabalho" },
      { name: "Criatividade" },
    ];

    const colW = 440;
    const startY = 220;
    const rowH = 95;

    skills.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 60 : canvas.width / 2 + 20;
      const y = startY + row * rowH;

      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.roundRect(x, y, colW, 76, [14]);
      ctx.fill();

      ctx.strokeStyle = "rgba(180, 83, 9, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 26px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(s.name, x + 20, y + 36);

      ctx.fillStyle = "#64748b";
      ctx.font = "500 20px system-ui, -apple-system, sans-serif";
      //ctx.fillText( x + 20, y + 62);
    });

    // Big Glowing Call-to-Action Bar
    ctx.fillStyle = "#b45309";
    ctx.beginPath();
    ctx.roundRect(80, 435, canvas.width - 160, 68, [18]);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("Iniciar Jornada", canvas.width / 2, 478);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createCounterDesk(): CounterDeskController {
  const deskGroup = new THREE.Group();
  deskGroup.position.set(0, 1.3, 2.5); // A mesa na frente do boneco

  // Materials
  const woodBaseMat = new THREE.MeshStandardMaterial({
    color: 0x92400e, // Warm teak wood
    roughness: 0.6,
    metalness: 0.1,
  });

  const slatMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Darker vertical wood slats
    roughness: 0.7,
  });

  const topWoodMat = new THREE.MeshStandardMaterial({
    color: 0xfde047, // Light polished birch countertop
    roughness: 0.3,
    metalness: 0.1,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Golden shiny brass
    metalness: 0.85,
    roughness: 0.2,
  });

  const scrollDowelMat = new THREE.MeshStandardMaterial({
    color: 0x5c2b09, // Dark polished mahogany rods
    roughness: 0.35,
  });

  const waxSealMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Royal red wax seal
    roughness: 0.3,
  });

  const potMat = new THREE.MeshStandardMaterial({
    color: 0xea580c,
    roughness: 0.8,
  });

  const plantMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.5,
  });

  // 1. Counter Body Base
  const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 0.7);
  const bodyMesh = new THREE.Mesh(bodyGeo, woodBaseMat);
  bodyMesh.position.y = 0.45;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  deskGroup.add(bodyMesh);

  // Front vertical decorative wood slats
  const slatCount = 7;
  for (let i = 0; i < slatCount; i++) {
    const slatGeo = new THREE.BoxGeometry(0.18, 0.78, 0.05);
    const slat = new THREE.Mesh(slatGeo, slatMat);
    const xPos = -0.9 + i * 0.3;
    slat.position.set(xPos, 0.45, 0.37);
    slat.castShadow = true;
    deskGroup.add(slat);
  }

  // 2. Counter Top (polished overhanging slab)
  const topGeo = new THREE.BoxGeometry(2.6, 0.1, 0.9);
  const topMesh = new THREE.Mesh(topGeo, topWoodMat);
  topMesh.position.set(0, 0.93, 0);
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  deskGroup.add(topMesh);

  // 3. Golden Desk Service Bell (Campainha de balcão)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(1.08, 0.98, -0.15);

  const bellBaseGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.04, 12);
  const bellBase = new THREE.Mesh(bellBaseGeo, brassMat);
  bellGroup.add(bellBase);

  const bellDomeGeo = new THREE.SphereGeometry(
    0.08,
    12,
    10,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.5
  );
  const bellDome = new THREE.Mesh(bellDomeGeo, brassMat);
  bellDome.position.y = 0.02;
  bellDome.castShadow = true;
  bellGroup.add(bellDome);

  const bellPinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 8);
  const bellPin = new THREE.Mesh(bellPinGeo, brassMat);
  bellPin.position.y = 0.09;
  bellGroup.add(bellPin);

  const bellButtonGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const bellButton = new THREE.Mesh(bellButtonGeo, brassMat);
  bellButton.position.y = 0.11;
  bellButton.userData = { isBell: true };
  bellGroup.add(bellButton);

  deskGroup.add(bellGroup);

  // 4. Adventurer Magic Potion Vial & Medieval Candle on Desk (left side)
  const potionGroup = new THREE.Group();
  potionGroup.position.set(-1.08, 0.98, -0.15);

  const potionMat = new THREE.MeshStandardMaterial({
    color: 0xec4899, // Glowing ruby health/elixir potion
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
  });
  const corkMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
  });

  const potionFlask = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 12),
    potionMat
  );
  potionFlask.position.y = 0.075;
  potionFlask.castShadow = true;
  potionGroup.add(potionFlask);

  const flaskNeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.03, 0.06, 8),
    potionMat
  );
  flaskNeck.position.y = 0.15;
  potionGroup.add(flaskNeck);

  const cork = new THREE.Mesh(
    new THREE.CylinderGeometry(0.024, 0.018, 0.035, 8),
    corkMat
  );
  cork.position.y = 0.18;
  potionGroup.add(cork);
  deskGroup.add(potionGroup);

  // Medieval Brass Candlestick
  const candleGroup = new THREE.Group();
  candleGroup.position.set(-0.88, 0.98, -0.18);

  const candleDish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.02, 10),
    brassMat
  );
  candleDish.position.y = 0.01;
  candleGroup.add(candleDish);

  const candleWax = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.11, 8),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 })
  );
  candleWax.position.y = 0.065;
  candleWax.castShadow = true;
  candleGroup.add(candleWax);

  const candleFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.018, 0.05, 6),
    new THREE.MeshBasicMaterial({ color: 0xf97316 })
  );
  candleFlame.position.y = 0.14;
  candleGroup.add(candleFlame);
  deskGroup.add(candleGroup);

  // 5. Large Central Grimoire / Open Scroll on the counter
  const grimoireGroup = new THREE.Group();
  const basePosY = 1.29;
  grimoireGroup.position.set(0, basePosY, 1.68);
  grimoireGroup.rotation.x = -0.38; // Tilted nicely towards the camera

  // Main Open Grimoire Slab
  const slabGeo = new THREE.BoxGeometry(1.42, 0.74, 0.02);
  const slabTex = createGrimoireCanvasTexture();
  const slabMat = new THREE.MeshStandardMaterial({
    map: slabTex,
    roughness: 0.6,
    metalness: 0.05,
  });
  const slabMesh = new THREE.Mesh(slabGeo, slabMat);
  slabMesh.castShadow = true;
  slabMesh.receiveShadow = true;
  slabMesh.userData = { isGrimoireTrigger: true };
  grimoireGroup.add(slabMesh);

  // Top wooden scroll dowel with gold end caps
  const dowelGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.48, 12);
  dowelGeo.rotateZ(Math.PI / 2);
  const topDowel = new THREE.Mesh(dowelGeo, scrollDowelMat);
  topDowel.position.set(0, 0.37, 0.015);
  topDowel.userData = { isGrimoireTrigger: true };
  grimoireGroup.add(topDowel);

  // Bottom wooden scroll dowel
  const bottomDowel = new THREE.Mesh(dowelGeo, scrollDowelMat);
  bottomDowel.position.set(0, -0.37, 0.015);
  bottomDowel.userData = { isGrimoireTrigger: true };
  grimoireGroup.add(bottomDowel);

  // Golden Finials on dowels
  for (const xOff of [-0.75, 0.75]) {
    const tipGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const topTip = new THREE.Mesh(tipGeo, brassMat);
    topTip.position.set(xOff, 0.37, 0.015);
    const bottomTip = new THREE.Mesh(tipGeo, brassMat);
    bottomTip.position.set(xOff, -0.37, 0.015);
    grimoireGroup.add(topTip, bottomTip);
  }

  // Royal Wax Seal medallion at top center
  const sealGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 14);
  sealGeo.rotateX(Math.PI / 2);
  const sealMesh = new THREE.Mesh(sealGeo, waxSealMat);
  sealMesh.position.set(0, 0.37, 0.03);
  sealMesh.userData = { isGrimoireTrigger: true };
  grimoireGroup.add(sealMesh);

  deskGroup.add(grimoireGroup);

  const scrollTrigger: THREE.Object3D[] = [
    slabMesh,
    topDowel,
    bottomDowel,
    sealMesh,
  ];

  // Gentle breathing float animation
  const update = (time: number) => {
    grimoireGroup.position.y = basePosY + Math.sin(time * 2.2) * 0.012;
  };

  return {
    group: deskGroup,
    bell: bellButton,
    scrollTrigger,
    update,
  };
}
