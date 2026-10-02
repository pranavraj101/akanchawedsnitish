"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Draws a soft white petal; instances tint it blush, peach and ivory. */
function petalTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 192;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 192);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#c8c8c8");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(64, 6);
  ctx.bezierCurveTo(122, 56, 118, 150, 64, 186);
  ctx.bezierCurveTo(10, 150, 6, 56, 64, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 20);
  ctx.quadraticCurveTo(70, 100, 64, 176);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type Petal = {
  x: number; y: number; z: number;
  vy: number; sway: number; phase: number;
  rx: number; ry: number; rz: number;
  vrx: number; vry: number; vrz: number;
  s: number; boost: number; drift: number;
};

/**
 * Fixed full-screen canvas: rose petals drift down through a faint field of
 * gold dust. Wind follows the pointer; a page turn sends a gust through and
 * opening the seal releases a shower from the top of the screen.
 */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup: (() => void) | undefined;
    // Let the card land first; WebGL setup waits a beat so it never delays the entrance.
    const timer = window.setTimeout(() => { cleanup = start(); }, 350);
    return () => { clearTimeout(timer); cleanup?.(); };

    function start() {
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas!, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 22;

    // --- petals
    const COUNT = window.innerWidth < 700 ? 36 : 90;
    const geo = new THREE.PlaneGeometry(0.55, 0.9);
    const mat = new THREE.MeshBasicMaterial({ map: petalTexture(), transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
    const dummy = new THREE.Object3D();
    const palette = ["#f2c4c0", "#e8a9a6", "#f7d9c4", "#fff6ef", "#eab8a8", "#f4d6d2"].map((h) => new THREE.Color(h));
    const petals: Petal[] = [];
    for (let i = 0; i < COUNT; i++) {
      petals.push({
        x: rand(-20, 20), y: rand(-16, 18), z: rand(-12, 6),
        vy: rand(0.008, 0.022), sway: rand(0.4, 1.1), phase: rand(0, Math.PI * 2),
        rx: rand(0, 6.28), ry: rand(0, 6.28), rz: rand(0, 6.28),
        vrx: rand(-0.02, 0.02), vry: rand(-0.025, 0.025), vrz: rand(-0.015, 0.015),
        s: rand(0.55, 1.25), boost: 0, drift: 0,
      });
      mesh.setColorAt(i, palette[i % palette.length].clone().offsetHSL(0, 0, rand(-0.06, 0.06)));
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    // --- sparkles
    const SP = window.innerWidth < 700 ? 90 : 180;
    const pos = new Float32Array(SP * 3);
    for (let i = 0; i < SP; i++) {
      pos[i * 3] = rand(-24, 24);
      pos[i * 3 + 1] = rand(-16, 16);
      pos[i * 3 + 2] = rand(-14, 4);
    }
    const sgeo = new THREE.BufferGeometry();
    sgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const smat = new THREE.PointsMaterial({
      color: 0xc9a46a, size: 0.08, transparent: true, opacity: 0.5,
      depthWrite: false, sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sgeo, smat);
    scene.add(sparkles);

    // --- wind
    let windX = 0;
    let gust = 0;
    const onMove = (e: PointerEvent) => { windX = (e.clientX / window.innerWidth - 0.5) * 2; };
    const onGust = () => { gust = Math.min(0.3, gust + 0.18); };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("shaadi:gust", onGust);
    const onBurst = () => {
      petals.forEach((p) => {
        if (Math.random() > 0.6) return;
        p.y = rand(15, 24); p.x = rand(-14, 14); p.z = rand(-6, 6);
        p.boost = rand(0.06, 0.14); p.drift = rand(-0.05, 0.05);
      });
    };
    window.addEventListener("shaadi:burst", onBurst);

    const place = (i: number, p: Petal) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    };

    let raf = 0;
    const frame = (t: number) => {
      const time = t * 0.001;
      for (let i = 0; i < COUNT; i++) {
        const p = petals[i];
        p.y -= p.vy + p.boost + gust * 0.6;
        p.x += Math.sin(time * p.sway + p.phase) * 0.012 + windX * 0.01 + gust * 0.08 + p.drift;
        p.boost *= 0.992; p.drift *= 0.99;
        p.rx += p.vrx + gust * 0.1;
        p.ry += p.vry;
        p.rz += p.vrz + Math.cos(time * p.sway + p.phase) * 0.004;
        if (p.y < -17) { p.y = 18; p.x = rand(-20, 20); p.z = rand(-12, 6); }
        if (p.x > 22) p.x = -22; else if (p.x < -22) p.x = 22;
        place(i, p);
      }
      mesh.instanceMatrix.needsUpdate = true;
      gust *= 0.95;
      sparkles.rotation.y = time * 0.02;
      sparkles.rotation.x = Math.sin(time * 0.1) * 0.05;
      smat.opacity = 0.35 + Math.sin(time * 1.7) * 0.15;
      camera.position.x += (windX * 0.6 - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    for (let i = 0; i < COUNT; i++) place(i, petals[i]);
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("shaadi:gust", onGust);
      window.removeEventListener("shaadi:burst", onBurst);
      window.removeEventListener("resize", onResize);
      geo.dispose(); mat.dispose(); sgeo.dispose(); smat.dispose();
      renderer.dispose();
    };
    }
  }, []);

  return <canvas ref={ref} className="petals" aria-hidden="true" />;
}
