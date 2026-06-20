<script lang="ts">
	interface Props {
		percentage: number;
		variant?: 'blue' | 'green' | 'orange';
	}

	let {
		percentage,
		variant = 'blue',
	}: Props = $props();
</script>

<div class="progress-bar">
	<div
		class="progress-bar-fill {variant}"
		style="width: {Math.min(percentage, 100)}%"
	></div>
</div>
