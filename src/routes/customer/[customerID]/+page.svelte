<script lang="ts">
    import { browser } from "$app/environment";
    import CurrencyField from "../../../components/fields/currency/CurrencyField.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    $: ({ GetCustomer } = data);

    $: customerData = $GetCustomer.data;
</script>

{#if customerData}
    {customerData.customer.name}

    <br />

    {#if browser}
        <CurrencyField selectedID={customerData.customer.id} />
    {/if}
{/if}
