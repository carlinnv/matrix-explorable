<script>
	import { base } from "$app/paths";
	import Meta from "$components/Meta.svelte";
	import UnitSquarePlot from "$components/determinant/UnitSquarePlot.svelte";
	import DeterminantPanel from "$components/determinant/DeterminantPanel.svelte";
	import { detMatrix } from "$stores/determinant.js";
</script>

<Meta
	title="Determinants & Invertibility | The Matrix Arcade"
	description="See how a 2x2 matrix transforms the unit square, and why a zero determinant means the matrix is not invertible."
/>

<!-- The global body style hides overflow on large screens, so this wrapper scrolls -->
<div class="h-screen overflow-y-auto bg-base-300">
	<div class="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
		<header class="flex flex-col gap-2">
			<a href="{base}/" class="link link-hover text-sm opacity-70">
				← Back to The Matrix Arcade
			</a>
			<h1 class="font-display text-3xl lg:text-4xl">Determinants & Invertibility</h1>
			<p class="max-w-prose opacity-80">
				The dashed white square is the unit square, built from the basis vectors
				(1, 0) and (0, 1). The matrix <i>A</i> sends (1, 0) to its first column
				(pink) and (0, 1) to its second column (purple), so the square turns into
				the blue shape. Change the entries and watch what happens to its area.
			</p>
		</header>

		<div class="flex flex-col lg:flex-row gap-8 items-start">
			<div class="w-full lg:flex-1 aspect-square max-h-[80vh] bg-base-200/40 rounded-xl">
				<UnitSquarePlot matrix={$detMatrix} />
			</div>
			<div class="w-full lg:w-[28rem]">
				<DeterminantPanel />
			</div>
		</div>
	</div>
</div>
