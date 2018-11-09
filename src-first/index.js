
// import './Graph.js';
// import './PlanarGraph.js';
// import './Geometry.js';

import * as Geometry from './geometry.js'

import {VoronoiGraph, creaseVoronoi} from './voronoi.js';
import './polynomial.js';

import CreasePattern from './CreasePattern.js';

import {line, circle, polygon, group, addClass, removeClass} from './SimpleSVG.js';

import OrigamiPaper from './OrigamiPaper.js';
import OrigamiFold from './OrigamiFold.js';
import * as Origami from './Origami.js';

// for convenience, bind these 3 to the window
window.CreasePattern = CreasePattern;
window.OrigamiPaper = OrigamiPaper;
window.OrigamiFold = OrigamiFold;
window.Origami = Origami;

// figure out how to insert comment header "// Rabbit Ear https://rabbitear.org v0.1.1 Copyright 2018 Robby Kraft";

// export { CreasePattern, OrigamiPaper, OrigamiFold }
export {
	CreasePattern, OrigamiPaper, OrigamiFold, VoronoiGraph, creaseVoronoi,
	line, circle, polygon, group, addClass, removeClass,
	Geometry,
	Origami
}