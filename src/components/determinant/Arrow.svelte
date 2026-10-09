<svelte:options namespace="svg" />

<script>
	// Arrow from `from` to `to` in math coords, drawn inside a CoordinatePlane
	export let pt;
	export let to;
	export let from = [0, 0];
	export let color;
	export let width = 0.07;
	export let head = 0.3;

	$: [x1, y1] = pt(from);
	$: [x2, y2] = pt(to);
	$: len = Math.hypot(x2 - x1, y2 - y1);
	$: [ux, uy] = len > 0 ? [(x2 - x1) / len, (y2 - y1) / len] : [0, 0];
	// Base of the arrowhead, and its half-width perpendicular to the shaft
	$: [bx, by] = [x2 - head * ux, y2 - head * uy];
	$: [px, py] = [-uy * head * 0.5, ux * head * 0.5];
</script>

{#if len > head * 0.5}
	<line {x1} {y1} x2={bx} y2={by} stroke={color} stroke-width={width} stroke-linecap="round" />
	<polygon points="{x2},{y2} {bx + px},{by + py} {bx - px},{by - py}" fill={color} />
{/if}
