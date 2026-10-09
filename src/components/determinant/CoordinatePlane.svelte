<script>
	// Grid and axes for a square plot spanning [-bound, bound] (Version 4+).
	// Content goes in the slot and receives:
	//   pt   - maps math coords [x, y] to SVG coords (y points down in SVG)
	//   unit - scale for stroke widths and font sizes, 1 at the default bound
	import colors from "tailwindcss/colors";

	export let bound = 6.5;
	export let title = "";

	$: unit = bound / 6.5;
	// Keep roughly 6–7 gridlines per side as the plot zooms out
	$: step = bound <= 7 ? 1 : bound <= 14 ? 2 : 5;
	$: ticks = range(step, bound);
	$: labelTicks = ticks.filter((t) => t !== 0 && (t / step) % 2 === 0);

	function range(step, bound) {
		const n = Math.floor(bound / step);
		return Array.from({ length: 2 * n + 1 }, (_, i) => (i - n) * step);
	}

	const pt = ([x, y]) => [x, -y];

	const gridColor = colors.slate["700"];
	const axisColor = colors.slate["400"];
</script>

<svg
	viewBox="{-bound} {-bound} {2 * bound} {2 * bound}"
	class="w-full h-full"
	role="img"
	aria-label={title}
>
	<g stroke={gridColor} stroke-width={0.02 * unit}>
		{#each ticks as t}
			<line x1={t} y1={-bound} x2={t} y2={bound} />
			<line x1={-bound} y1={t} x2={bound} y2={t} />
		{/each}
	</g>

	<g stroke={axisColor} stroke-width={0.04 * unit}>
		<line x1={-bound} y1="0" x2={bound} y2="0" />
		<line x1="0" y1={-bound} x2="0" y2={bound} />
	</g>
	<g fill={axisColor} font-size={0.32 * unit} class="font-sans select-none">
		{#each labelTicks as t}
			<text x={t} y={0.45 * unit} text-anchor="middle">{t}</text>
			<text x={-0.2 * unit} y={-t + 0.11 * unit} text-anchor="end">{t}</text>
		{/each}
	</g>

	{#if title}
		<text
			x={-bound + 0.3 * unit}
			y={-bound + 0.6 * unit}
			font-size={0.45 * unit}
			fill="white"
			class="font-sans font-bold select-none"
		>
			{title}
		</text>
	{/if}

	<slot {pt} {unit} />
</svg>
