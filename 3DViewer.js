class Geometry3D {
   constructor(geometryData) {
      this.vertices            = geometryData.vertices;
      this.faces               = geometryData.faces;
      this.transformedVertices = new Array();
      this.transformRotate     = 0;
      this.transformScale      = 1;
   }

   transform(s = this.transformScale, r = this.transformRotate) {
      this.transformedVertices = new Array();
      this.vertices.forEach((v) => {
         this.transformedVertices.push({x: s * (v[0] * Math.cos(r) - v[1] * Math.sin(r)), y: s * (v[0] * Math.sin(r) + v[1] * Math.cos(r)), z: s * v[2]});
      });
   }

   drawWireframe(context, offsetX = 0, offsetY = 0) {
      var coords = new Array();
      this.transformedVertices.forEach((v) => {
         coords.push({x: 0.707 * v.x - 0.707 * v.y + offsetX, y: 0.409 * v.x + 0.409 * v.y - 0.816 * v.z + offsetY});
      });
      this.faces.forEach((f) => {
         context.beginPath();
         context.moveTo(coords[f[0]].x,coords[f[0]].y);
         for(var i = (f.length - 1); i >= 0; i--) {
            context.lineTo(coords[f[i]].x,coords[f[i]].y);
         }
         context.closePath();
         context.stroke();
      });
   }
}

const canvasWidth  = 600;
const canvasHeight = 600;
var canvas;
var context;
var geometriesData  = [cubeData, pyramidData, chesspawnData, cylinderData, funnelsData, beadsData, coneData, sphereData, toroidData, lgbeadsData, mechpartData, rocketData];
var geometries      = new Array();
var currentGeometry = null;

var angle = 0;
function animationLoop() {
   if(currentGeometry == null) return;

   currentGeometry.transform(1.0, angle);
   clearCanvas();
   currentGeometry.drawWireframe(context, canvasWidth / 2, canvasHeight / 2);
   angle = (((angle * 10000)+180) % 31415) / 10000;
}

function prepareCanvas()
{
   var canvasDiv = document.getElementById("canvasDiv");
   canvas = document.createElement("canvas");
   canvas.setAttribute("width", canvasWidth);
   canvas.setAttribute("height", canvasHeight);
   canvas.setAttribute("id", "canvas");
   canvasDiv.appendChild(canvas);
   if(typeof G_vmlCanvasManager != "undefined") {
      canvas = G_vmlCanvasManager.initElement(canvas);
   }

   context = document.getElementById("canvas").getContext("2d");

   context.strokeStyle = "#00ff00";

   geometriesData.forEach((gd) => {
      geometries.push(new Geometry3D(JSON.parse(gd)));
   });

   setInterval(animationLoop,20);
}

function setGeometry(g) {
   currentGeometry = (g == null) ? null : geometries[g];
   if(null == currentGeometry) {
      clearCanvas();
   }
}

function clearCanvas()
{
   context.clearRect(0, 0, canvasWidth, canvasHeight);
}