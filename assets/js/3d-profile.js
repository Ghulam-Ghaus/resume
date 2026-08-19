/**
 * 3D Profile Interactive WebGL Canvas & Round-Robin Avatar Script
 * Powered by Three.js & Modern Web Mechanics
 */

(function () {
  "use strict";

  // --- THREE.JS BACKGROUND CANVAS ---
  const canvas = document.getElementById("profile-3d-canvas");
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f2fe, 2, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x7f00ff, 2, 50);
  pointLight2.position.set(-10, -10, 10);
  scene.add(pointLight2);

  // 1. Central Floating Wireframe Icosahedron (Tech Core)
  const icoGeometry = new THREE.IcosahedronGeometry(4, 2);
  const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const techCore = new THREE.Mesh(icoGeometry, icoMaterial);
  techCore.position.set(4, 0, -2);
  scene.add(techCore);

  // Inner Glowing Core
  const innerGeo = new THREE.OctahedronGeometry(2, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x7f00ff,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  techCore.add(innerCore);

  // 2. Orbiting Tech Particle Cloud
  const particleCount = 200;
  const particlesGeo = new THREE.BufferGeometry();
  const posArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 35;
    posArray[i + 1] = (Math.random() - 0.5) * 25;
    posArray[i + 2] = (Math.random() - 0.5) * 20;
    scaleArray[i / 3] = Math.random();
  }

  particlesGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  // Particle Material
  const particleMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particlesGeo, particleMat);
  scene.add(particleSystem);

  // --- MOUSE TRACKING & PARALLAX ---
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  });

  // 3D Avatar Card Interactive Tilt
  const avatarContainer = document.querySelector(".avatar-3d-card-container");
  const avatarCard = document.querySelector(".avatar-card-inner");

  if (avatarContainer && avatarCard) {
    document.addEventListener("mousemove", (e) => {
      const rect = avatarContainer.getBoundingClientRect();
      // Check if mouse is near or inside container bounds for tilt
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Limit tilt angles
      const rotateX = (-y / rect.height) * 25;
      const rotateY = (x / rect.width) * 25;

      avatarContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    avatarContainer.addEventListener("mouseleave", () => {
      avatarContainer.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  }

  // --- SCROLL PARALLAX DEPTH ---
  let scrollY = 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Lerp smooth mouse movement
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Rotate Three.js geometry based on mouse & scroll
    techCore.rotation.x = elapsedTime * 0.2 + targetY * 0.0005;
    techCore.rotation.y = elapsedTime * 0.3 + targetX * 0.0005;

    innerCore.rotation.x = -elapsedTime * 0.4;
    innerCore.rotation.y = -elapsedTime * 0.5;

    particleSystem.rotation.y = elapsedTime * 0.05 + targetX * 0.0002;
    particleSystem.rotation.x = targetY * 0.0002;

    // Camera light tracking
    pointLight1.position.x = Math.sin(elapsedTime * 0.7) * 12 + targetX * 0.01;
    pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 12 - targetY * 0.01;

    // Camera scroll offset
    camera.position.y = -scrollY * 0.005;

    renderer.render(scene, camera);
  }

  animate();

  // Window Resize Listener
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // --- ROUND-ROBIN AVATAR FLIP MECHANISM ---
  const avatarInner = document.querySelector(".avatar-card-inner");
  const flipBtn = document.getElementById("flip-avatar-btn");
  const avatarBadge = document.getElementById("avatar-mode-badge");

  let isFlipped = false;
  let autoFlipTimer = null;

  function toggleAvatarFlip() {
    if (!avatarInner) return;
    isFlipped = !isFlipped;

    if (isFlipped) {
      avatarInner.classList.add("is-flipped");
      if (avatarBadge) avatarBadge.textContent = "3D AI Cyber Avatar";
    } else {
      avatarInner.classList.remove("is-flipped");
      if (avatarBadge) avatarBadge.textContent = "Original Photo";
    }
  }

  // Click trigger
  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      toggleAvatarFlip();
      resetAutoFlipTimer();
    });
  }

  if (avatarInner) {
    avatarInner.addEventListener("click", () => {
      toggleAvatarFlip();
      resetAutoFlipTimer();
    });
  }

  // Automatic round-robin timer every 5 seconds
  function startAutoFlipTimer() {
    autoFlipTimer = setInterval(() => {
      toggleAvatarFlip();
    }, 5000);
  }

  function resetAutoFlipTimer() {
    if (autoFlipTimer) clearInterval(autoFlipTimer);
    startAutoFlipTimer();
  }

  startAutoFlipTimer();
})();
