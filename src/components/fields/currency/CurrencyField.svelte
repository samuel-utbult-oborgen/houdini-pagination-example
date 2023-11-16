<script lang="ts">
    import {
        GetCurrenciesStore,
        type CurrencyFieldFragment,
        CurrencyFieldFragmentStore,
        type CurrencyFieldFragment$data,
    } from "$houdini";
    import { idToCursor } from "$lib/cursor";

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
</script>

{#if selectedCurrency}
    <div class={open ? "dropdown is-active" : "dropdown"}>
        <div class="dropdown-trigger">
            <button class="button" on:click={() => (open = !open)}>
                <span>{selectedCurrency.name}</span>
            </button>
        </div>
        <div class="dropdown-menu">
            <div class="dropdown-content">
                {#each $store.data?.currencies.edges ?? [] as currency (currency.node.id)}
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <a
                        class={selectedCurrency.id === currency.node.id
                            ? "dropdown-item is-active"
                            : "dropdown-item"}
                        on:click={setCurrency(currency.node)}
                        on:keyup={setCurrency(currency.node)}
                        role="button"
                        tabindex={currency.node.id}
                    >
                        {currency.node.name}
                    </a>
                {/each}
            </div>
        </div>
    </div>
{/if}
