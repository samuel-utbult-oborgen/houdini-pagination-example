<script lang="ts">
    import ProgressBar from "./ProgressBar.svelte";

    import VirtualList from "./VirtualList.svelte";

    import { idToCursor } from "$lib/cursor";
    import type {
        SelectFieldController,
        ElementWithID,
    } from "../../../controllers/SelectFieldController";

    type TResult = $$Generic<GraphQLObject>;
    type TInput = $$Generic;
    type TElement = $$Generic<ElementWithID>;

    export let controller: SelectFieldController<TResult, TInput, TElement>;
    export let input: TInput;
    export let getElementLabel: (element: TElement) => string;

    let loadCalled = false;
    async function load(selectedID: number | null) {
        if (loadCalled) {
            return;
        }
        loadCalled = true;
        await controller.store.fetch({
            variables: {
                ...input,
                after: selectedID ? idToCursor(selectedID) : null,
            },
        });
        if (selectedID) {
            await controller.store.loadPreviousPage();
        }
    }

    $: selectedStore = controller.getSelected();
    $: selectedIDStore = controller.getSelectedID();
    $: load($selectedIDStore);

    let open = false;

    function setElement(element: TElement) {
        return () => {
            controller.setSelected(element);
            open = false;
        };
    }

    $: storeStore = controller.store;

    $: loadUp =
        $storeStore.data &&
        controller.getConnection($storeStore.data).pageInfo.hasPreviousPage
            ? () => controller.store.loadPreviousPage()
            : null;

    $: loadDown =
        $storeStore.data &&
        controller.getConnection($storeStore.data).pageInfo.hasNextPage
            ? () => controller.store.loadNextPage()
            : null;
</script>

{#if $storeStore.data}
    <div class={open ? "dropdown is-active" : "dropdown"}>
        <div class="dropdown-trigger">
            <button class="button" on:click={() => (open = !open)}>
                {getElementLabel($selectedStore)}
            </button>
        </div>
        <div class="dropdown-menu">
            <div class="dropdown-content">
                <VirtualList
                    scrollElementStyle="max-height: 20em"
                    elements={controller.getConnection($storeStore.data).edges}
                    getKey={(currency) => currency.node.id}
                    selectedKey={$selectedIDStore}
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
                            class={$selectedIDStore === entry.node.id
                                ? "dropdown-item is-active"
                                : "dropdown-item"}
                            on:click={setElement(entry.node)}
                            on:keyup={setElement(entry.node)}
                            role="button"
                            tabindex={entry.node.id}
                        >
                            {getElementLabel(entry.node)}
                        </a>
                    </svelte:fragment>
                </VirtualList>
            </div>
        </div>
    </div>
{/if}
