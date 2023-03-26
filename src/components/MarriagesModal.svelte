<script lang="ts">
    import { fly } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    import NewMarriageModal from "./NewMarriageModal.svelte";
    export let currentPerson: string;

    const dispatch = createEventDispatcher();

    let marriageData: any[] = [];
    let originalSelects: any[];
    let selects = ["0"];
    let showNewWeddingModal = false;

    onMount(async () => {
        marriageData = await fetch("api/marriage").then(i => i.json());
        const marriages = await fetch("api/people/marriage?person=" + currentPerson).then(i => i.json());
        if (marriages) {
            selects = marriages.map((i: any) => i.hazassag_id.toString());
        }
        originalSelects = [...selects];
        console.log(marriageData);
    });

    function newMarriage() {
        const temp = selects;
        temp.push("0");
        selects = temp;
    }

    function createMarriage() {
        showNewWeddingModal = !showNewWeddingModal;
    }

    async function submit() {
        for (let i in selects) {
            if (selects[i] == originalSelects[i]) continue;
            if (selects[i] == "0" && originalSelects.length - 1 >= parseInt(i)) {
                console.log("delete");
                await fetch("api/people/marriage", {
                    method: "DELETE",
                    body: JSON.stringify({
                        id: originalSelects[i],
                        ember: currentPerson
                    })
                });
                continue;
            }
            await fetch("api/people/marriage", {
                method: "POST",
                body: JSON.stringify({
                    hazassag: selects[i],
                    ember: currentPerson
                })
            });
        }
        dispatch("close");
    }
</script>

<div id="modal" class="bft-light" transition:fly={{ y: 20, duration: 100 }}>
    <div id="header">
        <h1>Házasságok</h1>
    </div>
    <form class="bft-form-fieldset">
        {#each selects as marriage, index}
            <div class="input-area bft-form-field">
                <div class="bft-input">
                    <label for={"marriage-" + index} class="hasval">Házasság</label>
                    <select name={"marriage-" + index} id={"marriage-" + index} bind:value={selects[index]}>
                        <option value="0">Nincs</option>
                        {#each marriageData as data}
                            {#if (!selects.some(i => data.id == i) && data.members < 2) || marriage == data.id}
                                <option value={data.id.toString()}>
                                    {data.ember1 || "Senki"} - {data.ember2 == data.ember1 ? "Senki" : data.ember2}
                                </option>
                                <option class="desc" disabled>
                                    &nbsp;&nbsp;&nbsp;{new Date(data.ido).toISOString().split("T")[0]}
                                </option>
                                <option class="desc" disabled>&nbsp;&nbsp;&nbsp;{data.hely}</option>
                            {/if}
                        {/each}
                    </select>
                </div>
            </div>
        {/each}
        <div class="button-area">
            <button title="Ország hozzáadása" class="myButton" on:click|preventDefault={createMarriage}
                ><svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                    ><path
                        d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"
                    /></svg
                ></button
            >
        </div>
        <div class="big-button bigger green">
            <button id="new" on:click={() => newMarriage()}>Új mező hozzáadása</button>
        </div>
        <div class="big-button red">
            <button id="close" on:click={() => dispatch("close")}>Mégsem</button>
        </div>
        <div class="big-button blue">
            <button id="submit" on:click={submit}>Mentés</button>
        </div>
    </form>
</div>
{#if showNewWeddingModal}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <NewMarriageModal
        on:close={async () => {
            createMarriage();
            marriageData = await fetch("api/marriage").then(i => i.json());
            // document.location.reload();
        }}
    />
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

    #modal {
        background-color: white;
        border-radius: 5px;
        width: 25rem;
        /* height: 30rem; */
        font-family: "Roboto", sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid black;
    }
    #header {
        width: 100%;
        display: grid;
        place-items: center;
        border-bottom: 1px solid black;
        padding: 0.5rem;
        color: hsl(0, 0%, 30%);
    }
    form {
        width: 100%;
        padding: 0.5rem;
    }
    .button-area {
        display: grid;
        place-items: center;
    }
    .bft-form-fieldset {
        gap: 0.2rem;
    }
    .big-button {
        flex: 1 0 48%;
    }

    .big-button button {
        width: 100%;
        height: 100%;
        border: 1px solid black;
        color: white;
    }
    .big-button.blue button {
        background-color: hsl(240, 100%, 30%);
    }
    .big-button.blue button:hover {
        background-color: hsl(240, 100%, 40%);
    }
    .big-button.red button {
        background-color: hsl(0, 100%, 30%);
    }
    .big-button.red button:hover {
        background-color: hsl(0, 100%, 40%);
    }
    .bigger {
        flex-basis: 80%;
    }
    .big-button.green button {
        background-color: hsl(130, 100%, 30%);
    }
    .big-button.green button:hover {
        background-color: hsl(130, 100%, 40%);
    }

    option {
        font-weight: bolder;
    }

    option.desc {
        font-weight: 100;
        font-style: italic;
    }
</style>
