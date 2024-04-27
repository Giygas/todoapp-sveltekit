<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Icon from '@iconify/svelte';
	import { fade } from 'svelte/transition';

	export let text = 'Hello World';
	export let completed = false;
	export let deleteItem = () => {};
	export let id = 0;
	export let editMode = false;
	export let saveItem = () => {};

	export let handleCheck = () => {};

	let inputMode = false;

	let toggleModify = () => {
		inputMode = !inputMode;
	};

	$: text;
</script>

<div class="flex w-full items-center gap-5 px-5">
	<Checkbox
		class="h-[14px] w-[14px] flex-grow-0"
		id={id.toString()}
		checked={completed}
		on:click={handleCheck}
	/>
	{#if !inputMode}
		<div class="min-w-0 break-words">
			<Label
				for={id.toString()}
				class="text-md  font-medium  peer-disabled:cursor-not-allowed peer-disabled:opacity-70 lg:text-lg {completed
					? 'text-primary/50 line-through'
					: ''}"
			>
				{text}
			</Label>
		</div>
	{:else}
		<form
			on:submit|preventDefault={() => {
				toggleModify();
				saveItem();
			}}
			class="flex-1"
		>
			<Input
				autofocus
				type="text"
				id={id.toString()}
				bind:value={text}
				class="text-md  font-medium  lg:text-lg {completed ? 'line-through' : ''}"
				on:blur={() => {
					toggleModify();
					saveItem();
				}}
			/>
		</form>
	{/if}
	{#if editMode}
		<div class="ml-auto flex flex-grow-0 justify-end gap-3" transition:fade>
			<button on:click={toggleModify} class="text-lg">
				<Icon icon="mdi:edit-outline" width="22" height="22" class="text-primary" />
			</button>
			<button on:click={deleteItem} class="text-lg font-extrabold text-primary"
				><Icon icon="ph:trash-light" width="24" height="24" class="text-primary" />
			</button>
		</div>
	{/if}
</div>
