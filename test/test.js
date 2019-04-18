const canvas = document.getElementById("tooltip");
const ctx = canvas.getContext("2d");
canvas.width = 1400;

let renderer = new TooltipRenderer(ctx, 6);
renderer.fontRenderer.loadFontImage().then(() => {
	document.getElementById("textEntry").oninput = (e) => {
		ctx.clearRect(0, 0, 1400, 150);
		renderer.drawTooltip(e.target.value);
	};
});

