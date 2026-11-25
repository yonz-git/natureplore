const GAIN = 3;
const INTENSITY = 0.5;
const RADIUS = 0.3;
const PAD = 60;

const VERT = `attribute vec2 p; varying vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision highp float;
uniform sampler2D text; uniform vec2 size, mouse, velocity; uniform float radius;
varying vec2 uv;
void main() {
  vec2 at = uv * size;
  float near = smoothstep(radius, 0.0, length(at - mouse));
  gl_FragColor = texture2D(text, (at - velocity * near) / size);
}`;

export function warpText(line: HTMLElement, chars: HTMLElement[]) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "absolute",
    left: "0",
    top: `${-PAD}px`,
    width: "100%",
    height: `calc(100% + ${PAD * 2}px)`,
    pointerEvents: "none",
    visibility: "hidden",
  });
  let live = false;
  const show = (on: boolean) => {
    if (on === live) return;
    live = on;
    canvas.style.visibility = on ? "visible" : "hidden";
    for (const c of chars) c.style.visibility = on ? "hidden" : "";
  };

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  const u = (name: string) => gl.getUniformLocation(prog, name);
  const uSize = u("size"), uMouse = u("mouse"), uVelocity = u("velocity"), uRadius = u("radius");

  let w = 0, h = 0;
  const draw = () => {
    const box = canvas.getBoundingClientRect();
    if (!box.width) return;
    const dpr = Math.min(devicePixelRatio, 2);
    w = box.width;
    h = box.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const paper = document.createElement("canvas");
    paper.width = canvas.width;
    paper.height = canvas.height;
    const ctx = paper.getContext("2d")!;
    const css = getComputedStyle(line);
    ctx.scale(dpr, dpr);
    ctx.font = `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
    ctx.fillStyle = css.color;
    ctx.textBaseline = "alphabetic";
    const m = ctx.measureText("N");
    const glyph = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    for (const c of chars) {
      const r = c.getBoundingClientRect();
      const base = r.top - box.top + (r.height - glyph) / 2 + m.fontBoundingBoxAscent;
      ctx.fillText(c.textContent ?? "", r.left - box.left, base);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paper);
    gl.uniform2f(uSize, w, h);
  };

  const mouse = { x: -1e4, y: -1e4 };
  let last = { ...mouse };
  let vx = 0, vy = 0, strength = 0, drawn = false;
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "touch") Object.assign(mouse, { x: e.clientX, y: e.clientY });
  };
  const frame = () => {
    if (!w) return;
    const moving = last.x > -1e4 && scrollY === 0;
    const dx = moving ? mouse.x - last.x : 0, dy = moving ? mouse.y - last.y : 0;
    last = { ...mouse };
    const on = dx !== 0 || dy !== 0;
    vx += (dx * GAIN - vx) * 0.15;
    vy += (dy * GAIN - vy) * 0.15;
    strength += ((on ? 1 : 0) - strength) * (on ? 0.15 : 0.03);
    const pull = strength * INTENSITY;
    const moved = Math.abs(vx * pull) + Math.abs(vy * pull) >= 0.05;
    if (drawn && !moved) return show(false);
    drawn = true;
    const box = canvas.getBoundingClientRect();
    gl.uniform2f(uMouse, mouse.x - box.left, box.bottom - mouse.y);
    gl.uniform2f(uVelocity, vx * pull, -vy * pull);
    gl.uniform1f(uRadius, innerHeight * RADIUS);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (moved) show(true);
  };
  const resize = () => {
    draw();
    drawn = false;
  };

  line.append(canvas);
  draw();
  addEventListener("pointermove", move, { passive: true });
  addEventListener("resize", resize);
  return {
    frame,
    stop() {
      removeEventListener("pointermove", move);
      removeEventListener("resize", resize);
      show(false);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
