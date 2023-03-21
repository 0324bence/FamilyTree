<script lang="ts">
    import { fly } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    import { json } from "@sveltejs/kit";

    const dispatch = createEventDispatcher();
    let data: any = [];
    let kereszt_nev = "";
    let vezetek_nev = "";
    let szül_ido = "";
    let gender = "0";
    let dad: string = "0";
    let mom: string = "0";
    let children = ["0"];

    onMount(async () => {
        const res = await fetch("api/people").then(i => i.json());
        if (res.rows) {
            data = res.rows;
        } else {
            data = res[0];
        }
        console.log(data);
    });

    async function submit() {
        await fetch("api/people", {
            method: "POST",
            body: JSON.stringify({
                kereszt_nev,
                vezetek_nev,
                szül_ido,
                isferfi: gender == "1",
                apja: dad != "0" ? dad : undefined,
                anyja: mom != "0" ? mom : undefined
            })
        })
            .then(res => res.text())
            .then(async res => {
                for (let child of children) {
                    console.log(res);
                    if (child == "0") continue;
                    console.log(child);
                    await fetch("api/people", {
                        method: "PATCH",
                        body: JSON.stringify({
                            id: child.toString(),
                            apja: gender == "1" ? res : undefined,
                            anyja: gender == "0" ? res : undefined
                        })
                    });
                }
            });
        dispatch("close");
    }

    function addChild() {
        children.push("0");
        const temp = children;
        temp.push("0");
        children = temp;
    }
</script>

<div id="modal" class="bft-light" transition:fly={{ y: 20, duration: 100 }}>
    <div id="header">
        <h1>Új ember</h1>
    </div>
    <form class="bft-form-fieldset" on:submit|preventDefault>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="vezetek_nev" class="hasval">Vezeték név</label>
                <input required type="text" name="vezetek_nev" id="vezetek_nev" bind:value={vezetek_nev} />
            </div>
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="kereszt_nev" class="hasval">Kereszt név</label>
                <input required type="text" name="kereszt_nev" id="kereszt_nev" bind:value={kereszt_nev} />
            </div>
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="szül_ido" class="hasval">Születés ideje</label>
                <input required type="date" name="szül_ido" id="szül_ido" bind:value={szül_ido} />
            </div>
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="isFerfi" class="hasval">Nem</label>
                <select name="isFerfi" id="isFerfi" bind:value={gender}>
                    <option value="0">Nő</option>
                    <option value="1">Férfi</option>
                </select>
            </div>
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="dad" class="hasval">Apja</label>
                <select name="dad" id="dad" bind:value={dad}>
                    <option value="0">Senki</option>
                    {#each data as person}
                        {#if person.id != mom}
                            <option value={person.id}>{person.vezetek_nev + " " + person.kereszt_nev}</option>
                        {/if}
                    {/each}
                </select>
            </div>
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="mom" class="hasval">Anyja</label>
                <select name="mom" id="mom" bind:value={mom}>
                    <option value="0">Senki</option>
                    {#each data as person}
                        {#if person.id != dad}
                            <option value={person.id}>{person.vezetek_nev + " " + person.kereszt_nev}</option>
                        {/if}
                    {/each}
                </select>
            </div>
        </div>
        {#each children as child, index}
            <div class="input-area bft-form-field">
                <div class="bft-input">
                    <label for={"child-" + index} class="hasval">Gyerek</label>
                    <select name={"child-" + index} id={"child-" + index} bind:value={children[index]}>
                        <option value="0">Senki</option>
                        {#each data as person}
                            {#if !children.some(i => person.id == i) || child == person.id}
                                <option value={person.id}>{person.vezetek_nev + " " + person.kereszt_nev}</option>
                            {/if}
                        {/each}
                    </select>
                </div>
            </div>
        {/each}
        <div class="big-button bigger green">
            <button on:click|preventDefault={addChild}>Új gyerek hozzáadása</button>
        </div>
        <div class="big-button red">
            <button on:click={() => dispatch("close")}>Mégsem</button>
        </div>
        <div class="big-button blue">
            <button type="submit" on:click={submit}>Hozzáadás</button>
        </div>
    </form>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

    #modal {
        background-color: white;
        /* position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%); */
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
    .myButton.red {
        background-color: hsl(0, 100%, 25%);
    }
    .myButton.red:hover {
        background-color: hsl(0, 100%, 45%);
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

    .big-button.green button {
        background-color: hsl(131, 100%, 30%);
    }
    .big-button.green button:hover {
        background-color: hsl(131, 100%, 40%);
    }
    .bigger {
        flex: 1 0 90%;
    }
</style>
