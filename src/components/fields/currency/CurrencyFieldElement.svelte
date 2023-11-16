<script lang="ts">
    import {
        CurrencyFieldFragmentStore,
        type CurrencyFieldFragment,
    } from "$houdini";

    export let element: CurrencyFieldFragment;
    const store = new CurrencyFieldFragmentStore();
    const readableCurrency = store.get(element);
    $: currency = $readableCurrency;
</script>

{#if currency}
    {currency.id} - {currency.name}
{/if}
