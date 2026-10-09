<script>
	import NumberSpinner from "svelte-number-spinner";
	import Tex from "$components/matrix/Tex.svelte";
	import { detMatrix } from "$stores/determinant.js";
	import { colorX, colorY } from "$data/variables";
	import {
		IDENTITY,
		SINGULAR_PRESET,
		determinant,
		transformedArea,
		collapseKind,
		formatNumber
	} from "$utils/determinant.js";

	// Entry range keeps every transformed vertex inside the plot
	const entryMin = -3;
	const entryMax = 3;

	// Same column colors as the original matrix input and the plot's basis vectors
	const cells = [
		{ key: "a", color: colorX },
		{ key: "b", color: colorY },
		{ key: "c", color: colorX },
		{ key: "d", color: colorY }
	];

	$: det = determinant($detMatrix);
	$: area = transformedArea($detMatrix);
	$: kind = collapseKind($detMatrix);

	// Show entries in color, wrapping negatives in parentheses
	function term(key) {
		const color = key === "a" || key === "c" ? colorX : colorY;
		const x = formatNumber($detMatrix[key]);
		return `\\textcolor{${color}}{${$detMatrix[key] < 0 ? `(${x})` : x}}`;
	}

	$: detExpr = `\\det(A) = ad - bc = ${term("a")}\\cdot${term("d")} - ${term(
		"b"
	)}\\cdot${term("c")} = ${formatNumber(det)}`;
	$: areaExpr = `\\text{Transformed area} = |\\det(A)| = ${formatNumber(area)}`;

	// NumberSpinner doesn't forward aria attributes, so label its input directly
	function labelInput(node, label) {
		node.querySelectorAll("input").forEach((input) => input.setAttribute("aria-label", label));
	}

	function setMatrix(m) {
		$detMatrix = { ...m };
	}
</script>

<div class="flex flex-col gap-6">
	<!-- Matrix input -->
	<div class="flex items-center gap-4">
		<span class="font-serif text-3xl">A =</span>
		<div class="matrix font-serif grid grid-cols-2 grid-rows-2 px-3 bg-base-200 shadow-lg shadow-neutral-content/20">
			{#each cells as cell (cell.key)}
				<div class="relative" use:labelInput={`Matrix entry ${cell.key}`}>
					<span class="absolute left-1 top-0.5 text-xs font-sans opacity-60" aria-hidden="true">
						{cell.key}
					</span>
					<NumberSpinner
						bind:value={$detMatrix[cell.key]}
						min={entryMin}
						max={entryMax}
						step={0.1}
						decimals={1}
						speed={0.1}
						class="det-spinner"
						mainStyle={`color: ${cell.color};`}
					/>
				</div>
			{/each}
		</div>
	</div>
	<p class="text-sm opacity-70 -mt-3">
		Drag an entry left/right or click to type (range {entryMin} to {entryMax}).
	</p>

	<!-- Determinant and area -->
	<div class="bg-base-200 rounded-xl px-5 py-3 text-lg flex flex-col gap-2">
		<Tex expr={detExpr} />
		<Tex expr={areaExpr} />
	</div>

	<p class="text-base leading-relaxed">
		The determinant is the <b>signed area scaling factor</b> of
		<Tex expr="A" />: every area gets multiplied by it, and a negative sign
		means the shape is flipped (mirrored). Since the unit square starts with
		area 1, the absolute value <Tex expr="|\det(A)|" /> is exactly the area of the
		transformed square.
	</p>

	<!-- Guided explanation -->
	{#if kind === "area"}
		<div class="status border-success">
			<div class="font-bold text-success">Invertible</div>
			<p>
				The transformed square has nonzero area ({formatNumber(area)}), so it still
				covers a real 2D region. The transformation is <b>invertible</b>: it can be
				undone.
			</p>
		</div>
	{:else}
		<div class="status border-error">
			<div class="font-bold text-error">Not invertible</div>
			<p>
				The determinant is 0: the unit square collapses into a
				<b>{kind === "point" ? "single point" : "line segment"}</b> with zero area.
				The transformation is <b>not invertible</b>: the plane has been squashed
				flat, and it cannot be reversed.
			</p>
		</div>
	{/if}

	<!-- Preset and reset -->
	<div class="flex flex-wrap gap-3">
		<button class="btn btn-outline btn-error" on:click={() => setMatrix(SINGULAR_PRESET)}>
			Collapse it (det = 0)
		</button>
		<button class="btn btn-outline" on:click={() => setMatrix(IDENTITY)}>
			Reset to identity
		</button>
	</div>
</div>

<style lang="postcss">
	.matrix {
		box-shadow: inset 0px 0px 0px 3px white;
	}

	.status {
		@apply border-l-4 bg-base-200 rounded-r-xl px-5 py-3 flex flex-col gap-1;
	}

	/* Matches the original MatrixInput spinner style */
	:global(.det-spinner) {
		@apply w-20 bg-base-200 px-2 py-2 text-right text-2xl transition-all selection:text-inherit;

		&:hover {
			@apply bg-base-100;
		}

		&:focus {
			@apply bg-base-100 outline-none ring-1 ring-inset ring-info;
		}
	}
</style>
