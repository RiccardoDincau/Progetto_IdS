<template>

    <div class="form-container">
        <h1>Crea una nuova segnalazione</h1>
        <input :class="{ 'missing-input': emptyFields.title }" v-model="reportTitle" type="text"
            placeholder="Inserisci il titolo" class="report-input report-title-input">
        <div class="form-center">
            <div class="left-center">
                <input :class="{ 'missing-input': emptyFields.position }" v-model="reportPos" type="text"
                    placeholder="Inserisci la posizione" class="report-input report-pos-input">

                <div :class="{ 'missing-input': emptyFields.kind }" class="drop-down kind-drop-down"
                    @click="toggleShowKinds">
                    <p v-if="currentSelectedKindIdx < 0">Seleziona tipo</p>
                    <p v-else>{{ kinds[currentSelectedKindIdx].text }}</p>
                    <ul class="drop-down-menu" v-if="showKinds">
                        <li v-for="kind in kinds" :key="kind.type" @click="selectedKind(kind.type)">{{ kind.text }}</li>
                    </ul>
                </div>
                <div :class="{ 'missing-input': emptyFields.category }" class="drop-down category-drop-down"
                    @click="toggleShowCategories">
                    <p v-if="currentSelectedCategoryIdx < 0">Seleziona categoria</p>
                    <p v-else>{{ categories[currentSelectedCategoryIdx].text }}</p>
                    <ul class="drop-down-menu" v-if="showCategories">
                        <li v-for="category in categories" :key="category.type"
                            @click="selectedCategory(category.type)">{{ category.text }}</li>
                    </ul>
                </div>
            </div>
            <div class="custom__image-container">
                <p>Inserire immagine</p>
                <label id="add-img-label" for="add-single-img">+</label>
                <input type="file" id="add-single-img" accept="image/jpeg" />
            </div>
        </div>

        <textarea :class="{ 'missing-input': emptyFields.content }" v-model="reportContent"
            class=" report-input report-content-input" placeholder="Inserisci la descrizione"></textarea>
        <button @click="saveReport" class="report-submit-button">Conferma</button>
    </div>

</template>

<script setup>

import { ref } from "vue"

const reportTitle = ref("");
const reportPos = ref("");
const reportContent = ref("");

const emptyFields = ref({
    title: false,
    position: false,
    content: false,
    kind: false,
    category: false
})

const kinds = ref([
    { type: "report", text: "Segnalazione" },
    { type: "suggestion", text: "Suggerimento" },
    { type: "complaint", text: "Reclamo" },
]);

const categories = ref([
    { type: "lights", text: "Luci" },
    { type: "road", text: "Strade" },
    { type: "trash", text: "Spazzatura" },
]);

const showKinds = ref(false);
const currentSelectedKindIdx = ref(-1);

function toggleShowKinds() {
    showKinds.value = !showKinds.value;
}

function selectedKind(type) {
    for (let i = 0; i < kinds.value.length; i++) {
        if (kinds.value[i].type === type) {
            currentSelectedKindIdx.value = i;
            break;
        }
    }
}

const showCategories = ref(false);
const currentSelectedCategoryIdx = ref(-1);

function toggleShowCategories() {
    showCategories.value = !showCategories.value;
}

function selectedCategory(type) {
    for (let i = 0; i < categories.value.length; i++) {
        if (categories.value[i].type === type) {
            currentSelectedCategoryIdx.value = i;
            break;
        }
    }
}


async function saveReport() {

    let valid = true;
    if (reportTitle.value == "") {
        valid = false;
        emptyFields.value.title = true;
    }

    if (reportContent.value == "") {
        valid = false;
        emptyFields.value.content = true;
    }

    if (reportPos.value == "") {
        valid = false;
        emptyFields.value.position = true;
    }

    if (currentSelectedKindIdx.value < 0) {
        valid = false;
        emptyFields.value.kind = true;
    }

    if (currentSelectedCategoryIdx.value < 0) {
        valid = false;
        emptyFields.value.category = true;
    }

    if (!valid) return;

    let report = {
        title: reportTitle.value,
        content: reportContent.value,
        position: reportPos.value,
        kind: kinds.value[currentSelectedKindIdx.value].type,
        category: categories.value[currentSelectedCategoryIdx.value].type,
        state: "active"
    };


    let response = await fetch("/api/reports",
        {
            method: "POST",
            headers: { "x-access-token": localStorage.getItem("JWT"), "Content-type": "application/json" },
            body: JSON.stringify(report)
        });
}


</script>

<style scoped>
.form-container {
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
}

.report-input {
    background-color: #EDEDED;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid black;
}

.report-title-input {
    font-size: 40px;
    margin-top: 10px;
}

.form-center {
    margin-top: 70px;
    display: flex;
    justify-content: space-between;

    margin-bottom: 20px;
}

.report-image-input {
    width: 100px;
    height: 100px;
}

.custom__form input {
    opacity: 0;
    height: 0;
}

.custom__image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.custom__image-container label {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 150%;
    cursor: pointer;
    width: 200px;
    height: 200px;
    border: solid 1px black;
    border-radius: 5px;
    object-fit: cover;
}

.custom__image-container img {
    width: 100px;
    height: 100px;
    border: solid 1px black;
    border-radius: 5px;
    object-fit: cover;
}

#add-single-img {
    display: none;
}

.custom__image-container {
    margin-right: 0;
}

.report-content-input {
    resize: none;
    height: 200px;
}

.report-submit-button {
    max-width: 30%;
    margin: auto;
    margin-top: 30px;
    font-size: 20px;
    padding: 15px;
    border-radius: 10px;
    background-color: #00483A;
    color: white;
    border: none;
    cursor: pointer;
}

.report-pos-input {
    width: 300px;
    padding: 6px;
    font-size: 20px;
    margin-bottom: 30px;
}

.drop-down {
    margin-top: 10px;
    background-color: #EDEDED;
    border: 1px solid black;
    padding: 5px;
    border-radius: 5px;
    width: 150px;
    cursor: pointer;
}

.drop-down-menu {
    list-style: none;
}

.drop-down-menu>* {
    border: 1px solid black;
    padding: 5px;
    background-color: white;
    border-radius: 10px;
    margin: 2px;
    margin-top: 3px;
    transition-duration: 0.2s;
}

.drop-down-menu>*:hover {
    border: 3px solid #00483A;
    margin: 0px;
    margin-top: 1px;
}

.missing-input {
    border: 3px solid red;
}
</style>