<script>
	// Plots (determinant, area) for every matrix the student tries.
	// All dots land on the same V shape: area is the size of the determinant.
	import colors from "tailwindcss/colors";
	import { colorVector } from "$data/variables";
	import { determinant, transformedArea, formatNumber } from "$utils/determinant.js";

	export let matrix;

	const maxHistory = 80;

	// Chart geometry (viewBox units ≈ px)
	const W = 420;
	const H = 240;
	const m = { top: 16, right: 16, bottom: 40, left: 40 };
	const detMax = 10;
	const areaMax = 10;

	const xTicks = [-10, -5, 0, 5, 10];
	const yTicks = [0, 5, 10];

	const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
	const x = (det) =>
		m.left + ((clamp(det, -detMax, detMax) + detMax) / (2 * detMax)) * (W - m.left - m.right);
	const y = (area) => H - m.bottom - (clamp(area, 0, areaMax) / areaMax) * (H - m.top - m.bottom);

	let history = [];
	let hovered = null;

	$: current = { det: determinant(matrix), area: transformedArea(matrix) };
	$: record(current);

	function record(p) {
		const key = `${formatNumber(p.det)}|${formatNumber(p.area)}`;
		if (history.some((h) => h.key === key)) return;
		history = [...history, { ...p, key }].slice(-maxHistory);
	}

	function clear() {
		history = [];
		record(current);
	}

	const ink = colors.slate["400"];
	const grid = colors.slate["700"];
	const surface = colors.slate["900"];
</script>

<figure class="not-prose flex flex-col gap-2">
	<svg viewBox="0 0 {W} {H}" class="w-full h-auto" role="img"
		aria-label="Chart of area against determinant for every matrix tried so far">
		<!-- Gridlines and axes -->
		{#each yTicks as t}
			<line x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)} stroke={grid} stroke-width="1" />
			<text x={m.left - 8} y={y(t) + 4} text-anchor="end" font-size="12" fill={ink}>{t}</text>
		{/each}
		{#each xTicks as t}
			<line x1={x(t)} x2={x(t)} y1={H - m.bottom} y2={H - m.bottom + 4} stroke={ink} />
			<text x={x(t)} y={H - m.bottom + 18} text-anchor="middle" font-size="12" fill={ink}>{t}</text>
		{/each}
		<line x1={x(0)} x2={x(0)} y1={m.top} y2={H - m.bottom} stroke={grid} stroke-width="1" />
		<text x={(W + m.left - m.right) / 2} y={H - 4} text-anchor="middle" font-size="12" fill={ink}>
			determinant
		</text>
		<text x="12" y={(H - m.bottom + m.top) / 2} text-anchor="middle" font-size="12" fill={ink}
			transform="rotate(-90 12 {(H - m.bottom + m.top) / 2})">
			area
		</text>

		<!-- Reference V: where every dot lands -->
		<polyline
			points="{x(-detMax)},{y(detMax)} {x(0)},{y(0)} {x(detMax)},{y(detMax)}"
			fill="none"
			stroke={ink}
			stroke-width="2"
			stroke-dasharray="4 4"
			opacity="0.6"
		/>

		<!-- Matrices tried so far -->
		{#each history as p (p.key)}
			<circle
				cx={x(p.det)}
				cy={y(p.area)}
				r="4"
				fill={colorVector}
				fill-opacity="0.55"
				stroke={surface}
				stroke-width="2"
			/>
			<!-- Larger invisible hit target -->
			<circle
				cx={x(p.det)}
				cy={y(p.area)}
				r="9"
				fill="transparent"
				role="presentation"
				on:mouseenter={() => (hovered = p)}
				on:mouseleave={() => (hovered = null)}
			/>
		{/each}

		<!-- Current matrix -->
		<circle cx={x(current.det)} cy={y(current.area)} r="7" fill={colorVector} stroke="white" stroke-width="2" />

		{#if hovered}
			{@const tx = clamp(x(hovered.det), m.left + 60, W - m.right - 60)}
			{@const ty = Math.max(y(hovered.area) - 34, m.top)}
			<g pointer-events="none">
				<rect x={tx - 58} y={ty} width="116" height="24" rx="4" fill={colors.slate["800"]} />
				<text x={tx} y={ty + 16} text-anchor="middle" font-size="12" fill="white">
					det {formatNumber(hovered.det)}, area {formatNumber(hovered.area)}
				</text>
			</g>
		{/if}
	</svg>
	<figcaption class="flex justify-between items-center text-sm opacity-80">
		<span>
			Now: determinant <b>{formatNumber(current.det)}</b>, area <b>{formatNumber(current.area)}</b>
		</span>
		<button class="btn btn-ghost btn-xs" on:click={clear}>Clear dots</button>
	</figcaption>
</figure>
