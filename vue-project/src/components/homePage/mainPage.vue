<template>
    <div class="filter-options-bar">
        <div class="search-bar-container shaded">
            <searchBar @in-focus="searchedTextChanged" />
        </div>
        <div class="filter-buttons-container">
            <filterButton @filter-changed="filterChanged" />
            <orderButton @order-changed="orderChanged"></orderButton>
        </div>
    </div>

    <reportList v-if="currentSelectedState" :state="currentSelectedState" :kind="currentFilters.kind"
        :category="currentFilters.category" :text="currentSearchedText" :order="currentOrder" />

    <div @click="goToNewReport" class="new-report-button">
        <h3>+</h3>
    </div>
</template>


<script setup>
import reportList from "./reports/reportList.vue";
import filterButton from "./filterButtons/filterButton.vue";
import searchBar from "./filterButtons/searchBar.vue";
import orderButton from "./filterButtons/orderButton.vue";

import { ref } from "vue";

let currentFilters = ref({
    kind: null,
    category: null
});

const props = defineProps(["currentSelectedState", "currentFilters"]);

let currentSearchedText = ref("");
let currentOrder = ref("votes-up")

function searchedTextChanged(newText) {
    currentSearchedText.value = newText;
}

function filterChanged(newFilters) {
    currentFilters.value = newFilters;
}

function orderChanged(newOrder) {
    currentOrder.value = newOrder;
}

function goToNewReport() {
    window.location.hash = "#/new-report";
}
</script>

<style lang="css" scoped>
.filter-options-bar {
    position: sticky;
    top: 20px;
    max-width: 1000px;
    margin: auto;
    display: flex;
    margin-top: 20px;
    height: 40px;
}

.search-bar-container {
    width: 60%;
    min-width: 200px;
    background-color: white;
    height: 100%;
    border-radius: 10px;
    padding-left: 10px;
    display: flex;
    align-items: center;
}

.search-bar {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: none;
    margin-left: 3px;
}

.search-bar:focus {
    outline: none;
    border: none;
}

.filter-buttons-container {
    width: 200px;
    margin-left: auto;
    margin-right: 0;
    display: flex;
    justify-content: right;
}

.search-icon {
    width: 15px;
    height: 15px;
}

.new-report-button {
    position: absolute;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #00483A;
    color: white;
    text-align: center;
    margin: 5px;
    font-size: 45px;

    bottom: 30px;
    right: 25%;

    transition-duration: 0.3s;
}

.new-report-button:hover {
    cursor: pointer;
    rotate: 180deg;
    padding: 5px;
    margin: 0px;
}
</style>