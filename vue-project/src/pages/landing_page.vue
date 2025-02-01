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
                    <!-- <input class="search-bar" type="text" placeholder="Cerca..."> -->
                    <searchBarSCC @in-focus="searchedTextChanged" />
                </div>
                <div class="filter-buttons-container">
                    <FilterButtonSCC @filter-changed="filterChanged" />
                    <button class="filter-button shaded">ORDINA PER</button>
                </div>

            </div>

            <ReportList v-if="currentSelectedState" :state="currentSelectedState" :kind="currentFilters.kind"
                :category="currentFilters.category" :text="currentSearchedText" />
        </div>
        <div class="right-bar">
            <LoginButtonSFC v-if="!username" />
            <AccountIcon v-else :username="username" @logout="logout" />

            <NotificationBoxSFC />
            <div class="suggested-tags-bar">
                <TagSuggestionBoxSFC />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ReportList from "../components/reports/reportListSFC.vue";
import StateButtonList from "../components/stateButtonListSFC.vue";
import NotificationBoxSFC from '../components/notifications/notificationBoxSFC.vue';
import TagSuggestionBoxSFC from '../components/tags/tagSuggestionBoxSFC.vue';
import FilterButtonSCC from '../components/filterButtons/filterButtonSCC.vue';
import LoginButtonSFC from '../components/account/loginButtonSFC.vue';
import AccountIcon from '../components/account/accountIconSFC.vue';
import searchBarSCC from '../components/filterButtons/searchBarSCC.vue';

let currentSelectedState = ref("");
let currentFilters = ref({
    kind: null,
    category: null
});
let currentSearchedText = ref("");

const username = ref("");

function searchedTextChanged(newText){
    currentSearchedText.value = newText;
}

function stateChanged(newState) {
    // console.log("State changed", newState);
    currentSelectedState.value = newState;
}

function filterChanged(newFilters) {
    // console.log("Filters changed", newFilters);
    currentFilters.value = newFilters;
}

onMounted(() => {
    let userId = localStorage.getItem("userId");

    if (userId && userId !== "") {
        fetch("/api" + userId).then(async (res) => {
            if (res.status != 200) {
                localStorage.removeItem("userId");
            } else {
                username.value = (await res.json()).name;
            }
        })
    }
});

function logout() {
    username.value = undefined;
}
</script>