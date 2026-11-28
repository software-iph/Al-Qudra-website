"use client";

import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Home hero: a scroll story around the 3D model of Golden Square, Benghazi (ALQUDRA's office).
 *   Scene 1  dusk, street level           -> what we do (the H1, server-rendered)
 *   Scene 2  night falls, LED lines draw  -> how we work
 *   Scene 3  the 4th floor lights up      -> where we work (pinned label)
 *   Scene 4  aerial, the ALQUDRA ring     -> the brand line
 * three.js is loaded only after the first paint; until then (and without WebGL) the poster shows.
 * Reduced motion: no scroll story, a single still frame with the first scene.
 */

export type HeroScene = { kicker: string; title: string; text: string };
export type HeroProps = {
  rtl: boolean;
  eyebrow: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  scenes: [HeroScene, HeroScene, HeroScene]; // scenes 2, 3, 4
  finalButton: { label: string; href: string };
  floorLabel: string;
  modelNote: string;
  scrollLabel: string;
  poster: string;
  model: string;
};

/** "Every line, *set in place.*" -> the starred words in Patina. */
function Marked({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*([^*]+)\*/g);
  return parts.map((part, i) => (i % 2 ? <em key={i} className="text-patina-400 not-italic">{part}</em> : part));
}

// Facade glass colours, matched to daylight photos of Golden Square.
const GLASS = 0x2f74d6;
const GLASS_GROUND = 0x1f56a8;

// Scene windows on the 0..1 scroll progress.
const BEATS: [number, number][] = [
  [0, 0.2],
  [0.24, 0.46],
  [0.5, 0.72],
  [0.78, 1.01],
];

export function GoldenSquareHero(props: HeroProps) {
  const { rtl, eyebrow, title, text, primary, secondary, scenes, finalButton, floorLabel, modelNote, scrollLabel, poster, model } = props;
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [beat, setBeat] = useState(0);
  const [ready, setReady] = useState(false);
  const [pinOn, setPinOn] = useState(false);
  const reducedMotion = useReducedMotion();
  const [noGL, setNoGL] = useState(false);
  const still = !!reducedMotion || noGL; // reduced motion or no WebGL / model

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const canvas = canvasRef.current!;
      const stage = stageRef.current!;
      const story = storyRef.current!;
      const [THREE, { GLTFLoader }, { DRACOLoader }, { RoomEnvironment }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] =
        await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/loaders/DRACOLoader.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
          import("three/examples/jsm/postprocessing/OutputPass.js"),
        ]);
      if (disposed) return;

      const small = window.matchMedia("(max-width: 760px)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
      } catch {
        setNoGL(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled = !small;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 3000);
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      // Sky dome: animated gradient, a teal city glow on the horizon and a few stars at night.
      const skyU = {
        top: { value: new THREE.Color() },
        mid: { value: new THREE.Color() },
        bot: { value: new THREE.Color() },
        haze: { value: new THREE.Color() },
        stars: { value: 0 },
      };
      scene.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(1500, 64, 32),
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: skyU,
            vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
            fragmentShader: `uniform vec3 top, mid, bot, haze; uniform float stars; varying vec3 vP;
              float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
              void main(){
                float h = vP.y;
                vec3 c = h > 0. ? mix(mid, top, smoothstep(0., .6, h)) : mix(mid, bot, smoothstep(0., .3, -h));
                c += haze * exp(-abs(h) * 7.);
                vec2 g = vec2(atan(vP.z, vP.x) * 140., h * 260.);
                float r = h21(floor(g));
                float s = smoothstep(.16, 0., length(fract(g) - .5)) * step(.988, r) * (r - .988) * 70.;
                c += vec3(.8, .9, 1.) * s * stars * smoothstep(.12, .45, h);
                gl_FragColor = vec4(c, 1.);
              }`,
          }),
        ),
      );

      // Soft studio floor under the plinth, fading into the horizon colour.
      const floorU = { centre: { value: new THREE.Color() }, edge: skyU.mid };
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(1400, 96),
        new THREE.ShaderMaterial({
          uniforms: floorU,
          vertexShader: "varying vec2 vXZ; void main(){ vXZ = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",
          fragmentShader: `uniform vec3 centre, edge; varying vec2 vXZ;
            void main(){ float d = length(vXZ - vec2(0., 4.)); gl_FragColor = vec4(mix(centre, edge, smoothstep(80., 620., d)), 1.); }`,
        }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -4.3;
      scene.add(floor);

      const hemi = new THREE.HemisphereLight(0xbfd6ff, 0x2a2622, 1);
      scene.add(hemi);
      const sun = new THREE.DirectionalLight(0xfff1dc, 2);
      sun.position.set(-60, 70, 90);
      sun.castShadow = !small;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 70, bottom: -70, near: 10, far: 400 });
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.6;
      scene.add(sun);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0, 0.22, 0.92);
      if (!small) composer.addPass(bloom);
      composer.addPass(new OutputPass());

      // ---- Shaders: the LED lines and the ALQUDRA ring ----
      const U = { draw: { value: 0 }, glow: { value: 0 }, time: { value: 0 }, ring: { value: 0 }, focus: { value: 0 } };
      type Std = InstanceType<typeof THREE.MeshStandardMaterial>;
      const patchLED = (mat: Std) => {
        mat.emissive = new THREE.Color(0x19d3e6);
        mat.emissiveIntensity = 3.2;
        mat.onBeforeCompile = (s) => {
          Object.assign(s.uniforms, { uDraw: U.draw, uGlow: U.glow, uTime: U.time, uFocus: U.focus });
          s.vertexShader = s.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec2 vLed;")
            .replace("#include <uv_vertex>", "#include <uv_vertex>\nvLed = uv;");
          s.fragmentShader = s.fragmentShader
            .replace("#include <common>", "#include <common>\nvarying vec2 vLed; uniform float uDraw, uGlow, uTime, uFocus;")
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
              float reach = uDraw * 1.75 - vLed.x * 0.75;                       // lines draw up each fin, left to right
              float on = smoothstep(vLed.y - 0.04, vLed.y + 0.01, reach);
              float wave = 0.78 + 0.22 * sin(uTime * 1.3 - vLed.x * 14.0 + vLed.y * 3.0);
              float band = exp(-pow((vLed.y - 0.633) * 9.0, 2.0)) * uFocus * (0.6 + 0.4 * sin(uTime * 3.0)); // 4th floor
              totalEmissiveRadiance *= on * uGlow * wave + band * 2.2;`,
            );
        };
        mat.needsUpdate = true;
      };
      const patchRing = (mat: Std) => {
        mat.emissive = new THREE.Color(0x6fc1b6);
        mat.emissiveIntensity = 1.5;
        mat.onBeforeCompile = (s) => {
          Object.assign(s.uniforms, { uRing: U.ring, uGlow: U.glow });
          s.vertexShader = s.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vW;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          s.fragmentShader = s.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
              varying vec3 vW; uniform float uRing, uGlow;
              float ringT() { float a = atan(-vW.z - 4.0, vW.x) - radians(-17.7); return mod(a, 6.2831853) / 6.2831853; }`,
            )
            .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nfloat rt = ringT(); if (rt > uRing) discard;")
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
              float front = smoothstep(0.035, 0.0, uRing - rt) * step(uRing, 0.999);
              totalEmissiveRadiance *= 0.25 + uGlow + front * 3.0;`,
            );
        };
        mat.needsUpdate = true;
      };

      // ---- Load the building ----
      const glass: Std[] = [];
      const groundGlass: Std[] = [];
      const floor4: (Std & { userData: { glass?: boolean } })[] = [];
      const draco = new DRACOLoader().setDecoderPath("/draco/");
      const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(model).catch(() => null);
      if (disposed) return;
      if (!gltf) {
        setNoGL(true);
        return;
      }
      const root = gltf.scene;
      const inF4 = new Set<object>();
      root.getObjectByName("Floor_4")?.traverse((o) => inF4.add(o));
      const patched = new Set<Std>();
      root.traverse((o) => {
        const mesh = o as InstanceType<typeof THREE.Mesh>;
        if (!mesh.isMesh) return;
        mesh.castShadow = mesh.receiveShadow = true;
        const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Std[];
        mats.forEach((m, i) => {
          if (inF4.has(mesh)) {
            const c = m.clone();
            c.emissive = new THREE.Color(0x6fc1b6);
            c.emissiveIntensity = 0;
            if (m.name === "Glass") {
              c.userData.glass = true;
              c.envMapIntensity = 1.3;
            }
            floor4.push(c);
            if (Array.isArray(mesh.material)) mesh.material[i] = c;
            else mesh.material = c;
            return;
          }
          if (patched.has(m)) return;
          patched.add(m);
          if (m.name === "LED") {
            patchLED(m);
            mesh.castShadow = false;
          } else if (m.name === "Brand_Ring") {
            patchRing(m);
            mesh.castShadow = false;
          } else if (m.name === "Glass") glass.push(m);
          else if (m.name === "Glass_Ground") groundGlass.push(m);
        });
      });
      // Glass tinted to the real facade: a clear, saturated sky blue on the upper floors and a
      // slightly deeper blue on the shopfronts (from photos of Golden Square in daylight).
      const tint = (m: Std, hex: number) => {
        m.color = new THREE.Color(hex);
        m.metalness = 0.35;
        m.roughness = 0.1;
        m.envMapIntensity = 1.6;
      };
      glass.forEach((m) => tint(m, GLASS));
      groundGlass.forEach((m) => tint(m, GLASS_GROUND));
      floor4.forEach((m) => m.userData.glass && tint(m, GLASS));
      [...glass, ...groundGlass].forEach((m) => {
        m.emissive = new THREE.Color(0xf1dfa6);
      });
      scene.add(root);

      // ---- The story ----
      const K = [
        { p: 0.0, pos: [-18, 2.2, 60], tgt: [6, 15, 0], fov: 50, day: 0 }, // dusk, street level
        { p: 0.22, pos: [-6, 9, 118], tgt: [0, 16, 0], fov: 36, day: 0.55 }, // pull back as light falls
        { p: 0.46, pos: [8, 14, 112], tgt: [0, 17, 0], fov: 34, day: 1 }, // night, LEDs drawn
        { p: 0.62, pos: [30, 25, 62], tgt: [2, 23.5, 0], fov: 34, day: 1 }, // close on the 4th floor
        { p: 0.78, pos: [-20, 60, 140], tgt: [0, 8, 0], fov: 34, day: 1 }, // rise
        { p: 1.0, pos: [-42, 164, 203], tgt: [10, 2, 8], fov: 34, day: 1 }, // aerial: the ALQUDRA symbol
      ];
      const SKY = {
        dusk: [new THREE.Color("#1f4466"), new THREE.Color("#9db3c6"), new THREE.Color("#16222d")],
        night: [new THREE.Color("#07131e"), new THREE.Color("#163650"), new THREE.Color("#0a1722")],
        hazeDusk: new THREE.Color("#1c2a38"),
        hazeNight: new THREE.Color("#0f3446"),
        floorDusk: new THREE.Color("#4b5d6d"),
        floorNight: new THREE.Color("#23465f"),
      };
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
      const band = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
      const v3 = new THREE.Vector3();
      const t3 = new THREE.Vector3();
      const tmp = new THREE.Vector3();
      const F4 = new THREE.Vector3(0, 24.3, 0.6); // Floor_4 (G, P, 1-4 numbering): 22.4-26.2 m

      const sample = (p: number) => {
        let i = 0;
        while (i < K.length - 2 && p > K[i + 1].p) i++;
        const a = K[i];
        const b = K[i + 1];
        const t = ease(clamp((p - a.p) / (b.p - a.p)));
        v3.fromArray(a.pos).lerp(tmp.fromArray(b.pos), t);
        t3.fromArray(a.tgt).lerp(tmp.fromArray(b.tgt), t);
        return { fov: a.fov + (b.fov - a.fov) * t, day: a.day + (b.day - a.day) * t };
      };

      let target = 0;
      let prog = 0;
      let last = performance.now();
      let mx = 0;
      let my = 0;
      let pmx = 0;
      let pmy = 0;
      let lastBeat = -1;
      let lastPin = false;

      const readScroll = () => {
        const r = story.getBoundingClientRect();
        target = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
      };
      const onMove = (e: PointerEvent) => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
      };
      const resize = () => {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        camera.aspect = w / h;
        // Wide screens: slide the building away from the copy (start side). Portrait: building up, copy below.
        if (w > 900) camera.setViewOffset(w, h, (rtl ? 1 : -1) * w * 0.17, 0, w, h);
        else if (h > w) camera.setViewOffset(w, h, 0, h * 0.2, w, h);
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
      };

      const apply = (p: number, time: number) => {
        const s = sample(p);
        const aspectK = camera.aspect < 1.3 ? Math.pow(1.3 / camera.aspect, 0.85) : 1;
        tmp.copy(v3).sub(t3).multiplyScalar(aspectK);
        camera.position.copy(t3).add(tmp);
        camera.position.x += pmx * 6;
        camera.position.y += -pmy * 3;
        camera.fov = s.fov;
        camera.updateProjectionMatrix();
        camera.lookAt(t3);

        const n = s.day;
        skyU.top.value.copy(SKY.dusk[0]).lerp(SKY.night[0], n);
        skyU.mid.value.copy(SKY.dusk[1]).lerp(SKY.night[1], n);
        skyU.bot.value.copy(SKY.dusk[2]).lerp(SKY.night[2], n);
        skyU.haze.value.copy(SKY.hazeDusk).lerp(SKY.hazeNight, n);
        skyU.stars.value = n;
        floorU.centre.value.copy(SKY.floorDusk).lerp(SKY.floorNight, n);
        sun.intensity = 1.9 * (1 - n) + 0.38 * n;
        sun.color.setRGB(1 - 0.38 * n, 0.95 - 0.17 * n, 0.86 + 0.14 * n);
        hemi.intensity = 0.75 * (1 - n) + 0.34 * n;
        hemi.color.setHSL(0.6 - 0.07 * n, 0.5, 0.85 - 0.3 * n);
        hemi.groundColor.setHSL(0.52, 0.3, 0.14 * n + 0.15 * (1 - n));
        renderer.toneMappingExposure = 1 + 0.12 * n;
        scene.environmentIntensity = 0.75 - 0.58 * n;
        bloom.strength = 0.55 * n;

        U.draw.value = band(p, 0.18, 0.44);
        U.glow.value = band(p, 0.14, 0.32);
        U.focus.value = band(p, 0.5, 0.58) * (1 - band(p, 0.74, 0.82));
        U.ring.value = band(p, 0.74, 0.97);
        U.time.value = time / 1000;

        const office = 0.08 * n;
        glass.forEach((m) => (m.emissiveIntensity = office * 0.4));
        groundGlass.forEach((m) => (m.emissiveIntensity = office * 2.2));
        const f = U.focus.value;
        floor4.forEach((m) => (m.emissiveIntensity = (m.userData.glass ? 1.1 : 0.12) * f));

        const b = BEATS.findIndex(([a, z]) => p >= a && p < z);
        if (b !== lastBeat) {
          lastBeat = b;
          setBeat(b);
        }
        if (f > 0.05 && pinRef.current) {
          tmp.copy(F4).project(camera);
          const x = (tmp.x * 0.5 + 0.5) * stage.clientWidth;
          const y = (-tmp.y * 0.5 + 0.5) * stage.clientHeight;
          pinRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
        const pin = f > 0.6;
        if (pin !== lastPin) {
          lastPin = pin;
          setPinOn(pin);
        }
        if (ringRef.current) ringRef.current.style.strokeDashoffset = (113.1 * (1 - p)).toFixed(1);
      };

      let visible = true;
      let raf = 0;
      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!reduce) prog += (target - prog) * (1 - Math.exp(-dt * 7));
        pmx += (mx - pmx) * (1 - Math.exp(-dt * 3));
        pmy += (my - pmy) * (1 - Math.exp(-dt * 3));
        apply(prog, reduce ? 0 : now);
        composer.render();
        if (visible && !reduce) raf = requestAnimationFrame(frame);
      };

      resize();
      if (!reduce) {
        readScroll();
        prog = target;
        window.addEventListener("scroll", readScroll, { passive: true });
        window.addEventListener("pointermove", onMove, { passive: true });
      }
      window.addEventListener("resize", resize);
      const io = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) {
          last = performance.now();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        }
      });
      io.observe(stage);
      raf = requestAnimationFrame(frame);
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("scroll", readScroll);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", resize);
        draco.dispose();
        pmrem.dispose();
        composer.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [model, rtl]);

  const scenesAll = [{ kicker: eyebrow, title, text }, ...scenes];
  const activeBeat = still ? 0 : beat;

  return (
    <section ref={storyRef} aria-label={eyebrow} className={`relative bg-navy-900 text-paper ${still ? "" : "h-[520vh]"}`}>
      <div ref={stageRef} className="on-dark sticky top-0 h-svh overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          fetchPriority="high"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-settle ${ready ? "opacity-0" : "opacity-100"}`}
        />
        <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden />
        {/* Copy side shade (start side) + bottom shade on phones */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(8_21_33/0.74)_0%,rgb(8_21_33/0.3)_42%,transparent_65%),linear-gradient(0deg,rgb(8_21_33/0.6),transparent_30%)] rtl:bg-[linear-gradient(270deg,rgb(8_21_33/0.74)_0%,rgb(8_21_33/0.3)_42%,transparent_65%),linear-gradient(0deg,rgb(8_21_33/0.6),transparent_30%)] max-md:bg-[linear-gradient(0deg,rgb(8_21_33/0.92)_0%,rgb(8_21_33/0.6)_40%,transparent_64%)]"
          aria-hidden
        />

        <div className="container-x relative h-full">
          {scenesAll.map((s, i) => {
            const on = activeBeat === i;
            const Heading = i === 0 ? "h1" : "h2";
            return (
              <div
                key={i}
                aria-hidden={!on}
                className={`absolute inset-x-4 max-w-[36rem] transition-[opacity,transform] duration-[480ms] ease-settle sm:inset-x-8 xl:inset-x-10 max-md:bottom-24 md:top-1/2 md:-translate-y-1/2 ${
                  on ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0 md:-translate-y-[calc(50%-16px)]"
                }`}
              >
                <p className="label-mono flex items-center gap-4 text-white/65">
                  <span className="h-px w-10 bg-white/40" aria-hidden />
                  {s.kicker}
                </p>
                <Heading className={`mt-6 font-display font-bold tracking-[-0.035em] text-balance text-white rtl:tracking-normal ${i === 0 ? "text-[2.15rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem] rtl:leading-[1.35]" : "display"}`}>
                  <Marked text={s.title} />
                </Heading>
                <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-steel-200 sm:text-lg">{s.text}</p>
                {i === 0 && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={primary.href} tabIndex={on ? 0 : -1} className="btn-light">
                      {primary.label}
                      <ArrowRight className="flip-rtl size-4" aria-hidden />
                    </Link>
                    <Link href={secondary.href} tabIndex={on ? 0 : -1} className="btn-ghost">
                      {secondary.label}
                    </Link>
                  </div>
                )}
                {i === 3 && (
                  <Link href={finalButton.href} tabIndex={on ? 0 : -1} className="btn-light mt-8">
                    {finalButton.label}
                    <ArrowRight className="flip-rtl size-4" aria-hidden />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* The 4th-floor pin follows the building */}
        <div ref={pinRef} dir="ltr" className={`pointer-events-none absolute top-0 left-0 transition-opacity duration-[280ms] ${pinOn ? "opacity-100" : "opacity-0"}`} aria-hidden>
          <span className="absolute -mt-[7px] -ml-[7px] size-3.5 rounded-full bg-patina-400 shadow-[0_0_0_6px_rgb(111_193_182/0.25),0_0_24px_rgb(111_193_182/0.9)]" />
          <span className="absolute -top-px h-px w-16 bg-patina-400" />
          <span className="absolute -top-7 left-16 rounded-[2px] border border-patina-400/50 bg-navy-900/85 px-3.5 py-2 whitespace-nowrap backdrop-blur-sm">
            <span className="block font-mono text-[11px] tracking-[0.12em] text-patina-400 uppercase" dir="auto">{floorLabel}</span>
            <b className="block text-[15px] tracking-wide">ALQUDRA</b>
          </span>
        </div>

        {/* Bottom bar: honesty label, scroll hint, progress ring */}
        <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-between gap-4">
          <p className="label-mono text-[11px] text-steel-300/80 max-md:hidden">{modelNote}</p>
          {!still && (
            <p className={`label-mono flex flex-col items-center gap-2 text-[11px] text-steel-300 transition-opacity duration-[280ms] max-md:hidden ${activeBeat <= 0 ? "opacity-100" : "opacity-0"}`} aria-hidden>
              {scrollLabel}
              <span className="block h-7 w-px bg-gradient-to-b from-steel-300 to-transparent" />
            </p>
          )}
          {!still && (
            <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-steel-300" aria-hidden>
              <span dir="ltr">0{Math.max(0, activeBeat)} / 03</span>
              <svg viewBox="0 0 44 44" className="size-10 -rotate-90">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(243 240 232 / 0.15)" strokeWidth="3" />
                <circle ref={ringRef} cx="22" cy="22" r="18" fill="none" stroke="var(--color-patina-400)" strokeWidth="3" strokeDasharray="113.1" strokeDashoffset="113.1" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
