<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
    $: ({ GetCustomers } = data);
</script>

<ul>
    {#each $GetCustomers.data.customers.edges ?? [] as customer}
        <li>
            <a href={`/customer/${customer.node.id}`}
                >{customer.node.id} - {customer.node.name}</a
            >
        </li>
    {/each}
</ul>
