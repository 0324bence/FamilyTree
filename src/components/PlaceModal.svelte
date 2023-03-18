<script lang="ts">
    import { fly } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";
    export let title: string;
    export let current: string;

    const dispatch = createEventDispatcher();

    let data: { countries: any[]; places: any[] } = {
        countries: [],
        places: []
    };
    let countries = data.countries;
    let places = data.places;
    let userCountry = "0";
    let selectedCountry = userCountry;
    let selectedPlace = (current || "0").toString();

    $: {
        selectedCountry = userCountry;
    }

    $: {
        if (selectedCountry != userCountry) {
            selectedPlace = "0";
        } else {
            selectedPlace = (current || "0").toString();
        }
    }

    async function getData() {
        console.log("data got");
        const data = await fetch("api/places").then(res => res.json());
        for (let i of data.places) {
            if (i.iranyitoszam == current) {
                userCountry = i.orszag;
                break;
            }
        }
        countries = data.countries;
        places = data.places;
    }

    onMount(async () => {
        await getData();
    });

    async function addCountry() {
        const newCountry = prompt("Új ország:");
        if (!newCountry) return;
        console.log(newCountry);
        await fetch("api/places/countries", {
            method: "POST",
            body: JSON.stringify({
                nev: newCountry
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        await getData();
    }

    async function deleteCountry() {
        if (!selectedCountry || selectedCountry == "0") return;
        const isOK = confirm(
            "Biztosan törölni akarja a kiválasztott országot?\nEzzel törli az országban lévő összes települést is!"
        );
        if (!isOK) return;
        await fetch("api/places/countries", {
            method: "DELETE",
            body: JSON.stringify({
                id: selectedCountry
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        await getData();
        dispatch("close");
    }

    async function addPlace() {
        if (!selectedCountry || selectedCountry == "0") return;
        const locale: { [key: string]: string } = {
            county: "Megye",
            code: "Irányítószám",
            place: "Helység"
        };
        const newPlace: { [key: string]: string } = {
            county: "",
            code: "",
            place: ""
        };
        for (let i in newPlace) {
            const value = prompt(
                `${locale["county"]}: ${newPlace["county"]}\n${locale["code"]}: ${newPlace["code"]}\n${locale["place"]}: ${newPlace["place"]}\n\n${locale[i]}: `
            );
            if (!value) return;
            newPlace[i] = value;
        }
        console.log(newPlace);
        await fetch("api/places/places", {
            method: "POST",
            body: JSON.stringify({
                iranyitoszam: newPlace.code,
                megye: newPlace.county,
                helyseg: newPlace.place,
                orszag: selectedCountry
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        await getData();
    }

    async function deletePlace() {
        if (!selectedPlace || selectedPlace == "0") return;
        const isOK = confirm("Biztosan törölni akarja a kiválasztott helységet?");
        if (!isOK) return;
        await fetch("api/places/places", {
            method: "DELETE",
            body: JSON.stringify({
                iranyitoszam: selectedPlace
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        await getData();
        selectedPlace = "0";
        // dispatch("close");
    }
</script>

<div id="modal" class="bft-light" transition:fly={{ y: 20, duration: 100 }}>
    <div id="header">
        <h1>{title}</h1>
    </div>
    <form class="bft-form-fieldset">
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="country" class="hasval">Ország</label>
                <select name="country" id="country-select" bind:value={selectedCountry}>
                    <option value="0" disabled>Válasszon országot...</option>
                    {#each countries as country}
                        <option value={country.id}>
                            {country.nev}
                        </option>
                    {:else}
                        <option value="0">Loading...</option>
                    {/each}
                </select>
            </div>
        </div>
        <div class="button-area">
            <!--  -->
            <button title="Ország törlése" class="myButton red" on:click|preventDefault={deleteCountry}>
                <svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                    />
                </svg>
            </button>
        </div>
        <div class="button-area">
            <button title="Ország hozzáadása" class="myButton" on:click|preventDefault={addCountry}
                ><svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                    ><path
                        d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"
                    /></svg
                ></button
            >
        </div>
        <div class="input-area bft-form-field">
            <div class="bft-input">
                <label for="place" class="hasval">Település</label>
                <select name="place" id="place-select" bind:value={selectedPlace}>
                    {#if selectedCountry == "0"}
                        <option value="0" disabled>Válasszon országot...</option>
                    {:else}
                        <option value="0" selected disabled>Válasszon helységet...</option>
                        {#each places as place}
                            {#if place.orszag == selectedCountry}
                                <option value={place.iranyitoszam}>
                                    {place.display}
                                </option>
                            {/if}
                        {:else}
                            <option value="0">Loading...</option>
                        {/each}
                    {/if}
                </select>
            </div>
        </div>
        <div class="button-area">
            <!--  -->
            <button title="Helység törlése" class="myButton red" on:click|preventDefault={deletePlace}>
                <svg width="25" height="25" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                    />
                </svg>
            </button>
        </div>
        <div class="button-area">
            <button title="Helység hozzáadása" class="myButton" on:click|preventDefault={addPlace}
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
    .bft-form-fieldset {
        gap: 0.2rem;
    }
    .myButton.red {
        background-color: hsl(0, 100%, 25%);
    }
    .myButton.red:hover {
        background-color: hsl(0, 100%, 45%);
    }
</style>
