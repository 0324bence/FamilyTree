<script lang="ts">
    import type { PageData } from "./$types";
    import FamilyTree from "@balkangraph/familytree.js";
    import { onMount } from "svelte";
    import PlaceModal from "../components/PlaceModal.svelte";
    import NewPersonModal from "../components/NewPersonModal.svelte";

    type NodeType = {
        id: number;
        pids?: number[];
        display_nev: string;
        vezetek_nev: string;
        kereszt_nev: string;
        gender: "female" | "male";
        gender_display: string;
        mid?: number;
        fid?: number;
        szül_ido: string;
        szül_hely: string;
        szül_hely_id: string;
        foglalkozas: string;
        display_date: string;
        halal_hely: string;
        halal_hely_id: string;
        halal_ido: string;
        halal_ok: string;
    };

    export let data: PageData;

    let showModal = false;
    let showDeathModal = false;
    let currentPersonPlace = "";
    let currentPerson = "";

    let container: HTMLElement;
    let originalNodes: NodeType[] = [];
    // let nodes: NodeType[] = originalNodes;

    let showNewPersonModal = false;

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
                        }', {'detail': ['${data[editElement.binding]}', '${data[editElement.options[0].personID]}']}))"
                    >
                    ${editElement.options[0].icon}
                    </button>
                </div>`,
            id: id
        };
    };

    FamilyTree.elements.disabledTextfield = function (data: any, editElement: any, minWidth: any, readOnly: any) {
        var id = FamilyTree.elements.generateId();
        var value = data[editElement.binding];
        if (value == undefined) value = "";
        if (readOnly && !value) {
            return {
                html: ""
            };
        }
        return {
            html: `<div class="bft-form-field" style="min-width: 220px;">
                    <div class="bft-input" data-bft-input>
                        <label for="${id}">${editElement.label}</label>
                        <input readonly id="${id}" name="${id}" autocomplete="off" style="word-break: break-word;" data-binding="${editElement.binding}" value="${value}"/>
                    </div>
                </div>`,
            id: id,
            value: value
        };
    };

    for (let person of data[0]) {
        if (person.isFerfi) person.isferfi = person.isFerfi;
        originalNodes.push({
            id: parseInt(person.id),
            pids: person.partner_id ? [parseInt(person.partner_id)] : undefined,
            display_nev: person.vezetek_nev + " " + person.kereszt_nev,
            kereszt_nev: person.kereszt_nev,
            vezetek_nev: person.vezetek_nev,
            gender: person.isferfi ? "male" : "female",
            gender_display: person.isferfi ? "Férfi" : "Nő",
            mid: person.anyja,
            fid: person.apja,
            szül_ido: new Date(person.szül_ido).toISOString().split("T")[0],
            display_date:
                new Date(person.szül_ido).toISOString().split("T")[0] +
                (person.halal_ido != "0000-00-00"
                    ? " - " + new Date(person.halal_ido).toISOString().split("T")[0]
                    : ""),
            szül_hely: person.szül_hely,
            foglalkozas: person.foglalkozas,
            szül_hely_id: person.szül_hely_id,
            halal_hely: person.halal_hely,
            halal_hely_id: person.halal_hely_id,
            halal_ido:
                person.halal_ido != "0000-00-00"
                    ? new Date(person.halal_ido).toISOString().split("T")[0]
                    : "00-00-0000",
            halal_ok: person.halal_ok
        });
    }

    function ToggleBirthplaceEdit(place: string, person: string) {
        console.log(place, person);
        currentPerson = person;
        currentPersonPlace = place;
        showModal = !showModal;
    }

    function ToggleDeathplaceEdit(place: string, person: string) {
        console.log(place, person);
        currentPerson = person;
        currentPersonPlace = place;
        showDeathModal = !showDeathModal;
    }

    onMount(() => {
        document.addEventListener(
            "editBrithPlace",
            (e: any) => {
                ToggleBirthplaceEdit(e.detail[0], e.detail[1]);
            },
            false
        );
        document.addEventListener(
            "editDeathPlace",
            (e: any) => {
                ToggleDeathplaceEdit(e.detail[0], e.detail[1]);
            },
            false
        );

        const family = new FamilyTree(container, {
            nodes: originalNodes,
            editForm: {
                buttons: {
                    remove: {
                        icon: `<svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>`,
                        text: "Delete"
                    },
                    share: null,
                    pdf: null
                },
                addMore: undefined,
                generateElementsFromFields: false,
                elements: [
                    {
                        type: "textbox",
                        label: "Vezetéknév",
                        binding: "vezetek_nev",
                        vlidators: { required: "nem hagyható üresen" }
                    },
                    {
                        type: "textbox",
                        label: "Keresztnév",
                        binding: "kereszt_nev",
                        vlidators: { required: "nem hagyható üresen" }
                    },
                    {
                        type: "date",
                        label: "Születési idő",
                        binding: "szül_ido",
                        vlidators: { required: "nem hagyható üresen" }
                    },
                    { type: "disabledTextfield", label: "Születés helye", binding: "szül_hely" },
                    {
                        type: "myButton",
                        options: [
                            {
                                title: "Módosítás",
                                personID: "id",
                                triggerEvent: "editBrithPlace",
                                icon: `<svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>`
                            }
                        ],
                        binding: "szül_hely_id"
                    },
                    {
                        type: "disabledTextfield",
                        label: "Nem",
                        binding: "gender_display"
                    },
                    { type: "textbox", label: "Foglalkozás", binding: "foglalkozas" },
                    { type: "date", label: "Halál ideje", binding: "halal_ido" },
                    { type: "textbox", label: "Halál oka", binding: "halal_ok" },
                    { type: "disabledTextfield", label: "Halál helye", binding: "halal_hely" },
                    {
                        type: "myButton",
                        options: [
                            {
                                title: "Módosítás",
                                personID: "id",
                                triggerEvent: "editDeathPlace",
                                icon: `<svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>`
                            }
                        ],
                        binding: "halal_hely_id"
                    }
                    // { type: "textbox", label: "Foglalkozás", binding: "foglalkozas" }
                ],
                titleBinding: "nev"
            },
            nodeBinding: {
                field_0: "display_nev",
                field_1: "display_date",
                field_2: "foglalkozas"
            },
            nodeMouseClick: FamilyTree.action.edit
        });
        family.on("update", (tree, updateData, arg1, arg2) => {
            console.log(arg1, arg2);
            console.log(updateData);
            if (updateData.removeNodeId) {
                console.log("remove");
                fetch("api/people", {
                    method: "DELETE",
                    body: JSON.stringify({
                        id: updateData.removeNodeId
                    })
                }).then(/* () => document.location.reload() */);
                return;
            }
            if ((updateData.updateNodesData as Array<any>).length == 1) {
                const node = updateData.updateNodesData[0];
                if (originalNodes.some(i => i.id == node.id)) {
                    console.log(updateData.updateNodesData[0]);
                    fetch("api/people", {
                        method: "PATCH",
                        body: JSON.stringify({
                            id: node.id,
                            vezetek_nev: node.vezetek_nev,
                            kereszt_nev: node.kereszt_nev,
                            foglalkozas: node.foglalkozas || "Munkanélküli",
                            szül_ido: node.szül_ido,
                            halal_ido: node.halal_ido,
                            halal_ok: node.halal_ok
                        })
                    }).then(() => document.location.reload());
                }
            }
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
{#if showModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="modal-container" on:click|self={() => ToggleBirthplaceEdit("", "")}>
        <PlaceModal
            apiPath="api/people/birthplace"
            title="Hely"
            current={currentPersonPlace}
            {currentPerson}
            on:close={() => {
                ToggleBirthplaceEdit("", "");
                // document.location.reload();
            }}
        />
    </div>
{/if}
{#if showDeathModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="modal-container" on:click|self={() => ToggleDeathplaceEdit("", "")}>
        <PlaceModal
            apiPath="api/people/deathplace"
            title="Hely"
            current={currentPersonPlace}
            {currentPerson}
            on:close={() => {
                ToggleDeathplaceEdit("", "");
                document.location.reload();
            }}
        />
    </div>
{/if}
{#if showNewPersonModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        id="modal-container"
        on:click|self={() => {
            showNewPersonModal = false;
        }}
    >
        <NewPersonModal
            on:close={() => {
                showNewPersonModal = false;
                document.location.reload();
            }}
        />
    </div>
{/if}

<div class="button-container">
    <button
        on:click={() => {
            showNewPersonModal = true;
        }}
        ><svg width="24" height="24" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
            ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
                d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
            /></svg
        ></button
    >
</div>

<style global>
    .button-container {
        position: absolute;
        z-index: 1000;
        width: 4rem;
        height: 4rem;
        margin: 2rem;
        left: 0;
        bottom: 0;
    }
    .button-container button {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 50%;
        background-color: blue;
        display: grid;
        place-items: center;
        cursor: pointer;
    }
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
    #modal-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        min-height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
</style>
