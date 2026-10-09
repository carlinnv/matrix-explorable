<script>
	// Labeled 2x2 matrix input bound to `detMatrix` (Version 2+).
	// Version 1 keeps its own copy inside DeterminantPanel.svelte.
	import NumberSpinner from "svelte-number-spinner";
	import { detMatrix } from "$stores/determinant.js";
	import { colorX, colorY } from "$data/variables";

	// Entry range keeps every transformed vertex inside the plot
	export let min = -3;
	export let max = 3;
	// Show the entries but block editing (Version 4, section 4)
	export let locked = false;

	// Same column colors as the original matrix input and the plot's basis vectors
	const cells = [
		{ key: "a", color: colorX },
		{ key: "b", color: colorY },
		{ key: "c", color: colorX },
		{ key: "d", color: colorY }
	];

	// NumberSpinner doesn't forward aria attributes, so label its input directly
	function labelInput(node, label) {
		node.querySelectorAll("input").forEach((input) => input.setAttribute("aria-label", label));
	}
</script>

<div
	class="flex items-center gap-4"
	class:cursor-not-allowed={locked}
	title={locked ? "The matrix is locked in this section" : undefined}
>
	<span class="font-serif text-3xl">A =</span>
	<div
		class="matrix font-serif grid grid-cols-2 grid-rows-2 px-3 bg-base-200 shadow-lg shadow-neutral-content/20 transition-opacity"
		class:locked
		inert={locked || undefined}
	>
		{#each cells as cell (cell.key)}
			<div class="relative" use:labelInput={`Matrix entry ${cell.key}`}>
				<span class="absolute left-1 top-0.5 text-xs font-sans opacity-60" aria-hidden="true">
					{cell.key}
				</span>
				<NumberSpinner
					bind:value={$detMatrix[cell.key]}
					{min}
					{max}
					step={0.1}
					decimals={1}
					speed={0.1}
					class="entry-spinner"
					mainStyle={`color: ${cell.color};`}
				/>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.matrix {
		box-shadow: inset 0px 0px 0px 3px white;
	}

	.matrix.locked {
		@apply opacity-60;
	}

	/* Matches the original MatrixInput spinner style */
	:global(.entry-spinner) {
		@apply w-20 bg-base-200 px-2 py-2 text-right text-2xl transition-all selection:text-inherit;

		&:hover {
			@apply bg-base-100;
		}

		&:focus {
			@apply bg-base-100 outline-none ring-1 ring-inset ring-info;
		}
	}
</style>
