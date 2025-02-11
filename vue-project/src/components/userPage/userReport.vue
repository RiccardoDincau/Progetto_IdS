<template>
    <div class="report-wrapper" @click="goToBigReport(props.reportId)">
        <div v-if="fetched" class="tags-bar">
            <tag :fieldValue="report.category" />
            <tag :fieldValue="report.kind" />
        </div>
        <div v-if="fetched" class="report-container">
            <div class="state-container">
                <div :class="'state-' + report.state" class="state-circle"></div>
            </div>

            <div class="content-contaier">
                <div class="report-title-container">
                    <h1 class="report-title">{{ report.title }}</h1>
                    <h3 class="report-username-date report-subtitle">{{ user.name }}, 3gg</h3>
                </div>

                <div class="report-position-container">
                    <h3 class="report-position report-subtitle">{{ report.position }}</h3>
                </div>

                <div class="report-content-container">
                    <p class="report-content">{{ report.content }}.</p>
                </div>

            </div>

            <div class="report-image-container" v-if="isImg">
                <img :src="report.image" class="report-image">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import tag from '../homePage/reports/tag.vue';

const maxReportChars = 150;

const SERVERURL = "";
let props = defineProps(['reportId']);

let fetched = ref(false);
let hasVoted = ref(false);

const report = ref({
    title: '',
    content: '',
    user: '',
    votes: 0,
    position: '',
    kind: '',
    category: '',
    state: '',
    commentsNum: 0,
    image: ''
});

const user = ref({
    name: '',
});

const isImg = ref(false);

const fetchRep = async () => {
    try {
        let res = await fetch(SERVERURL + "api/reports/" + props.reportId);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        res = await res.json();
        report.value = res;
        if (report.value.content.length > maxReportChars) {
            report.value.content = report.value.content.slice(0, maxReportChars);
            report.value.content += "...";
        }
        report.value.image = SERVERURL + "api/reports/" + props.reportId + "/image";

        await fetch(SERVERURL + "api/reports/" + props.reportId + "/comments").then(async (res) => {
            if (!res.ok) report.value.commentsNum = 0;
            else report.value.commentsNum = (await res.json()).length;
        })
    } catch (error) {
        console.log(error);
    }
};

const fetchUsr = async () => {
    try {
        let res = await fetch(SERVERURL + "api/users/" + report.value.user);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const resData = await res.json();
        user.value = resData;
    } catch (error) {
        console.log(error);
    }
}

function goToBigReport(reportId) {
    window.location.hash = `/big-report?id=${reportId}`;
}

onBeforeMount(async () => {
    await fetchRep();
    await fetchUsr();
    fetched.value = true;
});

</script>

<style>
.report-wrapper {
    max-width: 1000px;
    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    margin-top: 20px;
    cursor: pointer;
}

.report-container {
    background-color: white;
    border: none;
    border-radius: 20px;
    display: flex;
    padding: 10px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.state-container {
    width: 3%;
    min-width: 30px;
}

.state-circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-left: auto;
    margin-right: 0;
    margin-top: 10px;
}

.state-active {
    background-color: #2DB432;
}

.state-work_in_progress {
    background-color: #d8c707;
}

.state-archived {
    background-color: #c20000;
}

.content-contaier {
    min-width: 70%;
    max-width: 100%;
    height: 100%;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
}

.content-contaier>* {
    overflow: hidden;
}

.report-title-container {
    display: flex;
    align-items: baseline;
}

.report-title-container>* {
    margin-right: 10px;
}

.report-subtitle {
    font-weight: 400;
}

.report-position-container {
    margin-top: 8px;
}

.report-content-container {
    margin-top: 10px;
}

.report-interactions-container {
    display: flex;
}


.interaction-container {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

.interaction-icon-container {
    padding: 5px;
}

.interaction-icon-container:hover>* {
    stroke: #2DB432;
    transform: scale(1.1);
    cursor: pointer;
}

.interaction-svg {
    padding: 0;
    width: 30px;
    height: 30px;
    fill: white;
    stroke: #969898;
    stroke-width: 1.5px;
    transition-duration: 0.1s;
}

.vote-svg-clicked {
    fill: #2DB432;
    stroke: #2DB432;
    animation-name: interaction-clicked;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
}

@keyframes interaction-clicked {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}

.report-image-container {
    max-width: 30%;
    max-height: 200px;
}

.report-image {
    margin-left: auto;
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
}


.tags-bar {
    display: flex;
    padding-right: 0;
    justify-content: right;
    padding-right: 20px;
}
</style>