<script type="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Policy from './Policy.svelte';
	import { io } from "socket.io-client";
	import { deleteTenant, createTenant, getTenants, type Tenant } from '$lib/tenants';
	import { parseOwners } from '$lib/utils';

	let creating = false;
	let tenants: any[] = [];
	let includePolicies = false;
	let name = ""
	let owners = ""

	async function reloadTenantTable() {
		tenants = await getTenants()
	}

	onMount(async () => {
		const socket = io()
		socket.on("connect", () => {
			// refresh list on each refresh request
			socket.on('refresh', async () => {
				await reloadTenantTable();
  			});
		})
		// refresh on first start
		await reloadTenantTable();
	});

	async function _deleteTenant(name: string) {
		await deleteTenant(name);
		await reloadTenantTable();
	}

	function startCreate() {
		creating = true;
		includePolicies = false;
	}

	function cancelCreate() {
		creating = false;
		includePolicies = false;
	}

	async function saveCreate() {
		creating = false;
		includePolicies = false;
		await createTenant(name, owners.split(",").map(item => item.trim()))
		await reloadTenantTable();
	}
</script>

<header class="d-flex justify-content-center py-3">
	<ul class="nav nav-pills">
		<li class="nav-item"><a href="#!" class="nav-link active" aria-current="page">Home</a></li>
		<li class="nav-item"><a href="#!" class="nav-link">Features</a></li>
		<li class="nav-item"><a href="#!" class="nav-link">Pricing</a></li>
		<li class="nav-item"><a href="#!" class="nav-link">FAQs</a></li>
		<li class="nav-item"><a href="#!" class="nav-link">About</a></li>
	</ul>
</header>

<div class="container-fluid">
	{#if creating}
		<form transition:slide|local>
			<div class="mb-3">
				<label for="owner" class="form-label">Owners</label>
				<input bind:value={owners} type="text" class="form-control" id="owner" aria-describedby="ownerHelp" />
				<div id="ownerHelp" class="form-text">
					Write comma separated list of owners (alice, bob...)
				</div>
			</div>
			<div class="mb-3">
				<label for="namespace" class="form-label">Namespace</label>
				<input bind:value={name} type="text" class="form-control" id="namespace" />
			</div>
			<div class="mb-3 form-check">
				<input
					bind:checked={includePolicies}
					type="checkbox"
					class="form-check-input"
					id="includePolicies"
				/>
				<label class="form-check-label" for="includePolicies">Include Policies</label>
			</div>
			{#if includePolicies}
				<div class="mb-3">
					<div class="card-group">
						<Policy id="1" name="Policy 1"></Policy>
						<Policy id="2" name="Policy 2"></Policy>
						<Policy id="3" name="Policy 3"></Policy>
					</div>
				</div>
			{/if}
			<button type="button" class="btn btn-primary" on:click={saveCreate}>Save</button>
			<button type="button" class="btn btn-primary" on:click={cancelCreate}>Cancel</button>
		</form>
	{:else}
		<form>
			<button type="button" class="btn btn-primary" on:click={startCreate}>Create</button>
		</form>
	{/if}
</div>

<table class="table">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Name</th>
			<th scope="col">Owners</th>
			<th scope="col"></th>
		</tr>
	</thead>
	<tbody>
		{#each tenants as tenant}
			<tr>
				<th scope="row">{tenant?.metadata?.uid.slice(24)}</th>
				<td>{tenant?.metadata?.name}</td>
				<td>{parseOwners(tenant)}</td>
				<td>
					<button on:click={() => _deleteTenant(tenant?.metadata?.name)} type="button" class="btn btn-sm btn-labeled btn-danger">
						<span class="btn-label"><i class="fa fa-remove"></i></span>Cancel</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
