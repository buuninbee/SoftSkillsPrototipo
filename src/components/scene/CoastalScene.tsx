"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CharacterReaction } from "@/data/dialogueData";
import { createEnvironment } from "./createEnvironment";
import { createCounterDesk } from "./createCounterDesk";
import { createCharacter } from "./createCharacter";

interface CoastalSceneProps {
  reaction: CharacterReaction;
  onCharacterClick?: () => void;
  onBellClick?: () => void;
  onOpenScrollsModal?: () => void;
}

export default function CoastalScene({
  reaction,
  onCharacterClick,
  onBellClick,
  onOpenScrollsModal,
}: CoastalSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reactionRef = useRef(reaction);
  const reactionTimeRef = useRef(0);

  useEffect(() => {
    reactionRef.current = reaction;
    reactionTimeRef.current = performance.now() / 1000;
  }, [reaction]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fed7aa"); // Warm golden dawn sky
    scene.fog = new THREE.FogExp2("#fed7aa", 0.015);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Initial camera angled towards the counter desk
    camera.position.set(0, 4.3, 7.8);
    camera.lookAt(0, 2.0, 2.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting (Golden Dawn of Departure)
    const ambientLight = new THREE.AmbientLight("#fff7ed", 1.3);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight("#fef3c7", "#78350f", 0.9);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight("#fffbeb", 2.2);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // 3. Environment (Medieval RPG Guild Plaza & Facade)
    const environment = createEnvironment(scene);

    // 4. Counter Desk (Balcão de Atendimento)
    const desk = createCounterDesk();
    scene.add(desk.group);

    // 5. Character (Boneco Guia)
    const character = createCharacter();
    scene.add(character.group);

    // 6. Mouse Tracking & Raycasting
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    const handleMouseMove = (e: MouseEvent) =>
      updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0)
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouseVector, camera);

      // 1. Check click on central 3D Grimoire / Scroll on counter
      const scrollIntersects = raycaster.intersectObjects(
        desk.scrollTrigger,
        true
      );
      if (scrollIntersects.length > 0 && onOpenScrollsModal) {
        onOpenScrollsModal();
        return;
      }

      // 2. Check click on bell
      const bellIntersects = raycaster.intersectObject(desk.bell, true);
      if (bellIntersects.length > 0 && onBellClick) {
        onBellClick();
        return;
      }

      // 3. Check click on character
      const charIntersects = raycaster.intersectObjects(
        character.clickableObjects,
        true
      );
      if (charIntersects.length > 0 && onCharacterClick) {
        onCharacterClick();
        return;
      }

      // 4. Check click on whole desk
      const deskIntersects = raycaster.intersectObjects(
        desk.group.children,
        true
      );
      if (deskIntersects.length > 0 && onCharacterClick) {
        onCharacterClick();
      }
    };
    container.addEventListener("click", handleClick);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;

      if (width < 640) {
        camera.position.set(0, 5.2, 9.5);
      } else {
        camera.position.set(0, 4.3, 7.8);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const baseCamY = container.clientWidth < 640 ? 5.2 : 4.3;
      const baseCamZ = container.clientWidth < 640 ? 9.5 : 7.8;
      camera.position.x = mouse.x * 1.4;
      camera.position.y = baseCamY + mouse.y * 0.7;
      camera.position.z = baseCamZ;
      camera.lookAt(0, 2.0, 2.1);

      // Update submodules
      environment.update(time);
      desk.update(time);

      const now = performance.now() / 1000;
      const reactionElapsed = now - reactionTimeRef.current;
      character.update(time, reactionRef.current, reactionElapsed, mouse);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onCharacterClick, onBellClick]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}
