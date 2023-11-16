<script lang="ts">
    // The scrolling has been tested in the following browsers:
    // Brave
    // Chrome
    // Edge
    // Firefox
    // Safari

    // #region Imports
    import Noop from "./Noop.svelte";
    // #endregion

    // #region Generic types
    // The type of element to list.
    type TElement = $$Generic;

    // The type of key to index elements with.
    type TKey = $$Generic;
    // #endregion

    // #region Parameters
    // The maximum height of the part of the list that is shown in pixels.

    /**
     * The style that will be set to the div element that does the scrolling.
     */
    export let scrollElementStyle: string;

    /**
     * The elements will be wrapped in a component of this type if set.
     */
    export let elementsWrapper: ConstructorOfATypedSvelteComponent | null =
        null;

    // The elements to show. Null means no elements have been loaded yet.
    export let elements: Array<TElement> | null;

    // The key of the element that's currently selected. The list will show this
    // element as selected and show it as the initial top element.
    //
    // Null signals that no element is selected. In this case, the first element
    // in the provided list is shown as the initial top element.
    export let selectedKey: TKey | null;

    // Is called to load more elements located before the currently shown
    // elements.
    //
    // Null signals that the currently loaded elements are the initial elements
    // and that no more elements can be loaded before the currently shown
    // elements.
    export let loadUp: (() => Promise<void>) | null;

    // Is called to load more elements located after the currently shown
    // elements.
    //
    // Null signals that the currently loaded elements are the final elements
    // and that no more elements can be loaded after the currently shown
    // elements.
    export let loadDown: (() => Promise<void>) | null;

    // Gets the key of an element.
    export let getKey: (element: TElement) => TKey;

    /**
     * The number of pixels before the start or end of the list where additional
     * elements will be loaded if scrolled to.
     *
     * Defaults to 250 pixels.
     */
    export let threshold: number = 250;
    // #endregion

    // #region Private state
    // True if loadUp is currently being called.
    let loadingUp = false;

    // True if loadDown is currently being called.
    let loadingDown = false;

    // The list is already scrolled to the selected element if no selected key
    // is set, since the first element is the top element. Otherwise, the list
    // needs to be scrolled.
    let scrolledToSelected = !selectedKey;
    // #endregion

    // #region HTML elements
    // The <div> element the elements are shown in and that the user scrolls in.
    // This value is null when the page has not yet finished loading.
    let scrollElement: HTMLElement | null;

    // The <div> element of the selected element.
    // This value is null when the page has not yet finished loading.
    let selectedElement: HTMLElement | null;

    // The client height of the scroll element.
    let scrollElementClientHeight: number;
    // #endregion

    // #region Private functions
    // Tries to load more elements located before the currently shown elements.
    async function _loadUp() {
        // Only load if loadUp is set and not already loading.
        if (loadUp && !loadingUp) {
            try {
                // Mark as loading.
                loadingUp = true;

                // Load.
                await loadUp();
            } finally {
                // Mark as not loading.
                loadingUp = false;
            }
        }
    }

    // Tries to load more elements located after the currently shown elements.
    async function _loadDown() {
        // Only load if loadDown is set and not already loading.
        if (loadDown && !loadingDown) {
            try {
                // Mark as loading.
                loadingDown = true;

                // Load.
                await loadDown();
            } finally {
                // Mark as not loading.
                loadingDown = false;
            }
        }
    }

    // Called when the user scrolls.
    function _onScroll() {
        // Process scrolling if:
        // 1. The scroll element is known.
        // 2. The component has scrolled to the selected element.
        // 3. _handleTop is not currently processing, since that would cause
        // incorrect scrolling.
        if (!scrollElement || !scrolledToSelected) {
            return;
        }

        // Get the current scroll.
        const scrollTop = scrollElement.scrollTop;

        // Get the height of the part of the scroll element visible to the user.
        const clientHeight = scrollElement.clientHeight;

        // Get the total height of the scroll element including the invisible
        // parts.
        const scrollHeight = scrollElement.scrollHeight;

        // Get the bottom of the part of the scroll element visible to the user.
        const scrollBottom = scrollTop + clientHeight;

        // Get the threshold where new elements should be loaded down.
        const downThreshold = scrollHeight - threshold;

        // Load down if the bottom is lower than the down threshold.
        if (scrollBottom >= downThreshold) {
            _loadDown();
        }

        // Load up if the current scroll is below the threshold.
        else if (scrollTop <= threshold) {
            _loadUp();
        }
    }
    // #endregion

    // #region Initialization
    // Scroll to the selected element if:
    // 1. The HTML elements are known.
    // 2. The scroll element's client height is larger than zero, i.e. it isn't
    // hidden.
    // 3. The logic has not already scrolled to the selected element.
    $: if (
        selectedElement &&
        scrollElement &&
        scrollElementClientHeight > 0 &&
        !scrolledToSelected
    ) {
        // Scroll to the selected element.
        scrollElement.scrollTo({
            // TODO: What's the best way to set the 8 properly?
            top: selectedElement.offsetTop - 8,
        });

        // Call requestAnimationFrame and then set scrolledToSelected to true.
        requestAnimationFrame(() => {
            scrolledToSelected = true;
        });
    }
    // #endregion
</script>

<div
    bind:this={scrollElement}
    on:scroll={_onScroll}
    bind:clientHeight={scrollElementClientHeight}
    class="scroll-element"
    style={scrollElementStyle}
>
    {#if elements === null}
        <!-- Display an initial loading slot when no elements are present. -->
        <slot name="loading-init" />
    {:else}
        <!-- Always display a loading top slot but signal if any loading
        actually occurs. This is done instead of only showing it during loading
        as the scroll bar looks glitchy otherwise. -->
        <slot name="loading-top" loading={loadingUp} />

        {#if elements.length < 1}
            <!-- Inform the user that no entries exists. -->
            <slot name="no-entries" />
        {:else}
            <!-- Wrap the elements in a component if such a component is set.
            -->
            <svelte:component this={elementsWrapper ?? Noop}>
                <!-- Forward a slot that can be used arbitrarily by the element
                    wrapper. -->
                <svelte:fragment slot="elements-wrapper-custom">
                    <slot name="elements-wrapper-custom" />
                </svelte:fragment>

                <!-- Process each element. -->
                {#each elements as entry (getKey(entry))}
                    <!-- Treat the selected key as a special case. -->
                    {#if selectedKey == getKey(entry)}
                        <!-- Bind the selected element. -->
                        <div bind:this={selectedElement}>
                            <!-- Display the entry's slot. -->
                            <slot name="entry" {entry} />
                        </div>
                    {:else}
                        <!-- Display the entry's slot. -->
                        <slot name="entry" {entry} />
                    {/if}
                {/each}
            </svelte:component>
        {/if}

        <!-- Always display a loading bottom slot but signal if any loading
        actually occurs. This is done instead of only showing it during loading
        as the scroll bar looks glitchy otherwise. -->
        <slot name="loading-bottom" loading={loadingDown} />
    {/if}
</div>

<style>
    /* Styles the scroll element. */
    .scroll-element {
        /* Enable scrolling if the content is overflowing the div. */
        overflow: auto;

        /* Disable any "bouncy" behavior when scrolling to either end of the
        lists. */
        overscroll-behavior: none;
    }
</style>
