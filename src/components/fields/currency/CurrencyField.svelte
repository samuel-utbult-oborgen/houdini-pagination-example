<script lang="ts">
    import { GetCurrenciesStore } from "$houdini";
    import { idToCursor } from "$lib/cursor";

    export let selectedID: number | null;

    const store = new GetCurrenciesStore();
    async function load(_selectedID: number | null) {
        await store.fetch({
            variables: {
                after: _selectedID ? idToCursor(_selectedID) : null,
            },
        });
        if (_selectedID) {
            await store.loadPreviousPage();
        }
    }

    $: load(selectedID);

    $: data = $store.data;
</script>

{#if data}
    {#if data.currencies.pageInfo.hasPreviousPage}
        <button on:click={() => store.loadPreviousPage()}>Previous</button>
    {/if}

    <ul>
        {#each $store.data?.currencies.edges ?? [] as currency}
            <li>{currency.node.id} - {currency.node.name}</li>
        {/each}
    </ul>

    {#if data.currencies.pageInfo.hasNextPage}
        <button on:click={() => store.loadNextPage()}>Next</button>
    {/if}
{/if}
