<script lang="ts">
    export let id: string;
    export let name: string;
    export let description: string = "";
    export let enabled: boolean = false;
</script>

<div class="card" style="{enabled ? 'background: lightgreen' : ''}">
    <!--
    <img src="..." class="card-img-top" alt="..." />
    -->
    <div class="card-body">
        <h5 class="card-title">{name}</h5>
        <p class="card-text">
            This is a wider card with supporting text below as a natural lead-in to additional
            content. This card has even longer content than the first to show that equal
            height action.
            {description}
        </p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
    <div class="card-footer">
        <input
            bind:checked={enabled}
            type="checkbox"
            class="form-check-input"
            id="policy-{id}"
        />
        <label class="form-check-label" for="policy-{id}">Enable</label>
    </div>
</div>