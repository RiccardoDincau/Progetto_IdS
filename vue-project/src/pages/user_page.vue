<template>
    <div class="page-container">
        <UserInfo :email="user.email" :username="user.name" :created-reports-num="createdReportsId.length"
            :voted-reports-num="votedReportsId.length" />
        <div class="right-side-container">
            <h3 class="list-title">Segnalazioni pubblicate</h3>
            <userReportList v-if="showCreated" :reports="createdReportsId" />
            <h3 class="list-title">Segnalazioni votate</h3>
            <userReportList v-if="showVoted" :reports="votedReportsId" />
        </div>
    </div>
</template>

<script setup lang="ts">
import UserInfo from '@/components/userPageComponents/userInfo.vue';
import userReportList from '@/components/userPageComponents/userReportList.vue';

import { onMounted, onUpdated, ref } from 'vue';

const user = ref({
    email: "",
    name: "",
    reports: []
});

let createdReportsId = [];
let votedReportsId = [];

const showCreated = ref(false);
const showVoted = ref(false);


onUpdated(() => {
    if (!localStorage.getItem("JWT")) {
        window.location.hash = "#/required-login";
    }
});

onMounted(async () => {
    if (!localStorage.getItem("JWT")) {
        window.location.hash = "#/required-login";
    } else {
        let userId = localStorage.getItem("userId");
        await fetch("/api" + userId).then(async (res) => {
            if (res.ok) {
                res = await res.json();
                user.value = res;

                createdReportsId = user.value.reports;


                fetchVoted();

                showCreated.value = true;
            } else {
                alert("Utente non valido");
                localStorage.removeItem("JWT");
                localStorage.removeItem("userId");
                window.location.hash = "#/required-login";
            }
        })
    }
});


async function fetchVoted() {
    await fetch("/api/reports").then(async (res) => {
        if (res.ok) {
            res = await res.json();
            let reports = res;
            for (let report of reports) {
                await fetch("/api/reports/" + report._id + "/votes", {
                    headers: {
                        "x-access-token": localStorage.getItem("JWT"),
                    }
                }).then(async (res) => {
                    if (res.ok) {
                        res = await res.json();
                        if (res.hasVoted) {
                            votedReportsId.push(report._id);
                        }
                    }
                });
            }
            showVoted.value = true;
        }
    });
}
</script>

<style scoped>
.page-container {
    width: 100vw;
    height: 100vh;

    background-color: #D8D8D8;

    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;

    display: flex;

    padding-top: 30px;
}

.right-side-container {
    overflow-y: scroll;
}

.list-title {
    font-size: 30px;
    margin-bottom: 20px;
    margin-top: 15px;
}
</style>