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
            <NewReportPage />
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
import StateButtonList from "../components/stateButtonListSFC.vue";
import NotificationBoxSFC from '../components/notifications/notificationBoxSFC.vue';
import TagSuggestionBoxSFC from '../components/tags/tagSuggestionBoxSFC.vue';
import LoginButtonSFC from '../components/account/loginButtonSFC.vue';
import AccountIcon from '../components/account/accountIconSFC.vue';
import NewReportPage from "../components/landing_page_center/newReportPage.vue"

let currentSelectedState = ref("");
let currentFilters = ref({
    kind: null,
    category: null
});

const username = ref("");

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