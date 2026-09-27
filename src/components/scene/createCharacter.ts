import * as THREE from "three";
import { CharacterReaction } from "@/data/dialogueData";

export interface CharacterController {
  group: THREE.Group;
  clickableObjects: THREE.Object3D[];
  update: (
    time: number,
    reaction: CharacterReaction,
    reactionElapsed: number,
    mouse: { x: number; y: number }
  ) => void;
}

/**
 * Creates the high-resolution dynamic speech balloon texture for the RPG Merchant
 * Centered design with bottom-center tail pointing directly to the merchant
 */
function createSpeechBubbleTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    const fallbackCanvas = {
      width: 1,
      height: 1,
    } as unknown as HTMLCanvasElement;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bx = 30;
    const by = 20;
    const bw = canvas.width - 60;
    const bh = 430;
    const r = 44;

    // Outer shadow
    ctx.shadowColor = "rgba(15, 23, 42, 0.3)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;

    // Draw main bubble path with centered bottom tail
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);

    // Centered bottom tail pointing down to merchant
    const centerX = canvas.width / 2;
    ctx.lineTo(centerX + 45, by + bh);
    ctx.lineTo(centerX, by + bh + 85);
    ctx.lineTo(centerX - 45, by + bh);

    ctx.lineTo(bx + r, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();

    // Warm parchment cream gradient
    const grad = ctx.createLinearGradient(0, by, 0, by + bh);
    grad.addColorStop(0, "#fffef9");
    grad.addColorStop(0.5, "#fffdf0");
    grad.addColorStop(1, "#fef3c7");
    ctx.fillStyle = grad;
    ctx.fill();

    // Reset shadow for crisp border and text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Rich leather/golden outer border
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 10;
    ctx.stroke();

    // Inner subtle filigree border
    ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(bx + 18, by + 18, bw - 36, bh - 36);

    // Top badge / tag
    ctx.fillStyle = "#b45309";
    ctx.font = "bold 30px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MERCADOR DE HABILIDADES", canvas.width / 2, by + 76);

    // Main catchy title (large and bold)
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 52px system-ui, -apple-system, sans-serif";
    ctx.fillText("Ei, viajante!", canvas.width / 2, by + 162);
    ctx.fillText(
      "Qual é seu verdadeiro poder oculto?",
      canvas.width / 2,
      by + 222
    );

    // Subtitle inviting player to discover style
    ctx.fillStyle = "#4338ca";
    ctx.font = "600 38px system-ui, -apple-system, sans-serif";
    ctx.fillText(
      "Escolha um pergaminho no balcão e",
      canvas.width / 2,
      by + 296
    );
    ctx.fillText(
      " venha descobrir seu estilo único agora mesmo!",
      canvas.width / 2,
      by + 346
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function createCharacter(): CharacterController {
  const characterGroup = new THREE.Group();
  // Placed right behind the counter desk at stable floor level
  characterGroup.position.set(0, 1.48, 1.8);

  // 1. Materials for Cartoon RPG Merchant
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xffdfba, // Warm cartoon anime peachy skin
    roughness: 0.45,
    metalness: 0.05,
  });

  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeIrisMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Amber golden cartoon anime iris
    roughness: 0.2,
  });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const blushMat = new THREE.MeshBasicMaterial({
    color: 0xf472b6, // Rosy cartoon cheeks
    transparent: true,
    opacity: 0.55,
  });

  const browMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x451a03, // Chestnut adventurer hair
    roughness: 0.6,
  });

  // Clothing Materials
  const tunicMat = new THREE.MeshStandardMaterial({
    color: 0xfaf5ef, // Natural linen tunic
    roughness: 0.7,
  });

  const vestMat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Rich leather adventurer vest
    roughness: 0.55,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark traveler trousers
    roughness: 0.65,
  });

  const beretMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Adventurer forest-green felt beret
    roughness: 0.5,
  });

  const featherMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Golden adventurer quill feather
    roughness: 0.35,
  });

  const goldBuckleMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.2,
  });

  const leatherPouchMat = new THREE.MeshStandardMaterial({
    color: 0xa16207, // Soft saddle leather coin bag
    roughness: 0.6,
  });

  const potionGlassMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan magical glowing elixir
    emissive: 0x0891b2,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });

  const corkMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.8,
  });

  const backpackMat = new THREE.MeshStandardMaterial({
    color: 0x582509, // Heavy duty traveler rucksack
    roughness: 0.65,
  });

  const bedrollMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Rolled travel sleeping mat
    roughness: 0.75,
  });


  // 2. Legs (standing stably behind counter)
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.5, 8);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.16, 0.25, 0);
  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.16, 0.25, 0);
  characterGroup.add(leftLeg, rightLeg);

  // 3. Torso: Linen Tunic + Leather Adventurer Vest
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.65, 0);
  characterGroup.add(torsoGroup);

  // Base tunic cylinder
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 14);
  const torso = new THREE.Mesh(torsoGeo, tunicMat);
  torso.castShadow = true;
  torsoGroup.add(torso);

  // Leather Vest over tunic
  const vestGeo = new THREE.CylinderGeometry(0.255, 0.292, 0.46, 14);
  const vest = new THREE.Mesh(vestGeo, vestMat);
  vest.position.set(0, 0.02, 0);
  vest.castShadow = true;
  torsoGroup.add(vest);

  // Vest gold buttons
  for (let i = 0; i < 3; i++) {
    const btnGeo = new THREE.SphereGeometry(0.022, 8, 8);
    const btn = new THREE.Mesh(btnGeo, goldBuckleMat);
    btn.position.set(0.04, 0.12 - i * 0.1, 0.265);
    torsoGroup.add(btn);
  }

  // Utility Belt around waist
  const beltGeo = new THREE.CylinderGeometry(0.29, 0.295, 0.08, 14);
  const belt = new THREE.Mesh(beltGeo, hairMat);
  belt.position.set(0, -0.21, 0);
  torsoGroup.add(belt);

  // Golden Belt Buckle
  const buckleGeo = new THREE.BoxGeometry(0.09, 0.08, 0.03);
  const buckle = new THREE.Mesh(buckleGeo, goldBuckleMat);
  buckle.position.set(0, -0.21, 0.295);
  torsoGroup.add(buckle);

  // Hanging Coin Pouch on right hip
  const pouchGroup = new THREE.Group();
  pouchGroup.position.set(0.26, -0.24, 0.12);
  const pouchBodyGeo = new THREE.SphereGeometry(0.075, 10, 10);
  pouchBodyGeo.scale(1, 1.25, 0.9);
  const pouchBody = new THREE.Mesh(pouchBodyGeo, leatherPouchMat);
  pouchGroup.add(pouchBody);
  const pouchTieGeo = new THREE.TorusGeometry(0.035, 0.012, 6, 12);
  const pouchTie = new THREE.Mesh(pouchTieGeo, goldBuckleMat);
  pouchTie.position.set(0, 0.07, 0);
  pouchTie.rotation.x = Math.PI / 2;
  pouchGroup.add(pouchTie);
  torsoGroup.add(pouchGroup);

  // Hanging Magic Potion on left hip
  const potionGroup = new THREE.Group();
  potionGroup.position.set(-0.27, -0.24, 0.1);
  const potionBottleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.09, 10);
  const potionBottle = new THREE.Mesh(potionBottleGeo, potionGlassMat);
  potionGroup.add(potionBottle);
  const corkGeo = new THREE.CylinderGeometry(0.022, 0.018, 0.03, 8);
  const cork = new THREE.Mesh(corkGeo, corkMat);
  cork.position.set(0, 0.055, 0);
  potionGroup.add(cork);
  torsoGroup.add(potionGroup);

  // Backpack with rolled bedroll on the back
  const backpackGroup = new THREE.Group();
  backpackGroup.position.set(0, 0.04, -0.24);

  const packGeo = new THREE.BoxGeometry(0.36, 0.4, 0.2);
  const packMesh = new THREE.Mesh(packGeo, backpackMat);
  packMesh.castShadow = true;
  backpackGroup.add(packMesh);

  // Rolled bedroll sleeping mat on top of backpack
  const bedrollGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.44, 12);
  bedrollGeo.rotateZ(Math.PI / 2);
  const bedroll = new THREE.Mesh(bedrollGeo, bedrollMat);
  bedroll.position.set(0, 0.24, 0);
  bedroll.castShadow = true;
  backpackGroup.add(bedroll);

  for (const xOff of [-0.12, 0.12]) {
    const strapGeo = new THREE.TorusGeometry(0.075, 0.01, 6, 14);
    strapGeo.rotateY(Math.PI / 2);
    const strap = new THREE.Mesh(strapGeo, hairMat);
    strap.position.set(xOff, 0.24, 0);
    backpackGroup.add(strap);
  }
  torsoGroup.add(backpackGroup);

  // 4. Head Group (tilting, tracking, turning left & right naturally)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.15, 0);
  characterGroup.add(headGroup);

  // Cute rounded cartoon head
  const headGeo = new THREE.SphereGeometry(0.28, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.castShadow = true;
  headGroup.add(head);

  // Cartoon Hair Tufts
  const hairBangsGeo = new THREE.ConeGeometry(0.06, 0.14, 6);
  for (let i = 0; i < 4; i++) {
    const bang = new THREE.Mesh(hairBangsGeo, hairMat);
    const xPos = -0.12 + i * 0.08;
    bang.position.set(xPos, 0.16, 0.22);
    bang.rotation.x = 0.5;
    bang.rotation.z = (i - 1.5) * 0.15;
    headGroup.add(bang);
  }

  // Side hair tufts
  const sideHairGeo = new THREE.ConeGeometry(0.07, 0.18, 6);
  const leftSideHair = new THREE.Mesh(sideHairGeo, hairMat);
  leftSideHair.position.set(-0.25, 0.04, 0.06);
  leftSideHair.rotation.z = 0.4;
  const rightSideHair = new THREE.Mesh(sideHairGeo, hairMat);
  rightSideHair.position.set(0.25, 0.04, 0.06);
  rightSideHair.rotation.z = -0.4;
  headGroup.add(leftSideHair, rightSideHair);

  // Stylized Cartoon Eyes (Large, expressive anime/chibi eyes)
  const eyeWhiteGeo = new THREE.SphereGeometry(0.062, 12, 12);
  eyeWhiteGeo.scale(1, 1.25, 0.4);

  const irisGeo = new THREE.SphereGeometry(0.046, 12, 12);
  irisGeo.scale(1, 1.18, 0.4);

  const pupilGeo = new THREE.SphereGeometry(0.026, 10, 10);
  pupilGeo.scale(1, 1.1, 0.4);

  const mainSparkleGeo = new THREE.SphereGeometry(0.018, 8, 8);
  const subSparkleGeo = new THREE.SphereGeometry(0.009, 6, 6);

  // Left Eye assembly
  const leftEyeGroup = new THREE.Group();
  leftEyeGroup.position.set(-0.11, 0.04, 0.25);
  const leftWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  const leftIris = new THREE.Mesh(irisGeo, eyeIrisMat);
  leftIris.position.set(0, -0.01, 0.02);
  const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
  leftPupil.position.set(0, -0.01, 0.035);
  const leftGlint1 = new THREE.Mesh(mainSparkleGeo, sparkleMat);
  leftGlint1.position.set(0.015, 0.018, 0.05);
  const leftGlint2 = new THREE.Mesh(subSparkleGeo, sparkleMat);
  leftGlint2.position.set(-0.015, -0.018, 0.05);
  leftEyeGroup.add(leftWhite, leftIris, leftPupil, leftGlint1, leftGlint2);

  // Right Eye assembly
  const rightEyeGroup = new THREE.Group();
  rightEyeGroup.position.set(0.11, 0.04, 0.25);
  const rightWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  const rightIris = new THREE.Mesh(irisGeo, eyeIrisMat);
  rightIris.position.set(0, -0.01, 0.02);
  const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
  rightPupil.position.set(0, -0.01, 0.035);
  const rightGlint1 = new THREE.Mesh(mainSparkleGeo, sparkleMat);
  rightGlint1.position.set(0.015, 0.018, 0.05);
  const rightGlint2 = new THREE.Mesh(subSparkleGeo, sparkleMat);
  rightGlint2.position.set(-0.015, -0.018, 0.05);
  rightEyeGroup.add(
    rightWhite,
    rightIris,
    rightPupil,
    rightGlint1,
    rightGlint2
  );

  headGroup.add(leftEyeGroup, rightEyeGroup);

  // Rosy Cartoon Cheeks (Blush)
  const blushGeo = new THREE.CircleGeometry(0.04, 12);
  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(-0.16, -0.04, 0.245);
  leftBlush.rotation.y = -0.35;
  const rightBlush = new THREE.Mesh(blushGeo, blushMat);
  rightBlush.position.set(0.16, -0.04, 0.245);
  rightBlush.rotation.y = 0.35;
  headGroup.add(leftBlush, rightBlush);

  // Expressive Cartoon Eyebrows
  const browGeo = new THREE.BoxGeometry(0.09, 0.02, 0.02);
  const leftBrow = new THREE.Mesh(browGeo, browMat);
  leftBrow.position.set(-0.11, 0.14, 0.26);
  leftBrow.rotation.z = -0.15;
  const rightBrow = new THREE.Mesh(browGeo, browMat);
  rightBrow.position.set(0.11, 0.14, 0.26);
  rightBrow.rotation.z = 0.15;
  headGroup.add(leftBrow, rightBrow);

  // Cheerful Smile
  const smileGeo = new THREE.TorusGeometry(0.065, 0.016, 6, 12, Math.PI);
  smileGeo.rotateX(Math.PI);
  const smile = new THREE.Mesh(smileGeo, smileMat);
  smile.position.set(0, -0.07, 0.26);
  headGroup.add(smile);

  // Adventurer / Merchant Beret with Feather
  const beretGroup = new THREE.Group();
  beretGroup.position.set(0, 0.16, 0);
  beretGroup.rotation.z = -0.18;
  beretGroup.rotation.x = -0.1;

  // Beret main crown
  const beretCrownGeo = new THREE.SphereGeometry(0.32, 16, 12);
  beretCrownGeo.scale(1.15, 0.52, 1.15);
  const beretCrown = new THREE.Mesh(beretCrownGeo, beretMat);
  beretCrown.castShadow = true;
  beretGroup.add(beretCrown);

  // Beret brim band
  const beretBrimGeo = new THREE.TorusGeometry(0.28, 0.028, 8, 20);
  beretBrimGeo.rotateX(Math.PI / 2);
  const beretBrim = new THREE.Mesh(beretBrimGeo, beretMat);
  beretBrim.position.set(0, -0.08, 0);
  beretGroup.add(beretBrim);

  // Gold Brooch / Buckle on side
  const broochGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 10);
  broochGeo.rotateZ(Math.PI / 2);
  const brooch = new THREE.Mesh(broochGeo, goldBuckleMat);
  brooch.position.set(0.28, -0.02, 0.1);
  beretGroup.add(brooch);

  // Elegant Adventurer Feather
  const featherGeo = new THREE.ConeGeometry(0.05, 0.42, 6);
  featherGeo.scale(1, 1, 0.35);
  const feather = new THREE.Mesh(featherGeo, featherMat);
  feather.position.set(0.34, 0.18, 0.06);
  feather.rotation.z = -0.45;
  feather.rotation.x = 0.2;
  feather.castShadow = true;
  beretGroup.add(feather);

  headGroup.add(beretGroup);

  // 5. Arms with pivot groups at shoulders
  const armGeo = new THREE.CylinderGeometry(0.075, 0.068, 0.42, 8);
  armGeo.translate(0, -0.21, 0);
  const cuffGeo = new THREE.CylinderGeometry(0.085, 0.08, 0.07, 8);
  const handGeo = new THREE.SphereGeometry(0.07, 8, 8);

  // Left Arm (rests naturally on counter)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.33, 0.85, 0);
  const leftArm = new THREE.Mesh(armGeo, vestMat);
  const leftCuff = new THREE.Mesh(cuffGeo, tunicMat);
  leftCuff.position.set(0, -0.38, 0);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(0, -0.44, 0);
  leftArmGroup.add(leftArm, leftCuff, leftHand);
  leftArmGroup.rotation.z = 0.25;
  leftArmGroup.rotation.x = 0.5;
  characterGroup.add(leftArmGroup);

  // Right Arm (waving / gesturing arm)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.33, 0.85, 0);
  const rightArm = new THREE.Mesh(armGeo, vestMat);
  const rightCuff = new THREE.Mesh(cuffGeo, tunicMat);
  rightCuff.position.set(0, -0.38, 0);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0, -0.44, 0);
  rightArmGroup.add(rightArm, rightCuff, rightHand);
  rightArmGroup.rotation.z = -0.25;
  characterGroup.add(rightArmGroup);


  // 7. 3D Floating Speech Balloon (CENTERED AND ENLARGED)
  const speechBubbleGroup = new THREE.Group();
  // Centered directly above the merchant (x = 0) and elevated
  speechBubbleGroup.position.set(0, 2.48, 0.45);

  const bubbleTex = createSpeechBubbleTexture();
  // Enlarged width and height for prominent, crisp reading
  const bubbleGeo = new THREE.PlaneGeometry(2.7, 1.18);
  const bubbleMat = new THREE.MeshBasicMaterial({
    map: bubbleTex,
    transparent: true,
    alphaTest: 0.05,
    side: THREE.DoubleSide,
  });
  const speechBubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
  speechBubbleMesh.userData = { isSpeechBubble: true };
  speechBubbleGroup.add(speechBubbleMesh);
  characterGroup.add(speechBubbleGroup);

  // 8. Update loop - NO JUMPING, smooth natural left-right head rotation
  const update = (
    time: number,
    reaction: CharacterReaction,
    reactionElapsed: number,
    mouse: { x: number; y: number }
  ) => {
    // STABLE POSITION: Feet stay firmly on the ground, NO jumping
    const subtleBreath = Math.sin(time * 2.2) * 0.008;
    characterGroup.position.y = 1.48 + subtleBreath;

    // Smooth, organic left and right head look-around (ambient NPC behavior)
    // Combines gentle sinusoidal sweeps with soft pauses
    const naturalLook =
      Math.sin(time * 0.6) * 0.28 + Math.sin(time * 1.3) * 0.06;

    // Head rotation: ambient look-around combined with subtle mouse tracking
    headGroup.rotation.y = naturalLook + mouse.x * 0.18;
    headGroup.rotation.x = -mouse.y * 0.12 + Math.sin(time * 0.8) * 0.025;
    headGroup.rotation.z = Math.sin(time * 0.6) * 0.03;

    // Centered speech bubble gentle float
    speechBubbleGroup.position.y = 2.48 + Math.sin(time * 2.0) * 0.03;
    speechBubbleGroup.rotation.z = Math.sin(time * 1.2) * 0.012;

    // Default resting arms
    rightArmGroup.rotation.z = -0.25;
    rightArmGroup.rotation.x = 0.5;
    rightArmGroup.rotation.y = 0;
    leftArmGroup.rotation.z = 0.25;
    leftArmGroup.rotation.x = 0.5;
    torsoGroup.rotation.y = 0;

    // Reaction animations WITHOUT jumping
    if (reaction === "wave" || reactionElapsed < 2.5) {
      // Friendly waving arm (feet stay planted)
      rightArmGroup.rotation.z = -2.35 + Math.sin(time * 10) * 0.35;
      rightArmGroup.rotation.x = Math.cos(time * 10) * 0.15;
    } else if (reaction === "celebrate" && reactionElapsed < 3.0) {
      // Both arms cheer celebration, torso sways warmly (NO jump)
      rightArmGroup.rotation.z = -2.6 + Math.sin(time * 8) * 0.18;
      rightArmGroup.rotation.x = 0;
      leftArmGroup.rotation.z = 2.6 - Math.sin(time * 8) * 0.18;
      leftArmGroup.rotation.x = 0;
      torsoGroup.rotation.y = Math.sin(time * 6) * 0.08;
    } else if (reaction === "think") {
      headGroup.rotation.z = 0.18;
      rightArmGroup.rotation.z = -1.65;
      rightArmGroup.rotation.x = 0.4;
      rightArmGroup.rotation.y = 0.3;
    } else if (reaction === "nod") {
      headGroup.rotation.x = Math.sin(time * 6) * 0.16;
    } else if (reaction === "happy") {
      // Joyful open arms gesture without hopping
      rightArmGroup.rotation.z = -1.1 + Math.sin(time * 6) * 0.2;
      leftArmGroup.rotation.z = 1.1 - Math.sin(time * 6) * 0.2;
    }
  };

  return {
    group: characterGroup,
    clickableObjects: [
      torso,
      vest,
      head,
      beretCrown,
      speechBubbleMesh,
      pouchBody,
    ],
    update,
  };
}
