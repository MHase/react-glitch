import glitch from "./glitch-lib";
import { getRandomInt } from "./utils";

export interface GlitchExec {
  NR_OF_GLITCHED_CANVASES: number;
  GLITCH_RENDER_COUNT: number;
  GLITCH_INTERVAL_PROGRESSIVE: number;
  GLITCH_INTERVAL_MIN: number;
  GLITCH_INTERVAL_MAX: number;
  DELAY_BETWEEN_FRAMES: number;
  DELAY_BETWEEN_GLITCHES: number;
  GLITCH_REFRESH_FRAMES_INTERVAL: number;

  refresh_glitch_frames_counter: number;
  rendered_canvases: number;
  times_rendered: number;
  glitched_canvases: HTMLCanvasElement[];
  curr_canvas: HTMLCanvasElement | null;

  __state_machine: (gl: GlitchExec) => void;

  object_to_glitch?: HTMLElement;
  glitch_frames: () => void;
  start: (obj_to_glitch?: HTMLElement) => void;

  done_callback?: () => void;
}

const glitch_exec: GlitchExec = {
  /* Global config settings */
  NR_OF_GLITCHED_CANVASES: 7,
  GLITCH_RENDER_COUNT: 0 /* 0 or negative == glitch indefinitely ; > 0 == glich & few times and stop */,
  GLITCH_INTERVAL_PROGRESSIVE: 1,
  GLITCH_INTERVAL_MIN: 500 /* millisecs */,
  GLITCH_INTERVAL_MAX: 1500 /* millisecs */,
  DELAY_BETWEEN_FRAMES: 30 /* 30 milisecs delay */,
  DELAY_BETWEEN_GLITCHES: 0,
  GLITCH_REFRESH_FRAMES_INTERVAL: 1 /* refresh glitched frames after N glitches ; 0 disables this */,

  /* From here on, it's just internal stuff */

  refresh_glitch_frames_counter: 0,
  rendered_canvases: 0,
  times_rendered: 0,
  glitched_canvases: [],
  curr_canvas: null,

  object_to_glitch: undefined,

  __state_machine: (gl) => {
    const otg = gl.object_to_glitch;

    /* If we need to render only a few times and stop, return here */
    if (
      gl.GLITCH_RENDER_COUNT > 0 &&
      gl.times_rendered >= gl.GLITCH_RENDER_COUNT
    ) {
      if (typeof gl.done_callback === "function") {
        gl.done_callback();
      }
      return;
    }

    if (gl.curr_canvas != null) {
      otg?.removeChild(gl.curr_canvas);
    }

    if (
      0 < gl.glitched_canvases.length &&
      gl.rendered_canvases < gl.glitched_canvases.length
    ) {
      gl.curr_canvas = gl.glitched_canvases[gl.rendered_canvases];
      otg?.insertBefore(gl.curr_canvas, otg?.firstChild);
      gl.rendered_canvases++;
      setTimeout(() => {
        gl.__state_machine(gl);
      }, gl.DELAY_BETWEEN_FRAMES);
    } else {
      if (
        gl.GLITCH_RENDER_COUNT > 0 &&
        gl.rendered_canvases >= gl.glitched_canvases.length
      ) {
        gl.times_rendered++;
      }

      gl.rendered_canvases = 0;

      if (gl.DELAY_BETWEEN_GLITCHES > 0) {
        setTimeout(() => {
          gl.__state_machine(gl);
        }, gl.DELAY_BETWEEN_GLITCHES);
      } else if (gl.GLITCH_INTERVAL_PROGRESSIVE && gl.GLITCH_RENDER_COUNT > 0) {
        setTimeout(() => {
          gl.__state_machine(gl);
        }, gl.times_rendered * getRandomInt(500, 1500));
      } else {
        setTimeout(() => {
          gl.__state_machine(gl);
        }, getRandomInt(gl.GLITCH_INTERVAL_MIN, gl.GLITCH_INTERVAL_MAX));
      }

      gl.curr_canvas = null;

      if (
        gl.GLITCH_REFRESH_FRAMES_INTERVAL > 0 &&
        --gl.refresh_glitch_frames_counter <= 0
      ) {
        gl.glitch_frames();
        gl.refresh_glitch_frames_counter = gl.GLITCH_REFRESH_FRAMES_INTERVAL;
      }
    }
  },

  get glitch_frames() {
    return () => {
      const gl = this;
      gl.glitched_canvases = [];

      for (let i = 0; i < gl.NR_OF_GLITCHED_CANVASES; ++i) {
        glitch(gl.object_to_glitch, {
          amount: i,
          complete: (canvas: HTMLCanvasElement) => {
            const otg = gl.object_to_glitch;
            gl.glitched_canvases.push(canvas);
            canvas.style.position = "absolute";
            // @ts-ignore
            canvas.style.top = otg.top;
            // @ts-ignore
            canvas.style.left = otg.left;
          },
          proxy: false, // we have to disable it, because by default html2canvas uses its own proxy which returns 500 - another way it to set up our own proxy
          // moreover right now use-glitch supports only self-hosted images and enabling proxy breaks whole hook if user provides external image
        });
      }
    };
  },

  get start() {
    return (obj_to_glitch: GlitchExec["object_to_glitch"]) => {
      const gl = this;

      // if obj_to_glitch is defined then assing, if not it will take default document.body
      if (obj_to_glitch) {
        gl.object_to_glitch = obj_to_glitch;
      }
      gl.glitch_frames();
      gl.__state_machine(gl);
    };
  },
};

export default glitch_exec;
