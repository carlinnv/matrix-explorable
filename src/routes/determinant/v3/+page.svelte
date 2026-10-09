<script>
	// Version 3: scroll-driven steps (revision of Version 2)
	// 1. matrix → unit square area, 2. area ↔ determinant (no formula), 3. det = 0
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import inView from "$actions/inView.js";
	import Meta from "$components/Meta.svelte";
	import Tex from "$components/matrix/Tex.svelte";
	import Action from "$components/matrix/Action.svelte";
	import ColorText from "$components/matrix/ColorText.svelte";
	import UnitSquarePlot from "$components/determinant/UnitSquarePlot.svelte";
	import MatrixEntryInput from "$components/determinant/MatrixEntryInput.svelte";
	import { detMatrix } from "$stores/determinant.js";
	import {
		IDENTITY,
		determinant,
		transformedArea,
		collapseKind,
		scaleColumn,
		swapColumns,
		entriesInRange,
		onInputGrid,
		flattenOntoFirstColumn,
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

	// Shortcut buttons are only offered when the inputs can show the result exactly
	const allowed = (m) => entriesInRange(m, entryMin, entryMax) && onInputGrid(m);
	$: stretched = scaleColumn($detMatrix, 0, 2);
	$: shrunk = scaleColumn($detMatrix, 0, 0.5);

	function setMatrix(m) {
		$detMatrix = { ...m };
	}

	const flyIn = { y: -10, duration: 300 };
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
			<!-- Controls centered over the plot -->
			<div class="relative flex justify-center">
				<div class="flex items-center gap-8">
					<MatrixEntryInput min={entryMin} max={entryMax} />

					<div class="flex flex-col gap-1 text-xl min-w-[13rem]">
						<div>Area: <b class="text-2xl">{formatNumber(area)}</b></div>
						{#if active >= 2}
							<div transition:fly={flyIn}>
								<Tex expr="\det(A)" />: <b class="text-2xl">{formatNumber(det)}</b>
							</div>
						{/if}
						{#if active >= 3}
							<div
								transition:fly={flyIn}
								class="font-bold {kind === 'area' ? 'text-success' : 'text-error'}"
							>
								{kind === "area" ? "✓ Invertible" : "✗ Not invertible"}
							</div>
						{/if}
					</div>
				</div>

				<button
					class="btn btn-sm btn-outline absolute right-0 top-0"
					on:click={() => setMatrix(IDENTITY)}
				>
					Reset
				</button>
			</div>

			<div class="flex-1 min-h-0 bg-base-200/40 rounded-xl">
				<UnitSquarePlot matrix={$detMatrix} showArea />
			</div>
		</div>

		<!-- Scrolling steps -->
		<article
			class="w-[36rem] shrink-0 bg-gradient-to-l from-base-100 via-base-300 via-90% px-10 py-12"
		>
			<header class="flex flex-col gap-3 mb-[20vh]">
				<a href="../../" class="link link-hover text-sm opacity-70">← Back to The Matrix Arcade</a>
				<h1 class="font-display text-4xl">Determinants & Invertibility</h1>
				<div class="prose prose-lg">
					<p>This page explores two ideas about a matrix <Tex expr="A" />:</p>
					<ul>
						<li>
							its <b>determinant</b>, a single number that describes how much
							<Tex expr="A" /> stretches or squashes space, and
						</li>
						<li>
							whether the matrix is <b>invertible</b>, meaning you can undo what the
							matrix did and get back to where you started.
						</li>
					</ul>
					<p>
						Both ideas are easiest to see by watching what <Tex expr="A" /> does to
						one simple shape: the unit square.
					</p>
				</div>
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
					Let's start with that shape. The dashed square is the <b>unit square</b>. It is built from the basis
					vectors (1, 0) and (0, 1), and its area is 1.
				</p>
				<p>
					A matrix sends (1, 0) to its <ColorText color="p">first column</ColorText>
					and (0, 1) to its <ColorText color="s">second column</ColorText>. The square
					follows along and becomes the blue shape.
				</p>
				<p>
					This movement of the whole plane is called a <b>transformation</b>: the
					matrix moves every point to a new spot.
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
					written <Tex expr="\det(A)" />.
				</p>
				<Action>
					<div class="flex flex-col gap-3 w-full">
						<p class="m-0">
							Keep changing the matrix entries and compare the two numbers below.
						</p>
						<div class="not-prose grid grid-cols-2 gap-3 text-center">
							<div class="bg-base-200 rounded-lg py-2">
								<div class="text-sm opacity-70">Area of blue shape</div>
								<div class="text-3xl font-bold">{formatNumber(area)}</div>
							</div>
							<div class="bg-base-200 rounded-lg py-2">
								<div class="text-sm opacity-70"><Tex expr="\det(A)" /></div>
								<div class="text-3xl font-bold">{formatNumber(det)}</div>
							</div>
						</div>
					</div>
				</Action>
				<div class="not-prose flex flex-wrap items-center gap-2 text-base">
					<span class="opacity-70">Shortcuts:</span>
					<button
						class="btn btn-xs btn-ghost"
						disabled={!allowed(stretched)}
						on:click={() => setMatrix(stretched)}
					>
						Stretch first column ×2
					</button>
					<button
						class="btn btn-xs btn-ghost"
						disabled={!allowed(shrunk)}
						on:click={() => setMatrix(shrunk)}
					>
						Shrink first column ×½
					</button>
					<button class="btn btn-xs btn-ghost" on:click={() => setMatrix(swapColumns($detMatrix))}>
						Flip (swap columns)
					</button>
				</div>
				<p>
					The area of the blue shape is always the size of the determinant: if one
					doubles, so does the other. A negative determinant means the shape was
					flipped (mirrored); the area stays the same.
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
					<div class="flex flex-col gap-3">
						<p class="m-0">Press the button below to collapse the two vectors.</p>
						<button
							class="btn btn-sm btn-error not-prose self-start"
							on:click={() => setMatrix(flattenOntoFirstColumn($detMatrix, entryMax))}
						>
							Collapse it
						</button>
					</div>
				</Action>
				{#if kind === "area"}
					<p>
						Right now the blue shape still has area, so you could stretch it back into
						the unit square. The transformation can be undone, so the matrix is
						<b>invertible</b>.
					</p>
				{:else}
					<p>
						The square is flattened into a
						<b>{kind === "point" ? "single point" : "line segment"}</b>. Its area is
						0, and so is the determinant.
					</p>
					<p>
						There's no way to stretch a {kind === "point" ? "single point" : "flat line"} back
						into a square, so the transformation can't be undone and the matrix is
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
