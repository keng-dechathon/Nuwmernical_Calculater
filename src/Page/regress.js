

const { regression } = require("multiregress");
// const result = regression.linear([[10, 5], [15, 9], [20,15],[30,18],[40,22],[60,30],[60,35],[70,38],[80,43]]);
// const gradient = result.equation[0];
// const yIntercept = result.equation[1];
// console.log(result);
// console.log(gradient);
// console.log(yIntercept);

// console.log(regression([[1, 1, 0], [2, -4, -1], [0, 0, 0]]));
const Spline = require('cubic-spline');
 
const xs = [2, 4, 6, 8, 10];
const ys = [9.5, 8, 10.5, 39.5, 72.5];
 
// new a Spline object
const spline = new Spline(xs, ys);
 
// get Y at arbitrary X
console.log(spline);
 
// interpolate a line at a higher resolution
for (let i = 0; i < 50; i++) {
  console.log(spline.at(i * 0.1));
}