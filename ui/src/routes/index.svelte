<script type="ts">

	import { onMount } from 'svelte';

	onMount(async () => {
		const result = await fetch('/tenants');
		const body = await result.json();
        tenants = body.tenants
		console.log(body);
	});

    let tenants: any[] = [];

    function parseOwners(tenant) {
        return tenant.spec.owners.map(item => `${item.name} (${item.kind})`).join(", ")
    }

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<table class="table">
	<thead>
		<tr>
			<th scope="col">#</th>
			<th scope="col">Name</th>
			<th scope="col">Owners</th>
		</tr>
	</thead>
	<tbody>
		{#each tenants as tenant}
			<tr>
				<th scope="row">1</th>
                <td>{tenant?.metadata?.name}</td>
				<td>{parseOwners(tenant)}</td>
			</tr>
		{/each}
	</tbody>
</table>
