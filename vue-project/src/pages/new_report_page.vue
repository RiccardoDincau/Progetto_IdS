<template>
    <div class="page-container">
        <div class="left-bar">
            <LeftBar @pass-up-state="stateChanged" />
        </div>

        <div class="central-bar">
            <GoBackButton @go-back-pressed="$emit('goToLastPage')" />
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
import { onMounted, onUpdated, ref } from 'vue';
import NotificationBoxSFC from '../components/notifications/notificationBoxSFC.vue';
import TagSuggestionBoxSFC from '../components/tags/tagSuggestionBoxSFC.vue';
import LoginButtonSFC from '../components/account/loginButtonSFC.vue';
import AccountIcon from '../components/account/accountIconSFC.vue';
import NewReportPage from "../components/landing_page_center/newReportPage.vue"
import LeftBar from '@/components/landing_page_center/leftBar.vue';
import GoBackButton from '@/components/navigationButtons/goBackButton.vue';

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
    if (!localStorage.getItem("JWT")) {
        window.location.hash = "#/required-login";
    }

    let userId = localStorage.getItem("userId");

    if (userId && userId !== "") {
        fetch("/api" + userId).then(async (res) => {
            if (!res.ok) {
                localStorage.removeItem("userId");
            } else {
                username.value = (await res.json()).name;
            }
        })
    }
});

onUpdated(() => {
    if (!localStorage.getItem("JWT")) {
        window.location.hash = "#/";
    }
})

function logout() {
    username.value = undefined;
}
</script>