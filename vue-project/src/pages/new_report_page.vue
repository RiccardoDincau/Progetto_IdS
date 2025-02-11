<template>
    <div class="page-container">
        <div class="left-bar">
            <leftBar @pass-up-state="stateChanged" />
        </div>

        <div class="central-bar">
            <goBackButton @go-back-pressed="$emit('goToLastPage')" />
            <newReportPage />
        </div>
        <div class="right-bar">
            <loginButton v-if="!username" />
            <accountIcon v-else :username="username" @logout="logout" />

            <notificationBox />
            <div class="suggested-tags-bar">
                <tagSuggestionBox />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import notificationBox from '@/components/rightBarHomepage/notifications/notificationBox.vue';
import tagSuggestionBox from '@/components/rightBarHomepage/tagBox/tagSuggestionBox.vue';
import loginButton from '@/components/rightBarHomepage/account/loginButton.vue';
import accountIcon from '@/components/rightBarHomepage/account/accountIcon.vue';
import newReportPage from '@/components/newReport/newReportPage.vue';
import leftBar from '@/components/leftBarHomepage/leftBar.vue';
import goBackButton from '@/components/navigationButtons/goBackButton.vue';

let currentSelectedState = ref("");

const username = ref("");

function stateChanged(newState) {
    // console.log("State changed", newState);
    currentSelectedState.value = newState;
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