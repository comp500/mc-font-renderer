const fontHeight = 9;
const glyphSizes = "6666664666666664467666666111111142566663555626266666666666225656766666666466666666666666666464663666665662653666666646666665257666666666666463666666666666666646636666666766626689966688688888669999999999999999999999999699959987787888788799677777967876697671";

// TODO: support unicode

/**
 *  FontStyle defines the style of a text component, used in [[drawString]].
*/
export class FontStyle {
	/** The color code for this text. */
	color = "f";
	/** If this is true, the background colors are returned in [[getFillStyle]]. Use [[drawStringFormattedShadow]] to automatically draw a shadow. */
	shadow = false;
	bold = false;
	strikethrough = false;
	underline = false;
	italic = false;

	/** Get the canvas fillStyle for this text, or `null` if no coloring is required (`ascii.png` is white, so no coloring is required for white). */
	getFillStyle(): string | null {
		if (this.color == null) {
			this.color = "f";
		}
		if (this.shadow) {
			return ({
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
			} as {[key: string]: string})[this.color];
		} else {
			return ({
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
			} as {[key: string]: string | null})[this.color];
		}
	}
}

// Define vendor prefixes for the canvas (so TS doesn't complain)
interface CanvasContextPrefixed extends CanvasRenderingContext2D {
	mozImageSmoothingEnabled: boolean;
	webkitImageSmoothingEnabled: boolean;
	msImageSmoothingEnabled: boolean;
}

/**
 * FontRenderer renders Minecraft Font text onto the given 2D canvas context.
 * 
 * You must call [[loadFontImage]] to load the font onto the internal canvas.
 * Example:
 * 
 * 	let renderer = new FontRenderer(ctx);
 * 	renderer.loadFontImage();
 * 	renderer.drawStringFormatted("Hello!");
 */
export default class FontRenderer {
	/** The rendering context that the text will be rendered onto. */
	context: CanvasRenderingContext2D;

	private _scaleFactor: number = 2;

	private fontCanvas: HTMLCanvasElement;
	private fontCtx: CanvasContextPrefixed;
	private scratchpadCanvas: HTMLCanvasElement;
	private scratchpadCtx: CanvasRenderingContext2D;

	private currentX: number;
	private currentY = 0;

	/** Creates a FontRenderer with a given 2D canvas context, and an optional scale factor for displaying text. */
	constructor(ctx: CanvasRenderingContext2D, scaleFactor = 2) {
		this.context = ctx;
		this._scaleFactor = scaleFactor;
		this.currentX = scaleFactor;

		this.fontCanvas = document.createElement("canvas");
		this.fontCtx = this.fontCanvas.getContext("2d")! as CanvasContextPrefixed;
		this.fontCtx.mozImageSmoothingEnabled = false;
		this.fontCtx.webkitImageSmoothingEnabled = false;
		this.fontCtx.msImageSmoothingEnabled = false;
		this.fontCtx.imageSmoothingEnabled = false;

		this.scratchpadCanvas = document.createElement("canvas");
		this.scratchpadCanvas.height = fontHeight * scaleFactor;
		this.scratchpadCtx = this.scratchpadCanvas.getContext("2d")!;
	}

	/** The scale factor (like Minecraft's GUI scale setting) for text. Defaults to 2x. */
	get scaleFactor() {
		return this._scaleFactor;
	}

	set scaleFactor(newScale: number) {
		this.scaleFactor = newScale;
		this.scratchpadCtx.clearRect(0, 0, this.scratchpadCanvas.width, this.scratchpadCanvas.height);
		this.currentX = newScale;
		this.currentY = 0;
	}

	private static getCharIndex(char: string): number {
		return "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000".indexOf(char);
	}
	
	/** Get the width that a single character (not bolded) will take up on the canvas. */
	getCharWidth(char: string): number {
		if (char == " " || char.charCodeAt(0) == 160) {
			return 4 * this._scaleFactor;
		}
	
		let i = FontRenderer.getCharIndex(char);
		if (i > -1) {
			return parseInt(glyphSizes[i], 16) * this._scaleFactor;
		} else {
			return 0;
		}
	}
	
	// TODO: implement formatted text getStringWidth
	/** Get the width that a string component will take up on the canvas. Do not use this for formatted text. */
	getStringWidth(str: string, bold: boolean): number {
		let width = 0;
		for (let i = 0; i < str.length; i++) {
			width += this.getCharWidth(str[i]);
			if (bold) {
				width += this._scaleFactor;
			}
		}
		return width;
	}

	/** Loads the `ascii.png` image into the internal font canvas. Takes an optional src parameter to change the location of `ascii.png`. */
	loadFontImage(src = "ascii.png") {
		return new Promise<void>((resolve, reject) => {
			let font = new Image();
			font.addEventListener("load", () => {
				this.fontCanvas.width = font.width * this._scaleFactor;
				this.fontCanvas.height = font.height * this._scaleFactor;

				this.fontCtx.drawImage(font, 0, 0, font.width * this._scaleFactor, font.height * this._scaleFactor);
				resolve();
			}, false);
			font.addEventListener("error", (e) => {
				reject(e);
			});
			font.src = src;
		});
	}

	private drawChar(char: string, bold: boolean) {
		let i = FontRenderer.getCharIndex(char);
		if (i > -1) {
			let charColumn = i % 16;
			let charRow = ~~(i / 16); // ~~ makes it an int
			this.scratchpadCtx.drawImage(this.fontCanvas, charColumn * 8 * this._scaleFactor, charRow * 8 * this._scaleFactor, 8 * this._scaleFactor, 8 * this._scaleFactor, this.currentX, this.currentY, 8 * this._scaleFactor, 8 * this._scaleFactor);
			if (bold) {
				this.currentX += this._scaleFactor;
				this.scratchpadCtx.drawImage(this.fontCanvas, charColumn * 8 * this._scaleFactor, charRow * 8 * this._scaleFactor, 8 * this._scaleFactor, 8 * this._scaleFactor, this.currentX, this.currentY, 8 * this._scaleFactor, 8 * this._scaleFactor);
				this.currentX += this.getCharWidth(char);
			} else {
				this.currentX += this.getCharWidth(char);
			}
		}
	};

	private drawDecoration(style: FontStyle) {
		if (style.underline) {
			this.scratchpadCtx.fillRect(0, this.scratchpadCanvas.height - this._scaleFactor, this.scratchpadCanvas.width, this._scaleFactor);
		}
		if (style.strikethrough) {
			this.scratchpadCtx.fillRect(this._scaleFactor, 3 * this._scaleFactor, this.scratchpadCanvas.width - this._scaleFactor, this._scaleFactor);
		}
	};

	/** Draws a string component at the given position with a given FontStyle. It is recommended to use [[drawStringFormatted]] or [[drawStringFormattedShadow]] instead. */
	drawString(str: string, x = 0, y = 0, style = new FontStyle()) {
		// Set scratchpad width, +1 for underline
		this.scratchpadCanvas.width = this.getStringWidth(str, style.bold) + this._scaleFactor;
		// Draw text
		for (let i = 0; i < str.length; i++) {
			this.drawChar(str[i], style.bold);
		}
		this.drawDecoration(style);
		// Paint colour by compositing colour on top
		let fillStyle = style.getFillStyle();
		if (fillStyle != null) {
			this.scratchpadCtx.globalCompositeOperation = "source-in";
			this.scratchpadCtx.fillStyle = fillStyle;
			this.scratchpadCtx.fillRect(0, 0, this.scratchpadCanvas.width, this.scratchpadCanvas.height);
			this.scratchpadCtx.globalCompositeOperation = "source-over";	
		}
		// Copy
		if (!style.italic) {
			this.context.drawImage(this.scratchpadCanvas, x, y);
		} else {
			// Slanted copying if italic
			this.context.drawImage(this.scratchpadCanvas, 0, 0, this.scratchpadCanvas.width, this._scaleFactor * 3, x + this._scaleFactor, y, this.scratchpadCanvas.width, this._scaleFactor * 3);
			this.context.drawImage(this.scratchpadCanvas, 0, this._scaleFactor * 3, this.scratchpadCanvas.width, (fontHeight * this._scaleFactor) - (this._scaleFactor * 3), x, (this._scaleFactor * 3) + y, this.scratchpadCanvas.width, (fontHeight * this._scaleFactor) - (this._scaleFactor * 3));
		}
		// Clean up
		this.scratchpadCtx.clearRect(0, 0, this.scratchpadCanvas.width, this.scratchpadCanvas.height);
		this.currentX = this._scaleFactor;
		this.currentY = 0;
	}

	/** Draws a string (parsed for formatting codes) at a given position. Takes an optional shadow argument to display with darker colors, although [[drawStringFormattedShadow]] handles adding the shadow for you. */
	drawStringFormatted(str: string, x = 0, y = 0, shadow = false) {
		let currStr = "";
		let seenFormattingChar = false;
		let styleOrig = new FontStyle();
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
						this.drawString(currStr, currX, y, currentStyle);
						currX += this.getStringWidth(currStr, currentStyle.bold);
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
			this.drawString(currStr, currX, y, currentStyle);
		}
	}

	/** Draws a string (parsed for formatting codes) at a given position, with a shadow added behind it. */
	drawStringFormattedShadow(str: string, x = 0, y = 0) {
		this.drawStringFormatted(str, x+this._scaleFactor, y+this._scaleFactor, true);
		this.drawStringFormatted(str, x, y, false);
	}
}