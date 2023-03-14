<script lang="ts">
    import type { PageData } from "./$types";
    import FamilyTree from "@balkangraph/familytree.js";
    import { onMount } from "svelte";

    type NodeType = {
        id: number;
        pids: number[];
        name: string;
        gender: "female" | "male";
        mid?: number;
        fid?: number;
    };

    export let data: PageData;

    let container: HTMLElement;
    let nodes: NodeType[] = [];

    for (let person of data[0]) {
        nodes.push({
            id: parseInt(person.id),
            pids: [parseInt(person.partner_id)],
            name: person.vezetek_nev + " " + person.kereszt_nev,
            gender: person.isFerfi ? "male" : "female",
            mid: person.anyja,
            fid: person.apja
        });
    }

    onMount(() => {
        const family = new FamilyTree(container, {
            nodes: nodes,
            nodeBinding: {
                field_0: "name"
            }
        });
    });
</script>

<h1>Welcome to TEST</h1>

<ul>
    {#each data[0] as res}
        <li>[{res.id}] {res.kereszt_nev} {res.vezetek_nev} - {res.foglalkozas} ({res.partner_id})</li>
    {/each}
</ul>
<div id="container" bind:this={container} />
