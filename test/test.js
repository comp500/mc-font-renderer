const canvas = document.getElementById("tooltip");
const ctx = canvas.getContext("2d");
canvas.width = 1400;

let renderer = new FontRenderer(ctx, 4);
renderer.loadFontImage().then(() => {
	document.getElementById("textEntry").oninput = (e) => {
		ctx.clearRect(0, 0, 1400, 150);
		renderer.drawStringFormattedShadow(e.target.value);
	};
});

