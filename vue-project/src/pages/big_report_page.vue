<template>
    <div class="page-container">
        <div class="left-bar">
            <leftBar @pass-up-state="stateChanged" />
        </div>

        <div class="central-bar">
            <goBackButton @go-back-pressed="$emit('goToLastPage')" />
            <!-- <MainPage :currentSelectedState="currentSelectedState"/> -->
            <bigReport :id="props.id"></bigReport>
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
import { onMounted, ref } from 'vue';
import notificationBox from '@/components/rightBarHomepage/notifications/notificationBox.vue';
import tagSuggestionBox from '@/components/rightBarHomepage/tagBox/tagSuggestionBox.vue';
import loginButton from '@/components/rightBarHomepage/account/loginButton.vue';
import accountIcon from '@/components/rightBarHomepage/account/accountIcon.vue';
import bigReport from '@/components/bigReport/bigReport.vue';
import leftBar from '@/components/leftBarHomepage/leftBar.vue';
import goBackButton from '@/components/navigationButtons/goBackButton.vue';

let props = defineProps({ id: String });

let currentSelectedState = ref("");

const username = ref("");

function searchedTextChanged(newText){
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