const scaleFactor = 3;
const fontHeight = 9;
const glyphSizes = "6666664666666664467666666111111142566663555626266666666666225656766666666466666666666666666464663666665662653666666646666665257666666666666463666666666666666646636666666766626689966688688888669999999999999999999999999699959987787888788799677777967876697671";

const canvas = document.getElementById("tooltip");
const ctx = canvas.getContext("2d");
canvas.width = 1400;

let getCharIndex = (char) => {
	return "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000".indexOf(char);
};

let getCharWidth = (char) => {
	if (char == " " || char.charCodeAt(0) == 160) {
		return 4;
	}

	let i = getCharIndex(char);
	if (i > -1) {
		return parseInt(glyphSizes[i], 16);
	} else {
		return 0;
	}
};

let getStringWidth = (str, bold) => {
	let width = 0;
	for (let i = 0; i < str.length; i++) {
		width += getCharWidth(str[i]);
		if (bold) {
			width++;
		}
	}
	return width;
};

const fontCanvas = document.createElement("canvas");
const scratchpadCanvas = document.createElement("canvas");
scratchpadCanvas.height = fontHeight * scaleFactor;
const scratchpadCtx = scratchpadCanvas.getContext("2d");
const font = new Image();
let fontCtx;
font.addEventListener("load", function() {
	fontCanvas.width = font.width * scaleFactor;
	fontCanvas.height = font.height * scaleFactor;
	
	fontCtx = fontCanvas.getContext("2d");
	fontCtx.mozImageSmoothingEnabled = false;
	fontCtx.webkitImageSmoothingEnabled = false;
	fontCtx.msImageSmoothingEnabled = false;
	fontCtx.imageSmoothingEnabled = false;


	fontCtx.drawImage(font, 0, 0, font.width * scaleFactor, font.height * scaleFactor);
	let currentX = 1;
	let currentY = 0;

	let drawChar = (char, bold) => {
		let i = getCharIndex(char);
		if (i > -1) {
			let charColumn = i % 16;
			let charRow = ~~(i / 16); // ~~ makes it an int
			scratchpadCtx.drawImage(fontCanvas, charColumn * 8 * scaleFactor, charRow * 8 * scaleFactor, 8 * scaleFactor, 8 * scaleFactor, currentX * scaleFactor, currentY * scaleFactor, 8 * scaleFactor, 8 * scaleFactor);
			if (bold) {
				currentX++;
				scratchpadCtx.drawImage(fontCanvas, charColumn * 8 * scaleFactor, charRow * 8 * scaleFactor, 8 * scaleFactor, 8 * scaleFactor, currentX * scaleFactor, currentY * scaleFactor, 8 * scaleFactor, 8 * scaleFactor);
				currentX += getCharWidth(char);
			} else {
				currentX += getCharWidth(char);
			}
		}
	};

	let drawDecoration = (style) => {
		if (style.underline) {
			scratchpadCtx.fillRect(0, scratchpadCanvas.height - scaleFactor, scratchpadCanvas.width, scaleFactor);
		}
		if (style.strikethrough) {
			scratchpadCtx.fillRect(scaleFactor, 3 * scaleFactor, scratchpadCanvas.width - scaleFactor, scaleFactor);
		}
	};

	let getFillStyle = (style) => {
		if (style.color == null) {
			style.color = "f";
		}
		if (style.shadow) {
			return {
				"0": "#000",
				"1": "#00002a",
				"2": "#002a00",
				"3": "#002a2a",
				"4": "#2a0000",
				"5": "#2a002a",
				"6": "#2a2a00",
				"7": "#2a2a2a",
				"8": "#151515",
				"9": "#15153f",
				"a": "#153f15",
				"b": "#153f3f",
				"c": "#3f1515",
				"d": "#3f153f",
				"e": "#3f3f15",
				"f": "#3f3f3f"
			}[style.color];
		} else {
			return {
				"0": "#000",
				"1": "#00a",
				"2": "#0a0",
				"3": "#0aa",
				"4": "#a00",
				"5": "#a0a",
				"6": "#fa0",
				"7": "#aaa",
				"8": "#555",
				"9": "#55f",
				"a": "#5f5",
				"b": "#5ff",
				"c": "#f55",
				"d": "#f5f",
				"e": "#ff5",
				"f": null // No coloring required
			}[style.color];
		}
	};

	let drawString = (str, x, y, style) => {
		if (style == null) {
			style = {};
		}
		if (x == null) x = 0;
		if (y == null) y = 0;
		// Set scratchpad width, +1 for underline
		scratchpadCanvas.width = (getStringWidth(str, style.bold) + 1) * scaleFactor;
		// Draw text
		for (let i = 0; i < str.length; i++) {
			drawChar(str[i], style.bold);
		}
		drawDecoration(style);
		// Paint colour by compositing colour on top
		let fillStyle = getFillStyle(style);
		if (fillStyle != null) {
			scratchpadCtx.globalCompositeOperation = "source-in";
			scratchpadCtx.fillStyle = fillStyle;
			scratchpadCtx.fillRect(0, 0, scratchpadCanvas.width, scratchpadCanvas.height);
			scratchpadCtx.globalCompositeOperation = "source-over";	
		}
		// Copy
		if (!style.italic) {
			ctx.drawImage(scratchpadCanvas, x * scaleFactor, y * scaleFactor);
		} else {
			// Slanted copying if italic
			ctx.drawImage(scratchpadCanvas, 0, 0, scratchpadCanvas.width, scaleFactor * 3, scaleFactor + (x * scaleFactor), y * scaleFactor, scratchpadCanvas.width, scaleFactor * 3);
			ctx.drawImage(scratchpadCanvas, 0, scaleFactor * 3, scratchpadCanvas.width, (fontHeight * scaleFactor) - (scaleFactor * 3), x * scaleFactor, (scaleFactor * 3) + (y * scaleFactor), scratchpadCanvas.width, (fontHeight * scaleFactor) - (scaleFactor * 3));
		}
		// Clean up
		scratchpadCtx.clearRect(0, 0, scratchpadCanvas.width, scratchpadCanvas.height);
		currentX = 1;
		currentY = 0;
	};

	let drawStringFormatted = (str, x, y, shadow) => {
		let currStr = "";
		let seenFormattingChar = false;
		let styleOrig = {};
		if (shadow) {
			styleOrig.shadow = true;
		}
		let currentStyle = styleOrig;
		let currX = x;
		for (let i = 0; i < str.length; i++) {
			if (!seenFormattingChar) {
				if (str.charCodeAt(i) == 167) {
					seenFormattingChar = true;
					if (currStr.length > 0) {
						drawString(currStr, currX, y, currentStyle);
						currX += getStringWidth(currStr, currentStyle.bold);
						currStr = "";
					}
				} else {
					currStr += str[i];
				}
			} else {
				if (/[\da-f]/.test(str[i])) {
					currentStyle = styleOrig;
					currentStyle.color = str[i];
				} else {
					switch (str[i]) {
						case "k":
							// Do nothing
							break;
						case "l":
							currentStyle.bold = true;
							break;
						case "m":
							currentStyle.strikethrough = true;
							break;
						case "n":
							currentStyle.underline = true;
							break;
						case "o":
							currentStyle.italic = true;
							break;
						case "r":
							currentStyle = styleOrig;
							break;
						default:
							currStr += "\u0167" + str[i]; // Leave it
					}
				}
				seenFormattingChar = false;
			}
		}
		if (currStr.length > 0) { // Draw remainder
			drawString(currStr, currX, y, currentStyle);
		}
	};

	let drawStringFormattedShadow = (str, x, y) => {
		drawStringFormatted(str, x+1, y+1, true);
		drawStringFormatted(str, x, y, false);
	};

	//drawString("Woah!", 0, 0, {bold: true});
	//drawString("Whoa!", 30, 0);
	console.log("§1R§2e§3d§4s§5t§6o§7n§8e §9C§ar§be§ca§dt§ei§fo§1n§2s");
	//drawStringFormatted("§1R§2e§3d§4s§5t§6o§7n§8e §9C§ar§be§ca§dt§ei§fo§1n§2s", 0, 0);
	window.test = drawStringFormattedShadow;
	
}, false);
font.src = "ascii.png";