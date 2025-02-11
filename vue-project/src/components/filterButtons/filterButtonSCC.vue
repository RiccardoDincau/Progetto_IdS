<template>
    <div :class="{ 'wide-button-container': showMenu }" class="filter-button-container">
        <button :class="{ 'wide-filter': showMenu }" class="filter-button shaded"
            @click="showMenu = !showMenu">FILTRI</button>

        <div class="filter-menu-container" v-if="showMenu">
            <div class="position-filter-container">
                <p>Google maps</p>
            </div>
            <div class="kind-filter-container filter-cosntainer">
                <ul class="filter-list">
                    <li v-for="kind in kinds" :key="kind.type" class="filter-item"
                        :class="{ 'filter-item-pressed': kind.pressed }" @click="filterButtonPressed(true, kind.type)">
                        {{ kind.text }}
                    </li>
                </ul>
            </div>
            <div class="category-filter-container filter-container">
                <ul class="filter-list">
                    <li v-for="category in categories" :key="category.type" class="filter-item"
                        :class="{ 'filter-item-pressed': category.pressed }"
                        @click="filterButtonPressed(false, category.type)">
                        {{ category.text }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let showMenu = ref(false);

let emit = defineEmits(["filterChanged"]);

const kinds = ref([
    { type: "report", text: "segnalazione", pressed: false },
    { type: "suggestion", text: "suggerimento", pressed: false },
    { type: "complaint", text: "reclamo", pressed: false },
]);

const categories = ref([
    { type: "lights", text: "luci", pressed: false },
    { type: "road", text: "strade", pressed: false },
    { type: "trash", text: "spazzatura", pressed: false },
]);

function filterButtonPressed(isKind, type) {
    if (isKind) {
        for (let kind of kinds.value) {
            if (kind.type != type || kind.pressed) kind.pressed = false;
            else {
                kind.pressed = true;
            }
        }
    } else {
        for (let category of categories.value) {
            if (category.type != type || category.pressed) category.pressed = false;
            else {
                category.pressed = true;
            }
        }
    }

    let requiredFilters = {
        kind: null,
        category: null,
    };

    for (let kind of kinds.value) {
        if (kind.pressed) requiredFilters.kind = kind.type;
    }

    for (let category of categories.value) {
        if (category.pressed) requiredFilters.category = category.type;
    }

    emit("filterChanged", requiredFilters);
}

</script>

<style>
.wide-button-container {
    width: 140px;
    border-radius: 20px 20px 0 0;
    background-color: white;
}

.filter-button {
    height: 90%;
    padding: 3px 10px;
    margin: auto;
    margin-left: 7px;
    margin-right: 0;
    border-radius: 10px;
    border: none;
    border: 3px solid #ffffff;
    cursor: pointer;
    text-align: center;
    background-color: white;
}

.filter-button:active {
    border: 3px solid #00483A;
    transition-duration: 0.1s;
}

.wide-filter {
    width: 100%;
    margin: 0;
}

.shaded {
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.filter-menu-container {
    transition-duration: 1s;
    width: 120px;
    background-color: white;
    margin: auto;
    padding: 10px;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.filter-list {
    list-style: none;
}

.filter-container {
    margin-top: 10px;
    /* background-color: rgba(0, 0, 0, 0.1); */
    padding: 2px;
}

.filter-item {
    margin-top: 8px;
    margin-bottom: 8px;
    border-bottom: 3px solid transparent;
    padding-left: 7px;
}

.filter-item:hover {
    cursor: pointer;
    border-bottom: 3px solid #00483A;
}

.filter-item-pressed {
    background-color: #00483A;
    color: white;
}
</style>