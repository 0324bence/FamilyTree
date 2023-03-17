<script lang="ts">
    import type { PageData } from "./$types";
    import FamilyTree from "@balkangraph/familytree.js";
    import { onMount } from "svelte";

    type NodeType = {
        id: number;
        pids?: number[];
        nev: string;
        gender: "female" | "male";
        mid?: number;
        fid?: number;
        szül_ido: string;
        szül_hely: string;
        szül_hely_id: string;
        foglalkozas: string;
        display_date: string;
    };

    export let data: PageData;

    let container: HTMLElement;
    let nodes: NodeType[] = [];

    FamilyTree.templates.tommy_male.field_0 =
        '<text class="field_0" style="font-size: 20px;" fill="#ffffff" x="125" y="100" text-anchor="middle">{val}</text>';
    FamilyTree.templates.tommy_male.field_1 =
        '<text class="field_1" style="font-size: 16px;" fill="#ffffff" x="125" y="80" text-anchor="middle">{val}</text>';
    FamilyTree.templates.tommy_male.field_2 =
        '<text class="field_2" style="font-size: 14px;" fill="#ffffff" x="125" y="60" text-anchor="middle">{val}</text>';
    FamilyTree.templates.tommy_female.field_0 =
        '<text class="field_0" style="font-size: 20px;" fill="#ffffff" x="125" y="100" text-anchor="middle">{val}</text>';
    FamilyTree.templates.tommy_female.field_1 =
        '<text class="field_1" style="font-size: 16px;" fill="#ffffff" x="125" y="80" text-anchor="middle">{val}</text>';
    FamilyTree.templates.tommy_female.field_2 =
        '<text class="field_2" style="font-size: 14px;" fill="#ffffff" x="125" y="60" text-anchor="middle">{val}</text>';

    FamilyTree.elements.myButton = function (data: any, editElement: any) {
        var id = FamilyTree.elements.generateId();
        return {
            html: `<div style="display:grid; place-items:center;">
                    <button
                        class="myButton"
                        title="${editElement.options[0].title}"
                        onclick="document.dispatchEvent(new CustomEvent('${
                            editElement.options[0].triggerEvent
                        }', {'detail': ${data[editElement.binding]}}))"
                    >
                    ${editElement.options[0].icon}
                    </button>
                </div>`,
            id: id
        };
    };

    for (let person of data[0]) {
        nodes.push({
            id: parseInt(person.id),
            pids: person.partner_id ? [parseInt(person.partner_id)] : undefined,
            nev: person.vezetek_nev + " " + person.kereszt_nev,
            gender: person.isferfi ? "male" : "female",
            mid: person.anyja,
            fid: person.apja,
            szül_ido: new Date(person.szül_ido).toISOString().split("T")[0],
            display_date:
                new Date(person.szül_ido).toISOString().split("T")[0] +
                (person.halal_ido ? " - " + new Date(person.halal_ido).toISOString().split("T")[0] : ""),
            szül_hely: person.szül_hely,
            foglalkozas: person.foglalkozas,
            szül_hely_id: person.szül_hely_id
        });
    }

    function addCountry() {
        console.log("add country");
    }

    onMount(() => {
        document.addEventListener(
            "editBrithPlace",
            () => {
                addCountry();
            },
            false
        );

        const family = new FamilyTree(container, {
            nodes: nodes,
            nodeTreeMenu: true,
            editForm: {
                buttons: {
                    remove: {
                        icon: `<svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>`,
                        text: "Delete"
                    },
                    share: null,
                    pdf: null
                },
                generateElementsFromFields: false,
                elements: [
                    { type: "textbox", label: "Név", binding: "nev" },
                    { type: "date", label: "Születési idő", binding: "display_date" },
                    {
                        type: "select",
                        options: [
                            { value: "male", text: "Férfi" },
                            { value: "female", text: "Nő" }
                        ],
                        label: "Nem",
                        binding: "gender"
                    },
                    { type: "textbox", label: "Foglalkozás", binding: "foglalkozas" },
                    {
                        type: "myButton",
                        options: [
                            {
                                triggerEvent: "addNewCountry",
                                icon: `<svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>`
                            }
                        ]
                    }
                    // { type: "textbox", label: "Foglalkozás", binding: "foglalkozas" }
                ],
                titleBinding: "nev"
            },
            nodeBinding: {
                field_0: "nev",
                field_1: "szül_ido",
                field_2: "foglalkozas"
            },
            nodeMouseClick: FamilyTree.action.edit
        });
    });
</script>

<!-- <h1>Welcome to TEST</h1>

<ul>
    {#each data[0] as res}
        <li>[{res.id}] {res.kereszt_nev} {res.vezetek_nev} - {res.foglalkozas} ({res.partner_id})</li>
    {/each}
</ul> -->
<div id="container" bind:this={container} />

<style global>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #container {
        width: 100%;
        height: 100vh;
    }
    :global(.myButton) {
        width: 48px;
        height: 48px;
        cursor: pointer;
        border-radius: 50%;
        background-color: green;
        display: grid;
        place-items: center;
        border: none;
    }
    :global(.myButton:hover) {
        background-color: hsl(120, 100%, 40%);
    }
</style>
