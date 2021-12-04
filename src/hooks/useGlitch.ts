import { useEffect, useState } from "react";
import glitch_exec, { GlitchExec } from "../glitch/glitch-execute";

const useGlitch = (glitchsCount = 1) => {
  const [glitchObjects, setGlitchObjects] = useState<GlitchExec[] | [null]>([
    null,
  ]);

  useEffect(() => {
    setGlitchObjects(
      new Array(glitchsCount).fill({}).map(() => Object.create(glitch_exec))
    );
  }, [setGlitchObjects]);

  return glitchObjects;
};

export default useGlitch;
