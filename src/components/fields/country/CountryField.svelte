<script lang="ts">
    import {
        CountryFieldFragmentStore,
        type CountryFieldFragment,
        GetCountriesStore,
    } from "$houdini";
    import { SelectFieldController } from "../../../controllers/SelectFieldController";
    import SelectField from "../select/SelectField.svelte";

    export let selected: CountryFieldFragment;

    const countryFieldFragmentStore = new CountryFieldFragmentStore();
    const readableCountry = countryFieldFragmentStore.get(selected);

    const store = new GetCountriesStore();
    $: controller = $readableCountry
        ? new SelectFieldController(
              store,
              (result) => result.countries,
              $readableCountry,
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
