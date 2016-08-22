
/* global WebGLUtils */

var gl;

function initGL(canvas)
{
    try
    {
        gl = WebGLUtils.setupWebGL(canvas);
        let minSize = Math.min(window.innerWidth, window.innerHeight);

        canvas.width  = minSize;
        canvas.height = minSize;

        gl.viewportWidth = minSize;
        gl.viewportHeight = minSize;
    }
    catch (e) {}

    if (!gl)
    {
        alert("Could not initialise WebGL, sorry :-(");
    }
}
