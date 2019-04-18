import {FontRenderer} from "./main"

interface ITooltipFontRenderer {
	scaleFactor: number;

	getTooltipStringWidth(str: string): number;
	getTooltipStringHeight(str: string): number;
	drawStringTooltip(str: string, x: number, y: number): void;
}

export class TooltipRenderer {
	/** The rendering context that the tooltip will be rendered onto. */
	context: CanvasRenderingContext2D;
	fontRenderer: ITooltipFontRenderer;

	private _scaleFactor = 2;

	constructor(ctx: CanvasRenderingContext2D, scaleFactor = 2, fontRenderer?: ITooltipFontRenderer) {
		this.context = ctx;
		this._scaleFactor = scaleFactor;
		if (fontRenderer == null) {
			this.fontRenderer = new FontRenderer(ctx, scaleFactor) as ITooltipFontRenderer;
		} else {
			this.fontRenderer = fontRenderer;
		}
	}

	/** The scale factor (like Minecraft's GUI scale setting) for the tooltip. Defaults to 2x. */
	get scaleFactor() {
		return this._scaleFactor;
	}

	set scaleFactor(newScale: number) {
		this._scaleFactor = newScale;
		this.fontRenderer.scaleFactor = newScale;
	}

	getTooltipWidth(str: string) {

	}

	getTooltipHeight(str: string) {

	}

	drawTooltip(text: string) {
		
		// TODO: split text and stuff
		let tooltipTextWidth = this.fontRenderer.getTooltipStringWidth(text);
		let tooltipTextHeight = this.fontRenderer.getTooltipStringHeight(text) - this._scaleFactor;

		// Orig alpha 240/255
		this.context.fillStyle = "rgba(16, 0, 16, 0.941)";
		this.context.fillRect(this._scaleFactor, 0, tooltipTextWidth + (6 * this._scaleFactor), this._scaleFactor);
		this.context.fillRect(this._scaleFactor, tooltipTextHeight + (7 * this._scaleFactor), tooltipTextWidth + (6 * this._scaleFactor), this._scaleFactor);
		this.context.fillRect(this._scaleFactor, this._scaleFactor, tooltipTextWidth + (6 * this._scaleFactor), tooltipTextHeight + (6 * this._scaleFactor));
		this.context.fillRect(0, this._scaleFactor, this._scaleFactor, tooltipTextHeight + (6 * this._scaleFactor));
		this.context.fillRect(tooltipTextWidth + (7 * this._scaleFactor), this._scaleFactor, this._scaleFactor, tooltipTextHeight + (6 * this._scaleFactor));
		
		let gradient = this.context.createLinearGradient(0, 2 * this._scaleFactor, 0, tooltipTextHeight + (6 * this._scaleFactor));
		gradient.addColorStop(0, "rgba(80, 0, 255, 0.314)");
		gradient.addColorStop(1, "rgba(40, 0, 127, 0.314)");
		this.context.fillStyle = gradient;
		this.context.fillRect(this._scaleFactor, 2 * this._scaleFactor, this._scaleFactor, tooltipTextHeight + (4 * this._scaleFactor));
		this.context.fillRect(tooltipTextWidth + (6 * this._scaleFactor), 2 * this._scaleFactor, this._scaleFactor, tooltipTextHeight + (4 * this._scaleFactor));

		// Orig alpha 80/255
		this.context.fillStyle = "rgba(80, 0, 255, 0.314)";
		this.context.fillRect(this._scaleFactor, this._scaleFactor, tooltipTextWidth + (6 * this._scaleFactor), this._scaleFactor);
		this.context.fillStyle = "rgba(40, 0, 127, 0.314)";
		this.context.fillRect(this._scaleFactor, tooltipTextHeight + (6 * this._scaleFactor), tooltipTextWidth + (6 * this._scaleFactor), this._scaleFactor);

		this.fontRenderer.drawStringTooltip(text, 3 * this._scaleFactor, 4 * this._scaleFactor);
	}
}