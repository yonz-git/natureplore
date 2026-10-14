"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { gsap } from "gsap";
import Logo from "@/components/Logo";

// The logo's symbol in 3D, covered in leaves like a clipped hedge. Each piece of the symbol is
// extruded from the same paths as components/Logo.tsx, and a few thousand small leaves are placed
// on its surface as one instanced mesh. The leaves grow in piece by piece (the fronds from the
// bottom up, then the mushroom, the leaf and the bird), then stir in a breeze; under the pointer
// they rustle harder, and the whole symbol turns a little towards it.
// Growth and wind run in the leaf shader (one uniform each), so thousands of leaves cost one draw.

const LIME = "#AEB779";
const LIME_DEEP = "#9DA56D";
const GLOW = "#DDF57A";
const OLIVE = "#7E8A4E";
const MARKER = "#2F4A30";

// the symbol's paths in the order of components/Logo.tsx, with when each starts to leaf (s)
// Only the fronds, the plants, are leafed; the mushroom, the wing and the bird stay smooth in the
// logo's lime and drop into place once the leaves are up, so the double reading survives.
const PIECES = [
  { name: "fronds-top", at: 0.9, leafy: true },
  { name: "fronds-middle", at: 0.45, leafy: true },
  { name: "fronds-left", at: 0, leafy: true },
  { name: "fronds-right", at: 0.12, leafy: true },
  { name: "wing", at: 2.75, leafy: false },
  { name: "bird", at: 2.9, leafy: false },
  { name: "mushroom", at: 2.45, leafy: false },
];
const DROP = 0.35; // scene units the smooth pieces fall from
const SPAN = 1.0; // s, how long one piece takes to leaf from its foot to its top
const GROW = 0.7; // s, one leaf from bud to full size
const DENSITY = 0.1; // leaves per square unit of the symbol's surface (its viewBox units)
const UNIT = 1 / 100; // viewBox units to scene units

// One leaf: an oval blade from its stem (origin) to its tip (+y), cupped and bent back a little.
function leafGeometry() {
  const L = 17, W = 6.8;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(W, L * 0.18, W * 0.95, L * 0.72, 0, L);
  s.bezierCurveTo(-W * 0.95, L * 0.72, -W, L * 0.18, 0, 0);
  const g = new THREE.ShapeGeometry(s, 7);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    uv.setXY(i, (x + W) / (2 * W), y / L); // the texture spans the blade: stem at v 0, tip at v 1
    p.setZ(i, -0.012 * y * y + 0.05 * x * x); // bent back along the midrib, cupped across it
  }
  g.computeVertexNormals();
  g.scale(UNIT, UNIT, UNIT);
  return { geometry: g, length: L * UNIT };
}

// The leaf's surface, drawn here rather than loaded: a pale blade (the instance colour tints it) with a
// midrib, paired side veins and a darker rim, and a matching bump map so the veins catch the light.
function leafTextures() {
  const S = 256;
  const draw = (paint: (x: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = S;
    paint(canvas.getContext("2d")!);
    return canvas;
  };
  // the blade's own outline in texture space, so the rim follows it (x across, y from the stem up)
  const blade = (x: CanvasRenderingContext2D) => {
    x.beginPath();
    x.moveTo(S / 2, S);
    x.bezierCurveTo(S, S * 0.82, S * 0.975, S * 0.28, S / 2, 0);
    x.bezierCurveTo(S * 0.025, S * 0.28, 0, S * 0.82, S / 2, S);
  };
  const veins = (x: CanvasRenderingContext2D, rib: string, side: string) => {
    x.lineCap = "round";
    x.strokeStyle = rib;
    x.lineWidth = S * 0.035;
    x.beginPath();
    x.moveTo(S / 2, S);
    x.quadraticCurveTo(S * 0.51, S * 0.5, S / 2, S * 0.04);
    x.stroke();
    x.strokeStyle = side;
    x.lineWidth = S * 0.014;
    for (let k = 0; k < 7; k++) {
      const y = S * (0.86 - k * 0.115), reach = S * (0.36 - Math.abs(k - 2.6) * 0.045);
      for (const dir of [-1, 1]) {
        x.beginPath();
        x.moveTo(S / 2, y);
        x.quadraticCurveTo(S / 2 + dir * reach * 0.5, y - S * 0.05, S / 2 + dir * reach, y - S * 0.14);
        x.stroke();
      }
    }
  };
  const colour = draw((x) => {
    const g = x.createLinearGradient(0, S, 0, 0);
    g.addColorStop(0, "#C9CFAE"); // a little deeper at the stem
    g.addColorStop(1, "#EEF1DC"); // lighter towards the tip
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
    // a faint mottle, seeded so every load is the same leaf
    const r = mulberry(3);
    for (let k = 0; k < 900; k++) {
      x.fillStyle = `rgba(${r() < 0.5 ? "70,90,40" : "255,255,235"},${0.03 + r() * 0.04})`;
      x.beginPath();
      x.arc(r() * S, r() * S, 1 + r() * 4, 0, Math.PI * 2);
      x.fill();
    }
    veins(x, "rgba(255,255,240,0.75)", "rgba(255,255,240,0.45)");
    blade(x);
    x.lineWidth = S * 0.05;
    x.strokeStyle = "rgba(60,75,35,0.35)";
    x.stroke();
  });
  const bump = draw((x) => {
    x.fillStyle = "#777";
    x.fillRect(0, 0, S, S);
    // the blade swells a little between the veins
    const g = x.createRadialGradient(S / 2, S * 0.55, S * 0.05, S / 2, S * 0.55, S * 0.5);
    g.addColorStop(0, "#8A8A8A");
    g.addColorStop(1, "#6A6A6A");
    x.fillStyle = g;
    blade(x);
    x.fill();
    veins(x, "#C8C8C8", "#A8A8A8");
  });
  const map = new THREE.CanvasTexture(colour);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const bumpMap = new THREE.CanvasTexture(bump);
  return { map, bumpMap };
}

type Uniforms = { uGrow: { value: number }; uTime: { value: number }; uPointer: { value: THREE.Vector3 }; uStir: { value: number } };

// Growth, wind and the pointer's rustle, patched into a stock material so lighting and shadows stay
// three.js's own. The same patch goes on the depth material, or ungrown leaves would cast shadows.
function patch(material: THREE.Material, u: Uniforms, length: number) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute float aDelay;
        attribute float aPhase;
        uniform float uGrow;
        uniform float uTime;
        uniform vec3 uPointer;
        uniform float uStir;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float s = clamp((uGrow - aDelay) / ${GROW.toFixed(3)}, 0.0, 1.0);
        float b = s - 1.0;
        float grow = 1.0 + 2.70158 * b * b * b + 1.70158 * b * b; // back.out
        vec3 at = instanceMatrix[3].xyz;
        float near = smoothstep(0.75, 0.0, distance(at.xy, uPointer.xy)) * uStir;
        float tip = transformed.y / ${length.toFixed(4)};
        float sway = sin(uTime * 1.6 + aPhase + at.x * 1.8) * 0.18 + sin(uTime * 2.7 + aPhase * 1.7) * 0.06;
        float rustle = sin(uTime * 11.0 + aPhase * 3.0) * 0.55 * near;
        float bend = (sway + rustle) * tip * tip;
        transformed.z += bend * ${length.toFixed(4)};
        transformed.x += rustle * 0.25 * tip * ${length.toFixed(4)};
        transformed *= grow;`,
      );
  };
}

export default function LeafLogo() {
  const host = useRef<HTMLDivElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const regrow = useRef<() => void>(() => {});

  useEffect(() => {
    const el = host.current, svg = source.current?.querySelector("svg");
    if (!el || !svg) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.set(0, 0, 9.5);

    scene.add(new THREE.HemisphereLight("#F3F7DA", "#1E3320", 1.4));
    const key = new THREE.DirectionalLight("#FFF6E0", 2.6);
    key.position.set(-2.5, 3.5, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = key.shadow.camera.bottom = -2.2;
    key.shadow.camera.right = key.shadow.camera.top = 2.2;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.01;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(GLOW, 0.9);
    rim.position.set(3, -1, -2);
    scene.add(rim);

    const symbol = new THREE.Group();
    scene.add(symbol);

    // the pieces, extruded from the logo's own paths
    const loader = new SVGLoader();
    const paths = [...svg.querySelectorAll("path")];
    const bodies: THREE.Mesh[] = [];
    const box = new THREE.Box3();
    paths.forEach((p) => {
      const doc = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${p.getAttribute("d")}" fill-rule="${p.getAttribute("fill-rule") ?? "nonzero"}"/></svg>`;
      const shapes = loader.parse(doc).paths.flatMap((sp) => SVGLoader.createShapes(sp));
      const g = new THREE.ExtrudeGeometry(shapes, {
        depth: 16, bevelEnabled: true, bevelThickness: 7, bevelSize: 4.5, bevelSegments: 4, curveSegments: 10,
      });
      g.rotateX(Math.PI); // SVG's y runs down; a turn about x keeps the faces' winding
      g.scale(UNIT, UNIT, UNIT);
      g.computeBoundingBox();
      box.union(g.boundingBox!);
      const leafy = PIECES[bodies.length].leafy;
      const m = new THREE.Mesh(
        g,
        leafy
          ? new THREE.MeshStandardMaterial({ color: MARKER, roughness: 0.95, transparent: true, opacity: 0 })
          : new THREE.MeshPhysicalMaterial({ color: LIME, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.5, transparent: true, opacity: 0 }),
      );
      m.castShadow = !leafy;
      m.receiveShadow = true;
      bodies.push(m);
      symbol.add(m);
    });
    const middle = box.getCenter(new THREE.Vector3());
    bodies.forEach((m) => m.geometry.translate(-middle.x, -middle.y, -middle.z));
    box.translate(middle.negate());

    // the leaves: sampled over each piece in proportion to its surface, the back faces left bare
    const { geometry: leaf, length } = leafGeometry();
    const uniforms: Uniforms = {
      uGrow: { value: reduce ? 99 : 0 }, uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3(99, 99, 0) }, uStir: { value: 0 },
    };
    const samplers = bodies.map((m) => new MeshSurfaceSampler(m).build());
    const counts = samplers.map((s, k) => {
      const d = (s as unknown as { distribution: Float32Array }).distribution;
      // the front and sides, not the back; the smooth pieces get none
      return PIECES[k].leafy ? Math.round((d[d.length - 1] / (UNIT * UNIT)) * DENSITY * 0.6) : 0;
    });
    const total = counts.reduce((a, b) => a + b, 0);
    const { map, bumpMap } = leafTextures();
    const leaves = new THREE.InstancedMesh(
      leaf,
      new THREE.MeshStandardMaterial({ map, bumpMap, bumpScale: 1.6, roughness: 0.58, side: THREE.DoubleSide }),
      total,
    );
    leaves.castShadow = true;
    leaves.receiveShadow = true;
    leaves.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
    patch(leaves.material as THREE.Material, uniforms, length);
    patch(leaves.customDepthMaterial, uniforms, length);

    const rand = mulberry(7);
    const delay = new Float32Array(total), phase = new Float32Array(total);
    const p = new THREE.Vector3(), n = new THREE.Vector3(), t = new THREE.Vector3(), up = new THREE.Vector3();
    const side = new THREE.Vector3(), face = new THREE.Vector3(), q = new THREE.Matrix4(), c = new THREE.Color();
    const tones = [LIME, LIME, LIME, LIME_DEEP, LIME_DEEP, OLIVE].map((h) => new THREE.Color(h));
    const root = new THREE.Vector3(0, box.min.y - 0.4, 0); // just under the symbol's foot
    let i = 0;
    samplers.forEach((sampler, k) => {
      const piece = bodies[k].geometry.boundingBox!;
      const foot = piece.min.y, height = piece.max.y - piece.min.y || 1;
      for (let made = 0, tries = 0; made < counts[k] && tries < counts[k] * 8; tries++) {
        sampler.sample(p, n);
        if (n.z < -0.25) continue; // the back stays bare: nobody sees it
        // the leaves lie along the piece like feathers, pointing away from the symbol's foot so the
        // shapes stay readable, each turned up to 30° either way and leaning out 6 to 28°
        t.set(p.x - root.x, p.y - root.y, 0).normalize();
        t.applyAxisAngle(n, (rand() - 0.5) * THREE.MathUtils.degToRad(60));
        t.addScaledVector(n, -t.dot(n));
        if (t.lengthSq() < 1e-6) continue;
        t.normalize();
        const lean = THREE.MathUtils.degToRad(6 + rand() * 22);
        up.copy(t).multiplyScalar(Math.cos(lean)).addScaledVector(n, Math.sin(lean)).normalize();
        side.crossVectors(up, n).normalize();
        face.crossVectors(side, up);
        if (face.dot(n) < 0) { side.negate(); face.negate(); }
        const size = 0.8 + rand() * 0.4;
        q.makeBasis(side, up, face).scale(new THREE.Vector3(size, size, size)).setPosition(p.addScaledVector(n, 0.003 + rand() * 0.012));
        leaves.setMatrixAt(i, q);
        // lighter on the faces that look at us, deeper in the sides
        c.copy(tones[Math.floor(rand() * tones.length)]).multiplyScalar(0.72 + 0.2 * Math.max(0, n.z) + rand() * 0.1);
        leaves.setColorAt(i, c);
        const rise = (p.y - foot) / height;
        delay[i] = PIECES[k].at + rise * SPAN + rand() * 0.25;
        phase[i] = rand() * Math.PI * 2;
        made++;
        i++;
      }
    });
    leaves.count = i;
    leaf.setAttribute("aDelay", new THREE.InstancedBufferAttribute(delay, 1));
    leaf.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phase, 1));
    symbol.add(leaves);

    // the bare body fades in under each piece's first leaves
    // and the smooth pieces drop into place with a little overshoot, the logo intro's own landing
    const showBodies = (g: number) =>
      bodies.forEach((m, k) => {
        const material = m.material as THREE.MeshStandardMaterial;
        if (PIECES[k].leafy) {
          material.opacity = THREE.MathUtils.clamp((g - PIECES[k].at) / 0.4, 0, 1);
          return;
        }
        const s = THREE.MathUtils.clamp((g - PIECES[k].at) / 0.55, 0, 1), b = s - 1;
        material.opacity = Math.min(1, s * 3);
        m.position.y = (1 - (1 + 2.70158 * b * b * b + 1.70158 * b * b)) * DROP;
      });
    showBodies(uniforms.uGrow.value);

    const end = Math.max(...PIECES.map((x) => x.at)) + SPAN + 0.25 + GROW;
    let growth: gsap.core.Tween | undefined;
    regrow.current = () => {
      if (reduce) return;
      growth?.kill();
      uniforms.uGrow.value = 0;
      growth = gsap.to(uniforms.uGrow, { value: end, duration: end, ease: "none", onUpdate: () => showBodies(uniforms.uGrow.value) });
    };
    regrow.current();

    // the symbol turns a little towards the pointer, and the leaves under it rustle
    const aim = new THREE.Vector2(), look = new THREE.Vector2();
    const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), hit = new THREE.Vector3();
    let inside = false;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      aim.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      inside = e.pointerType !== "touch" || e.type === "pointermove";
    };
    const leave = () => (inside = false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // the symbol fills about half the shorter side
      const span = Math.max(box.max.x - box.min.x, box.max.y - box.min.y) * 1.9;
      const fit = span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(1, camera.aspect));
      camera.position.z = fit;
      camera.updateProjectionMatrix();
    };
    resize();
    const watch = new ResizeObserver(resize);
    watch.observe(el);

    const clock = new THREE.Clock();
    const inverse = new THREE.Matrix4();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05), now = clock.elapsedTime;
      if (!reduce) uniforms.uTime.value = now;
      look.lerp(inside ? aim : new THREE.Vector2(), 1 - Math.exp(-dt * 3));
      symbol.rotation.y = look.x * 0.45 + (reduce ? 0 : Math.sin(now * 0.35) * 0.06);
      symbol.rotation.x = -look.y * 0.25;
      // where the pointer meets the symbol's plane, in the symbol's own space
      ray.setFromCamera(aim, camera);
      symbol.updateMatrixWorld();
      inverse.copy(symbol.matrixWorld).invert();
      ray.ray.applyMatrix4(inverse);
      if (ray.ray.intersectPlane(plane, hit)) uniforms.uPointer.value.copy(hit);
      uniforms.uStir.value += ((inside && !reduce ? 1 : 0) - uniforms.uStir.value) * (1 - Math.exp(-dt * 4));
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      growth?.kill();
      watch.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      bodies.forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
      leaf.dispose();
      map.dispose();
      bumpMap.dispose();
      (leaves.material as THREE.Material).dispose();
      leaves.customDepthMaterial?.dispose();
      leaves.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="leaf-logo">
      <div ref={source} hidden>
        <Logo symbol />
      </div>
      <div ref={host} className="leaf-logo-stage" aria-label="natureplore" role="img" />
      <button type="button" className="leaf-logo-again" onClick={() => regrow.current()}>
        Grow again
      </button>
    </div>
  );
}

// a small seeded random, so the same leaves land in the same places every time
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
