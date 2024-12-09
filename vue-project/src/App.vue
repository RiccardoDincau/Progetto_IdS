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
                    <button class="filter-button shaded">FILTRI</button>
                    <button class="filter-button shaded">ORDINA PER</button>
                </div>

            </div>

            <ReportList v-if="currentSelectedState" :state="currentSelectedState" />
        </div>
        <div class="right-bar">
            <NotificationBoxSFC>
            <div class="suggested-tags-bar">

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ReportList from "./components/reportListSFC.vue";
import StateButtonList from "./components/stateButtonListSFC.vue";
import NotificationBoxSFC from './components/notificationBoxSFC.vue';

let currentSelectedState = ref("");


function stateChanged(newState) {
    console.log("State changed", newState);
    currentSelectedState.value = newState;
}
</script>