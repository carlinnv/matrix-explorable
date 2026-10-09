<script>
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import colors from "tailwindcss/colors";
	import { colorX, colorY, colorVector } from "$data/variables";
	import {
		UNIT_SQUARE,
		transformUnitSquare,
		collapseKind,
		formatNumber
	} from "$utils/determinant.js";

	export let matrix;

	// Matrix entries are limited to [-3, 3], so vertices stay within |6|
	const bound = 6.5;
	const ticks = Array.from({ length: 13 }, (_, i) => i - 6);
	const labelTicks = ticks.filter((t) => t !== 0 && t % 2 === 0);

	// Animate the drawn matrix toward the actual one.
	// Copies, because input bindings mutate the store's object in place.
	const shown = tweened({ ...matrix }, { duration: 500, easing: cubicOut });
	$: shown.set({ ...matrix });

	// SVG y points down; math y points up
	const pt = ([x, y]) => [x, -y];
	const toPoints = (pts) => pts.map((p) => pt(p).join(",")).join(" ");

	$: square = transformUnitSquare($shown);
	$: kind = collapseKind(matrix);

	// Transformed basis vectors: columns of A
	$: basis = [
		{ to: [$shown.a, $shown.c], label: [matrix.a, matrix.c], color: colorX, id: "x" },
		{ to: [$shown.b, $shown.d], label: [matrix.b, matrix.d], color: colorY, id: "y" }
	];

	const gridColor = colors.slate["700"];
	const axisColor = colors.slate["400"];

	// Nudge a label away from the origin along its vector
	function labelPos([x, y]) {
		const len = Math.hypot(x, y) || 1;
		return pt([x + (0.45 * x) / len, y + (0.45 * y) / len]);
	}
</script>

<svg
	viewBox="{-bound} {-bound} {2 * bound} {2 * bound}"
	class="w-full h-full"
	role="img"
	aria-label="Unit square and its image under the matrix A"
>
	<defs>
		{#each [{ id: "x", color: colorX }, { id: "y", color: colorY }] as m}
			<marker
				id="arrow-{m.id}"
				viewBox="0 0 10 10"
				refX="8"
				refY="5"
				markerWidth="4"
				markerHeight="4"
				orient="auto-start-reverse"
			>
				<path d="M 0 0 L 10 5 L 0 10 z" fill={m.color} />
			</marker>
		{/each}
	</defs>

	<!-- Grid -->
	<g stroke={gridColor} stroke-width="0.02">
		{#each ticks as t}
			<line x1={t} y1={-bound} x2={t} y2={bound} />
			<line x1={-bound} y1={t} x2={bound} y2={t} />
		{/each}
	</g>

	<!-- Axes -->
	<g stroke={axisColor} stroke-width="0.04">
		<line x1={-bound} y1="0" x2={bound} y2="0" />
		<line x1="0" y1={-bound} x2="0" y2={bound} />
	</g>
	<g fill={axisColor} font-size="0.32" class="font-sans select-none">
		{#each labelTicks as t}
			<text x={t} y="0.45" text-anchor="middle">{t}</text>
			<text x="-0.2" y={-t + 0.11} text-anchor="end">{t}</text>
		{/each}
		<text x={bound - 0.2} y="-0.2" text-anchor="end" font-style="italic">x</text>
		<text x="0.2" y={-bound + 0.45} font-style="italic">y</text>
	</g>

	<!-- Original unit square fill (outline is drawn on top, below) -->
	<polygon points={toPoints(UNIT_SQUARE)} fill="white" fill-opacity="0.12" />

	<!-- Transformed unit square -->
	<polygon
		points={toPoints(square)}
		fill={colorVector}
		fill-opacity="0.35"
		stroke={colorVector}
		stroke-width="0.07"
		stroke-linejoin="round"
	/>
	{#if kind === "point"}
		<circle cx="0" cy="0" r="0.15" fill={colorVector} />
	{/if}

	<!-- Original unit square outline stays visible as a reference -->
	<polygon
		points={toPoints(UNIT_SQUARE)}
		fill="none"
		stroke="white"
		stroke-width="0.04"
		stroke-dasharray="0.12 0.08"
	/>

	<!-- Transformed basis vectors -->
	{#each basis as v (v.id)}
		{#if Math.hypot(...v.to) > 0.05}
			{@const [x, y] = pt(v.to)}
			{@const [lx, ly] = labelPos(v.to)}
			<line
				x1="0"
				y1="0"
				x2={x}
				y2={y}
				stroke={v.color}
				stroke-width="0.07"
				marker-end="url(#arrow-{v.id})"
			/>
			<text
				x={lx}
				y={ly + 0.11}
				text-anchor="middle"
				font-size="0.34"
				fill={v.color}
				class="font-sans font-bold select-none"
			>
				({formatNumber(v.label[0])}, {formatNumber(v.label[1])})
			</text>
		{/if}
	{/each}
</svg>
