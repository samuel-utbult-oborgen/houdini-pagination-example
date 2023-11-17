<script lang="ts">
    import { browser } from "$app/environment";
    import CountryField from "../../../components/fields/country/CountryField.svelte";
    import CurrencyField from "../../../components/fields/currency/CurrencyField.svelte";
    import type { PageData } from "./$houdini";

    export let data: PageData;
    $: ({ GetCustomer } = data);

    $: customerData = $GetCustomer.data;
</script>

{#if customerData}
    {customerData.customer.name}

    <br />

    {#if browser}
        <CountryField selected={customerData.customer.country} />
        <br />
        <CurrencyField selected={customerData.customer.currency} />
    {/if}
{/if}
