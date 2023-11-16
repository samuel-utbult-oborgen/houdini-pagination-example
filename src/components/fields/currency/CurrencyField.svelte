<script lang="ts">
    import {
        CurrencyFieldFragmentStore,
        type CurrencyFieldFragment,
        GetCurrenciesStore,
    } from "$houdini";
    import { SelectFieldController } from "../../../controllers/SelectFieldController";
    import SelectField from "../select/SelectField.svelte";

    export let selected: CurrencyFieldFragment;

    const currencyFieldFragmentStore = new CurrencyFieldFragmentStore();
    const readableCurrency = currencyFieldFragmentStore.get(selected);

    const store = new GetCurrenciesStore();
    $: controller = $readableCurrency
        ? new SelectFieldController(
              store,
              (result) => result.currencies,
              $readableCurrency,
          )
        : null;
</script>

{#if controller}
    <SelectField
        {controller}
        input={{}}
        getElementLabel={(element) => element.name}
    />
{/if}
