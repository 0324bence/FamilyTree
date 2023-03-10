<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Welcome to TEST</h1>

{#each data.item as res}
    <p>{res.kereszt_nev}</p>
{/each}
