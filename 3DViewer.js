const Geometry3D = (geometryData) => {
   const vertices = geometryData.vertices;
   const faces    = geometryData.faces;
   let transformedVertices = [];
   let transformRotate     = 0;
   let transformScale      = 1;

   const transform = (s = transformScale, r = transformRotate) => {
      transformedVertices = vertices.map((v) => ({
         x: s * (v[0] * Math.cos(r) - v[1] * Math.sin(r)),
         y: s * (v[0] * Math.sin(r) + v[1] * Math.cos(r)),
         z: s * v[2]
      }));
   };

   const drawWireframe = (context, offsetX = 0, offsetY = 0) => {
      const coords = transformedVertices.map((v) => ({
         x: 0.707 * v.x - 0.707 * v.y + offsetX,
         y: 0.409 * v.x + 0.409 * v.y - 0.816 * v.z + offsetY
      }));
      faces.forEach((f) => {
         context.beginPath();
         context.moveTo(coords[f[0]].x,coords[f[0]].y);
         for(var i = (f.length - 1); i >= 0; i--) {
            context.lineTo(coords[f[i]].x,coords[f[i]].y);
         }
         context.closePath();
         context.stroke();
      });
   };

   return {
      transform, drawWireframe
   };
};

const canvasWidth  = 600;
const canvasHeight = 600;
let canvas;
let context;
const geometriesData  = [cubeData, pyramidData, chesspawnData, cylinderData, funnelsData, beadsData, coneData, sphereData, toroidData, lgbeadsData, mechpartData, rocketData];
const geometries = [];
let currentGeometry = null;

let angle = 0;
const animationLoop = () => {
   if(!currentGeometry) return;

   currentGeometry.transform(1.0, angle);
   clearCanvas();
   currentGeometry.drawWireframe(context, canvasWidth / 2, canvasHeight / 2);
   angle = (((angle * 10000) + 180) % 31415) / 10000;
};

const prepareCanvas = () => {
   const canvasDiv = document.getElementById("canvasDiv");
   canvas = document.createElement("canvas");
   canvas.setAttribute("width", canvasWidth);
   canvas.setAttribute("height", canvasHeight);
   canvas.setAttribute("id", "canvas");
   canvasDiv.appendChild(canvas);
   if(typeof G_vmlCanvasManager !== "undefined") {
      canvas = G_vmlCanvasManager.initElement(canvas);
   }

   context = canvas.getContext("2d");
   context.strokeStyle = "#00ff00";

   geometriesData.forEach((gd) => {
      geometries.push(Geometry3D(JSON.parse(gd)));
   });

   setInterval(animationLoop,20);
};

const setGeometry = (g) => {
   currentGeometry = g === null ? null : geometries[g];
   if(!currentGeometry) {
      clearCanvas();
   }
};

const clearCanvas = () => {
   context.clearRect(0, 0, canvasWidth, canvasHeight);
};