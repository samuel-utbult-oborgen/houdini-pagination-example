<script lang="ts">
    import {
        GetCurrenciesStore,
        type CurrencyFieldFragment,
        CurrencyFieldFragmentStore,
    } from "$houdini";
    import { idToCursor } from "$lib/cursor";
    import CurrencyFieldElement from "./CurrencyFieldElement.svelte";

    export let selected: CurrencyFieldFragment;

    const currencyFieldFragmentStore = new CurrencyFieldFragmentStore();
    const readableCurrency = currencyFieldFragmentStore.get(selected);
    $: selectedCurrency = $readableCurrency;

    const store = new GetCurrenciesStore();
    let loadCalled = false;
    async function load(_selectedID: number | null) {
        if (loadCalled) {
            return;
        }
        loadCalled = true;
        await store.fetch({
            variables: {
                after: _selectedID ? idToCursor(_selectedID) : null,
            },
        });
        if (_selectedID) {
            await store.loadPreviousPage();
        }
    }

    $: selectedCurrency && load(selectedCurrency.id);

    $: data = $store.data;
</script>

{#if data}
    {#if data.currencies.pageInfo.hasPreviousPage}
        <button on:click={() => store.loadPreviousPage()}>Previous</button>
    {/if}

    <ul>
        {#each $store.data?.currencies.edges ?? [] as currency (currency.node.id)}
            <li>
                <CurrencyFieldElement element={currency.node} />
            </li>
        {/each}
    </ul>

    {#if data.currencies.pageInfo.hasNextPage}
        <button on:click={() => store.loadNextPage()}>Next</button>
    {/if}
{/if}
