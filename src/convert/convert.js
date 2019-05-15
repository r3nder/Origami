import * as SVG from "../../include/svg";
// import * as FOLD_SVG from "../../include/fold-svg";
import { default as ORIPA } from "../official/oripa";
// import * as Fold from "../include/fold";

let FOLD_SVG = {
	toFOLD: function(){},
	toSVG: function(){}
};

/** parser error to check against */
const pErr = (new window.DOMParser())
	.parseFromString("INVALID", "text/xml")
	.getElementsByTagName("parsererror")[0]
	.namespaceURI;

/**
 * this asynchronously or synchronously loads data from "input",
 * if necessary, converts into the FOLD format,
 * and calls "callback(fold)" with the data as the first argument.
 *
 * valid "input" arguments are:
 * - filenames ("pattern.svg")
 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
 * - SVG DOM objects (<svg> SVGElement)
 */
export const load_file = function(input, callback) {
	let type = typeof input;
	if (type === "object") {
		try {
			let fold = JSON.parse(JSON.stringify(input));
			// todo different way of checking fold format validity
			if (fold.vertices_coords == null) {
				throw "tried FOLD format, got empty object";
			}
			if (callback != null) {
				callback(fold);
			}
			return fold; // asynchronous loading was not required
		} catch(err) {
			if (input instanceof Element){
				FOLD_SVG.toFOLD(input, function(fold) {
					if (callback != null) { callback(fold); }
				});
				return; // asynchronous loading was not required
			} else {
				// console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
			}
		} 
		// finally {
		// 	return;  // currently not used. everything previous is already returning
		// }
	}
	// are they giving us a filename, or the data of an already loaded file?
	if (type === "string" || input instanceof String) {
		// try a FOLD format string
		try {
			// try .fold file format first
			let fold = JSON.parse(input);
			if (callback != null) { callback(fold); }
		} catch(err) {
			// try rendering the XML string
			let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
			if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
				let parsedSVG = xml.documentElement;
				FOLD_SVG.toFOLD(parsedSVG, function(fold) {
					if (callback != null) { callback(fold); }
				});
				return;
			}

			let extension = input.substr((input.lastIndexOf('.') + 1));
			// filename. we need to upload
			switch(extension) {
				case "fold":
					fetch(input)
						.then((response) => response.json())
						.then((data) => {
							if (callback != null) { callback(data); }
						});
				break;
				case "svg":
					SVG.load(input, function(svg) {
						FOLD_SVG.toFOLD(input, function(fold) {
							if (callback != null) { callback(fold); }
						});
					});
				break;
				case "oripa":
					// ORIPA.load(input, function(fold) {
					// 	if (callback != null) { callback(fold); }
					// });
				break;
			}
		}
	}
}

export const toFOLD = function(input, callback) {
	return load_file(input, function(fold) {
		if (callback != null) { callback(fold); }
	});
}

export const toSVG = function(input, callback) {
	let syncFold, svg, async = false;
	// attempt to load synchronously, the callback will be called regardless,
	// we need a flag to flip when the call is done, then check if the async
	// call is in progress
	syncFold = load_file(input, function(fold) {
		if (async) {
			FOLD_SVG.toSVG(input, function(svg) {
				if (callback != null) { callback(svg); }
			});
		}
	});
	async = true;
	// if the load was synchronous, syncFold will contain data. if not,
	// let the callback above finish off the conversion.
	if (syncFold !== undefined) {
		FOLD_SVG.toSVG(syncFold, function(svg) {
			if (callback != null) { callback(svg); }
		});
		// return svg;
		return;
	}
}

export const toORIPA = function(input, callback) {
	// coded for FOLD input only!!
	let fold = JSON.parse(JSON.stringify(input));
	return ORIPA.fromFold(fold);
}
