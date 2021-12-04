import { useEffect } from "react";
import useGlitch from "./hooks/useGlitch";
import "./styles.css";

export default function App() {
  const [gl] = useGlitch();

  useEffect(() => {
    // Glitch an entire page

    gl?.start(document.body);
    // * Glitch an entire page
    // gl.GLITCH_RENDER_COUNT = 3;
    // gl.done_callback = function () {
    //   alert("Stopped Glitching");
    // };
    // gl.start(document.body);
    // * Glitch individual elements
    // var gl1 = Object.create(glitch_exec);
    // gl1.start(document.getElementById("lenna1"));
    // var gl2 = Object.create(glitch_exec);
    // gl2.start(document.getElementById("lenna2"));
    // var gl3 = Object.create(glitch_exec);
    // gl3.start(document.getElementById("lenna3"));
    // var gl4 = Object.create(glitch_exec);
    // gl4.start(document.getElementById("lenna4"));
    // * Glitch an entire page 3 times and stop
    // gl.GLITCH_RENDER_COUNT = 3;
    // gl.done_callback = function() {
    //     alert("Stopped Glitching");
    // }
    // gl.start(document.body);
  }, [gl]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div
        style={{
          height: 100,
          width: 100,
          backgroundColor: "red",
          marginBottom: 32,
        }}
      />
      <div
        style={{
          height: 100,
          width: 100,
          backgroundColor: "green",
          marginBottom: 32,
        }}
      />
      <div
        style={{
          height: 100,
          width: 100,
          backgroundColor: "blue",
          marginBottom: 32,
        }}
      />
      {/* <img src="https://e7.pngegg.com/pngimages/441/36/png-clipart-two-man-holding-assault-rifles-counter-strike-global-offensive-counter-strike-source-counter-strike-video-game-infantry-thumbnail.png" />
      <div>
        <img src="https://static.wikia.nocookie.net/cswikia/images/2/24/St6_soldier.png" />
      </div> */}
      <img
        id="lenna1"
        src="http://207.154.195.207/~sandu/glitch_test/lenna.png"
      />
    </div>
  );
}
