<script lang="ts">
    import {
        GetCurrenciesStore,
        type CurrencyFieldFragment,
        CurrencyFieldFragmentStore,
        type CurrencyFieldFragment$data,
    } from "$houdini";
    import { idToCursor } from "$lib/cursor";
    import ProgressBar from "./ProgressBar.svelte";
    import VirtualList from "./VirtualList.svelte";

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

    let open = false;

    function setCurrency(newCurrency: CurrencyFieldFragment$data) {
        return () => {
            selectedCurrency = newCurrency;
            open = false;
        };
    }

    $: loadUp = $store.data?.currencies.pageInfo.hasPreviousPage
        ? () => store.loadPreviousPage()
        : null;
    $: loadDown = $store.data?.currencies.pageInfo.hasNextPage
        ? () => store.loadNextPage()
        : null;
</script>

{#if selectedCurrency && $store.data}
    <div class={open ? "dropdown is-active" : "dropdown"}>
        <div class="dropdown-trigger">
            <button class="button" on:click={() => (open = !open)}>
                <span>{selectedCurrency.name}</span>
            </button>
        </div>
        <div class="dropdown-menu">
            <div class="dropdown-content">
                <VirtualList
                    scrollElementStyle="max-height: 20em"
                    elements={$store.data.currencies.edges}
                    getKey={(currency) => currency.node.id}
                    selectedKey={selectedCurrency.id}
                    {loadUp}
                    {loadDown}
                >
                    <svelte:fragment slot="loading-init">
                        <ProgressBar />
                    </svelte:fragment>
                    <svelte:fragment slot="loading-top" let:loading>
                        {#if loading}
                            <ProgressBar />
                        {/if}
                    </svelte:fragment>
                    <svelte:fragment slot="loading-bottom" let:loading>
                        {#if loading}
                            <ProgressBar />
                        {/if}
                    </svelte:fragment>
                    <svelte:fragment slot="no-entries">
                        Nothing found
                    </svelte:fragment>
                    <svelte:fragment slot="entry" let:entry>
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <a
                            class={selectedCurrency.id === entry.node.id
                                ? "dropdown-item is-active"
                                : "dropdown-item"}
                            on:click={setCurrency(entry.node)}
                            on:keyup={setCurrency(entry.node)}
                            role="button"
                            tabindex={entry.node.id}
                        >
                            {entry.node.name}
                        </a>
                    </svelte:fragment>
                </VirtualList>
            </div>
        </div>
    </div>
{/if}
