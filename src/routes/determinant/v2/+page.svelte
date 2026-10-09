<script>
	// Version 2: scroll-driven steps
	// 1. matrix → unit square area, 2. area ↔ determinant (no formula), 3. det = 0
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import { base } from "$app/paths";
	import inView from "$actions/inView.js";
	import Meta from "$components/Meta.svelte";
	import Tex from "$components/matrix/Tex.svelte";
	import Action from "$components/matrix/Action.svelte";
	import ColorText from "$components/matrix/ColorText.svelte";
	import UnitSquarePlot from "$components/determinant/UnitSquarePlot.svelte";
	import MatrixEntryInput from "$components/determinant/MatrixEntryInput.svelte";
	import AreaDetChart from "$components/determinant/AreaDetChart.svelte";
	import { detMatrix } from "$stores/determinant.js";
	import {
		IDENTITY,
		SINGULAR_PRESET,
		determinant,
		transformedArea,
		collapseKind,
		scaleColumn,
		swapColumns,
		entriesInRange,
		formatNumber
	} from "$utils/determinant.js";

	const entryMin = -3;
	const entryMax = 3;

	// Which scroll step is in the middle of the screen
	let active = 1;
	// Steps count as "in view" once they cross a band around the screen's middle
	let band = 300;
	onMount(() => (band = window.innerHeight * 0.45));

	$: det = determinant($detMatrix);
	$: area = transformedArea($detMatrix);
	$: kind = collapseKind($detMatrix);

	$: stretched = scaleColumn($detMatrix, 0, 2);
	$: canStretch = entriesInRange(stretched, entryMin, entryMax);

	function setMatrix(m) {
		$detMatrix = { ...m };
	}

	const flyIn = { x: -20, duration: 300 };
</script>

<Meta
	title="Determinants & Invertibility | The Matrix Arcade"
	description="See how a 2x2 matrix transforms the unit square, and why a zero determinant means the matrix is not invertible."
/>

<!-- The global body style hides overflow on large screens, so this wrapper scrolls -->
<div class="h-screen overflow-y-auto bg-base-300">
	<div class="flex">
		<!-- Sticky visualization -->
		<div class="sticky top-0 h-screen flex-1 min-w-0 flex flex-col gap-4 p-6">
			<div class="flex flex-wrap items-center gap-x-8 gap-y-3">
				<MatrixEntryInput min={entryMin} max={entryMax} />

				<div class="flex flex-col gap-1 text-xl">
					<div>
						Area of blue shape: <b class="text-2xl">{formatNumber(area)}</b>
					</div>
					{#if active >= 2}
						<div transition:fly={flyIn}>
							<Tex expr="\det(A)" />: <b class="text-2xl">{formatNumber(det)}</b>
						</div>
					{/if}
					{#if active >= 3}
						<div transition:fly={flyIn} class="font-bold {kind === 'area' ? 'text-success' : 'text-error'}">
							{kind === "area" ? "✓ Invertible" : "✗ Not invertible"}
						</div>
					{/if}
				</div>

				<button class="btn btn-sm btn-outline ml-auto" on:click={() => setMatrix(IDENTITY)}>
					Reset
				</button>
			</div>

			<div class="flex-1 min-h-0 bg-base-200/40 rounded-xl">
				<UnitSquarePlot matrix={$detMatrix} showArea />
			</div>
		</div>

		<!-- Scrolling steps -->
		<article class="w-[36rem] shrink-0 bg-gradient-to-l from-base-100 via-base-300 via-90% px-10 py-12">
			<header class="flex flex-col gap-3 mb-[20vh]">
				<a href="{base}/" class="link link-hover text-sm opacity-70">← Back to The Matrix Arcade</a>
				<h1 class="font-display text-4xl">Determinants & Invertibility</h1>
				<p class="opacity-70">Scroll down to explore.</p>
			</header>

			<!-- Step 1 -->
			<section
				class="step prose prose-lg"
				class:inactive={active !== 1}
				use:inView={{ top: band, bottom: band }}
				on:enter={() => (active = 1)}
			>
				<h2>1. Transform the unit square</h2>
				<p>
					The dashed square is the <b>unit square</b>. It is built from the basis
					vectors (1, 0) and (0, 1), and its area is 1.
				</p>
				<p>
					A matrix sends (1, 0) to its <ColorText color="p">first column</ColorText>
					and (0, 1) to its <ColorText color="s">second column</ColorText>. The square
					follows along and becomes the blue shape.
				</p>
				<Action>
					<p class="m-0">
						Drag the matrix entries left and right. Can you make the blue shape twice
						as big as the unit square? Smaller than it?
					</p>
				</Action>
			</section>

			<!-- Step 2 -->
			<section
				class="step prose prose-lg"
				class:inactive={active !== 2}
				use:inView={{ top: band, bottom: band }}
				on:enter={() => (active = 2)}
			>
				<h2>2. The determinant measures area</h2>
				<p>
					Every matrix has a number called its <b>determinant</b>,
					written <Tex expr="\det(A)" />. It now appears next to the area.
				</p>
				<Action>
					<div class="flex flex-wrap gap-2 not-prose">
						<button
							class="btn btn-sm"
							disabled={!canStretch}
							on:click={() => setMatrix(stretched)}
						>
							Stretch first column ×2
						</button>
						<button class="btn btn-sm" on:click={() => setMatrix(scaleColumn($detMatrix, 0, 0.5))}>
							Shrink first column ×½
						</button>
						<button class="btn btn-sm" on:click={() => setMatrix(swapColumns($detMatrix))}>
							Flip (swap columns)
						</button>
					</div>
				</Action>
				<p>
					Stretching doubles the area, and the determinant doubles with it. Flipping
					mirrors the shape: the area stays the same, but the determinant's sign changes.
				</p>
				<AreaDetChart matrix={$detMatrix} />
				<p>
					Each dot is a matrix you have tried. They all land on the same V: the area
					is always the size of the determinant, and the sign only records whether
					the shape was flipped.
				</p>
			</section>

			<!-- Step 3 -->
			<section
				class="step prose prose-lg"
				class:inactive={active !== 3}
				use:inView={{ top: band, bottom: band }}
				on:enter={() => (active = 3)}
			>
				<h2>3. When the determinant is zero</h2>
				<p>What happens if the area shrinks all the way to 0?</p>
				<Action>
					<button class="btn btn-sm btn-error not-prose" on:click={() => setMatrix(SINGULAR_PRESET)}>
						Collapse it
					</button>
				</Action>
				{#if kind === "area"}
					<p>
						Right now the blue shape still has area, so the transformation is
						<b>invertible</b>: it can be undone.
					</p>
				{:else}
					<p>
						The square is flattened into a
						<b>{kind === "point" ? "single point" : "line segment"}</b>. Its area is
						0, and so is the determinant.
					</p>
					<p>
						A flattened square can't be un-flattened, so the transformation is
						<b>not invertible</b>.
					</p>
				{/if}
			</section>

			<div class="h-[50vh]" />
		</article>
	</div>
</div>

<style lang="postcss">
	.step {
		@apply min-h-[80vh] transition-opacity duration-300;
	}

	.step.inactive {
		@apply opacity-40;
	}
</style>
