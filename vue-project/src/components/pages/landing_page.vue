<template>
    <div class="page-container">
        <div class="left-bar">
            <div class="logo-title-container">
                <div class="logo-container">
                    <!-- <img src="resources/logo.png" class="logo"> -->
                </div>
                <div class="logo-title">
                    <h1 class="title">Treport</h1>
                </div>
            </div>

            <StateButtonList @state-changed="stateChanged" />

        </div>

        <div class="central-bar">
            <div class="filter-options-bar">
                <div class="search-bar-container shaded">
                    <!-- <img class="search-icon" src="./resources/search-icon.png"> -->
                    <input class="search-bar" type="text" placeholder="Cerca...">
                </div>
                <div class="filter-buttons-container">
                    <FilterButtonSCC @filter-changed="filterChanged" />
                    <button class="filter-button shaded">ORDINA PER</button>
                </div>

            </div>

            <ReportList v-if="currentSelectedState" :state="currentSelectedState" :kind="currentFilters.kind"
                :category="currentFilters.category" />
        </div>
        <div class="right-bar">
            <LoginButtonSFC />
            <NotificationBoxSFC />
            <div class="suggested-tags-bar">
                <TagSuggestionBoxSFC />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ReportList from "../reports/reportListSFC.vue";
import StateButtonList from "../stateButtonListSFC.vue";
import NotificationBoxSFC from '../notifications/notificationBoxSFC.vue';
import TagSuggestionBoxSFC from '../tags/tagSuggestionBoxSFC.vue';
import FilterButtonSCC from '../filterButtons/filterButtonSCC.vue';
import LoginButtonSFC from '../account/loginButtonSFC.vue';

let currentSelectedState = ref("");
let currentFilters = ref({
    kind: null,
    category: null
});

function stateChanged(newState) {
    console.log("State changed", newState);
    currentSelectedState.value = newState;
}

function filterChanged(newFilters) {
    console.log("Filters changed", newFilters);
    currentFilters.value = newFilters;
}

</script>