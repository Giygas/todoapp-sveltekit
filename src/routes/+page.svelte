<script lang="ts">
	import { browser } from '$app/environment';
	import { _app, save } from '$lib/stores/store';
	import { onDestroy } from 'svelte';
	import type { TodoItem } from '$lib/types';
	import ListItem from '$lib/components/ListItem.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import Label from '$lib/components/ui/label/label.svelte';
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';
	import { toggleMode } from 'mode-watcher';

	let items: Array<TodoItem> = [];

	_app.subscribe((value) => {
		items = value;
	});

	onDestroy(() => {
		if (browser) {
			save();
		}
	});

	function update() {
		_app.update(() => {
			save();
			return items;
		});
	}

	function addItem() {
		if (!newItem) return;
		items.push({
			id: Date.now(),
			text: newItem,
			completed: false,
			editMode: false
		});
		toast.success('Item added', {
			action: {
				label: 'Undo',
				onClick: () => {
					items.pop();
					update();
				}
			}
		});
		newItem = '';
		update();
	}

	$: if (!editMode) {
		// New item input get focus when exiting edit mode
		if (browser) {
			document.getElementById('new-item')?.focus();
		}
	}

	let newItem: string | null = null;

	let editMode = false;

	let itemsLeft;
	$: itemsLeft = items.filter((item) => !item.completed);
</script>

<!-- Theme toggle -->
<Button on:click={toggleMode} variant="outline" size="icon" class="absolute right-2 top-2">
	<Sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

<div class="container max-w-[800px] rounded-lg p-5 sm:p-16">
	<h1 class="text-center text-4xl font-bold sm:text-6xl">Todo List</h1>

	<div class="flex justify-between gap-3 py-5 sm:flex-row">
		{#if items.length == 0}
			<div class=" flex justify-center text-nowrap py-5 md:justify-end md:pr-10">
				<p class="todo-title">Nothing to do</p>
			</div>
		{:else if itemsLeft.length != 0}
			<div class="flex justify-center text-nowrap py-5 md:justify-end md:pr-10">
				<p class="todo-title">You have {itemsLeft.length} items left</p>
			</div>
		{:else}
			<div class="flex justify-center text-nowrap py-5 md:justify-end md:pr-10">
				<p class="todo-title">All done !</p>
			</div>
		{/if}
		<div class="flex items-center space-x-2">
			<Switch id="edit-mode" bind:checked={editMode} />
			<Label for="edit-mode">Edit Mode</Label>
		</div>
	</div>

	<ul class="flex flex-col gap-3">
		{#each items as item, i (item.id)}
			<li
				transition:fade={{ duration: 500 }}
				class="my-auto flex min-h-14 items-center rounded-md bg-secondary/40 align-middle shadow-md"
			>
				<ListItem
					bind:text={item.text}
					completed={item.completed}
					id={i}
					handleCheck={() => {
						item.completed = !item.completed;
						update();
					}}
					deleteItem={() => {
						items = items.splice(items.indexOf(item), 1);
						update();
					}}
					saveItem={() => {
						update();
					}}
					bind:editMode
				/>
			</li>
		{/each}
	</ul>

	<form
		class="mx-auto flex w-full flex-col flex-wrap items-center gap-3 space-x-2 px-5 py-5 sm:flex-row sm:flex-nowrap"
		on:submit={addItem}
	>
		<Input
			id="new-item"
			autofocus
			bind:value={newItem}
			type="text"
			name="New Item"
			placeholder="Add an item"
			class="w-full p-2 outline-none focus:border-b"
		/>
		<Button type="submit">Create</Button>
	</form>
</div>

<style>
	.todo-title {
		@apply text-center text-lg font-bold sm:text-2xl;
	}
</style>
