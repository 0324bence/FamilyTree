<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    export let title: string;
    export let current: string;

    let data: { countries: any[]; places: any[] } = {
        countries: [],
        places: []
    };
    let userCountry = 0;

    onMount(async () => {
        data = await fetch("api/places").then(res => res.json());
        for (let i of data.places) {
            if (i.iranyitoszam == current) {
                userCountry = i.orszag;
                break;
            }
        }
    });
</script>

<div id="modal" class="bft-light" transition:fly={{ y: 20, duration: 100 }}>
    <div id="header">
        <h1>{title}</h1>
    </div>
    <form class="bft-form-fieldset">
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="country" class="hasval">Ország</label>
                <select name="country" id="country-select">
                    {#each data.countries as country}
                        <option value={country.id} selected={userCountry == country.id ? true : false}
                            >{country.nev}</option
                        >
                    {:else}
                        <option value="0">Loading...</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="button-area">
            <button class="myButton"
                ><svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                    ><path
                        d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"
                    /></svg
                ></button
            >
        </div>
    </form>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");

    #modal {
        background-color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 15px;
        width: 25rem;
        height: 30rem;
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
</style>
