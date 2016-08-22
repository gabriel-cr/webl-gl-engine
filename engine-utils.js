/* global mat4 */
var shaderProgram;

var pMatrix = mat4.create();

var modelView = (function() {
    var mv = mat4.create();
    var mvMatrixStack = [];

    var push = function()
    {
        var copy = mat4.clone(mv);
        mvMatrixStack.push(copy);
    }

    var pop = function()
    {
        if (mvMatrixStack.length == 0)
        {
            throw "Invalid popMatrix!";
        }
        mv = mvMatrixStack.pop();
    }

    var loadIdentity = function()
    {
        mat4.identity(mv);
    }

    var translate = function(vec)
    {
        mat4.translate(mv, mv, vec);
    }

    var rotate = function(rad, axisVector)
    {
        mat4.rotate(mv, mv, rad, axisVector);
    }

    var matrix = function()
    {
        return mv
    }

    return {
        push: push,
        pop: pop,
        loadIdentity: loadIdentity,
        translate: translate,
        rotate: rotate,
        matrix: matrix
    };

})();


function initShaders(gl)
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShader(gl, id)
{
    var shaderScript = document.getElementById(id);
    if (!shaderScript)
    {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k)
    {
        if (k.nodeType == 3)
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment")
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex")
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else
    {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}