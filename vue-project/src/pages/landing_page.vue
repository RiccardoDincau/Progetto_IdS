<template>
    <div class="page-container">
        <div class="left-bar">
            <LeftBar @pass-up-state="stateChanged" />
        </div>

        <div class="central-bar">
            <MainPage :currentSelectedState="currentSelectedState" />
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
import NotificationBoxSFC from '../components/notifications/notificationBoxSFC.vue';
import TagSuggestionBoxSFC from '../components/tags/tagSuggestionBoxSFC.vue';
import LoginButtonSFC from '../components/account/loginButtonSFC.vue';
import AccountIcon from '../components/account/accountIconSFC.vue';
import MainPage from "../components/landing_page_center/mainPage.vue"
import LeftBar from '@/components/landing_page_center/leftBar.vue';

let currentSelectedState = ref("");


const username = ref("");

function searchedTextChanged(newText) {
    currentSearchedText.value = newText;
}

function stateChanged(newState) {
    // console.log("State changed", newState);
    currentSelectedState.value = newState;
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