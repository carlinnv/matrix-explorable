<script>
	// Side-by-side input and output planes for two vectors u and v (Version 4+).
	// For a singular matrix, v sits on u's dashed line, so both land on the same output.
	import { tweened } from "svelte/motion";
	import { cubicOut } from "svelte/easing";
	import colors from "tailwindcss/colors";
	import CoordinatePlane from "./CoordinatePlane.svelte";
	import Arrow from "./Arrow.svelte";
	import { colorVector } from "$data/variables";
	import {
		UNIT_SQUARE,
		apply,
		transformUnitSquare,
		nullDirection,
		outputDirection,
		plotBound,
		isNearlyZero
	} from "$utils/determinant.js";

	export let matrix;
	export let u;
	export let v;
	export let colorU;
	export let colorV;

	// Copies, because input bindings mutate the store's object in place
	const tween = { duration: 500, easing: cubicOut };
	const shown = tweened({ ...matrix }, tween);
	$: shown.set({ ...matrix });

	// Output plot zooms to fit its contents (inputs always fit the default bound)
	const fitOutputs = (m, u, v) => plotBound([apply(m, u), apply(m, v), ...transformUnitSquare(m)]);
	// Start at the right zoom so the plot doesn't open clipped
	const bound = tweened(fitOutputs(matrix, u, v), tween);
	$: bound.set(fitOutputs(matrix, u, v));

	$: n = nullDirection(matrix);
	$: outDir = outputDirection(matrix);

	$: Au = apply($shown, u);
	$: Av = apply($shown, v);
	$: sameOutput = isNearlyZero(Math.hypot(...diff(apply(matrix, u), apply(matrix, v))), 1e-6);

	const diff = ([x1, y1], [x2, y2]) => [x1 - x2, y1 - y2];
	const toPoints = (pt, pts) => pts.map((p) => pt(p).join(",")).join(" ");
	// A long segment through `p` in direction `dir` (the plot clips it)
	const lineThrough = (p, dir, L) => [
		[p[0] - L * dir[0], p[1] - L * dir[1]],
		[p[0] + L * dir[0], p[1] + L * dir[1]]
	];

	// Put a label just past the tip of a vector
	function labelPos(pt, [x, y], unit) {
		const len = Math.hypot(x, y) || 1;
		return pt([x + (0.5 * unit * x) / len, y + (0.5 * unit * y) / len]);
	}

	const lineColor = colors.slate["300"];
	const surface = colors.slate["950"];
</script>

<div class="grid grid-cols-2 gap-4 h-full">
	<!-- Inputs: before A -->
	<div class="bg-base-200/40 rounded-xl min-h-0">
		<CoordinatePlane title="Input (before A)" let:pt let:unit>
			<polygon
				points={toPoints(pt, UNIT_SQUARE)}
				fill="white"
				fill-opacity="0.12"
				stroke="white"
				stroke-width="0.04"
				stroke-dasharray="0.12 0.08"
			/>

			{#if n}
				{@const [p1, p2] = lineThrough(u, n, 20).map(pt)}
				<line
					x1={p1[0]}
					y1={p1[1]}
					x2={p2[0]}
					y2={p2[1]}
					stroke={lineColor}
					stroke-width="0.05"
					stroke-dasharray="0.2 0.15"
				/>
			{/if}

			<Arrow {pt} to={u} color={colorU} />
			<Arrow {pt} to={v} color={colorV} />

			{#each [{ p: u, label: "u", color: colorU }, { p: v, label: "v", color: colorV }] as l}
				{@const [lx, ly] = labelPos(pt, l.p, unit)}
				<text
					x={lx}
					y={ly + 0.15}
					text-anchor="middle"
					font-size="0.45"
					font-style="italic"
					fill={l.color}
					stroke={surface}
					stroke-width="0.1"
					paint-order="stroke"
					class="font-serif font-bold select-none">{l.label}</text
				>
			{/each}
		</CoordinatePlane>
	</div>

	<!-- Outputs: after A -->
	<div class="bg-base-200/40 rounded-xl min-h-0">
		<CoordinatePlane title="Output (after A)" bound={$bound} let:pt let:unit>
			<polygon
				points={toPoints(pt, transformUnitSquare($shown))}
				fill={colorVector}
				fill-opacity="0.35"
				stroke={colorVector}
				stroke-width={0.07 * unit}
				stroke-linejoin="round"
			/>

			{#if outDir}
				{@const [p1, p2] = lineThrough([0, 0], outDir, 4 * $bound).map(pt)}
				<line
					x1={p1[0]}
					y1={p1[1]}
					x2={p2[0]}
					y2={p2[1]}
					stroke={lineColor}
					stroke-width={0.05 * unit}
					stroke-dasharray="{0.2 * unit} {0.15 * unit}"
				/>
			{/if}

			<!-- A·v drawn wider underneath, so both stay visible when they overlap -->
			<Arrow {pt} to={Av} color={colorV} width={0.16 * unit} head={0.42 * unit} />
			<Arrow {pt} to={Au} color={colorU} width={0.07 * unit} head={0.3 * unit} />
			{#if sameOutput}
				<circle
					cx={pt(Au)[0]}
					cy={pt(Au)[1]}
					r={0.18 * unit}
					fill={colorU}
					stroke={colorV}
					stroke-width={0.06 * unit}
				/>
			{/if}

			{#each sameOutput ? [{ p: Au, label: "A·u = A·v", color: "white" }] : [{ p: Au, label: "A·u", color: colorU }, { p: Av, label: "A·v", color: colorV }] as l}
				{@const [lx, ly] = labelPos(pt, l.p, unit)}
				<text
					x={lx}
					y={ly + 0.15 * unit}
					text-anchor="middle"
					font-size={0.45 * unit}
					fill={l.color}
					stroke={surface}
					stroke-width={0.1 * unit}
					paint-order="stroke"
					class="font-serif font-bold select-none">{l.label}</text
				>
			{/each}
		</CoordinatePlane>
	</div>
</div>
