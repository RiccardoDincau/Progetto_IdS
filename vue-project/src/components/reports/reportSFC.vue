<template>
    <div class="report-wrapper">
        <div v-if="fetched" class="tags-bar">
            <tagSFC :fieldValue="report.category" />
            <tagSFC :fieldValue="report.kind" />
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
                <div class="vote-container">
                    <div class="vote-icon-container" @click="changeUpvote">
                        <svg class="vote-svg" :class="upvoteClass" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">

                            <g id="SVGRepo_bgCarrier" stroke-width="0" />

                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                            <g id="SVGRepo_iconCarrier">

                                <path
                                    d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />

                            </g>
                        </svg>
                    </div>
                    <div class="vote-counter">
                        <p> {{ report.votes }}</p>
                    </div>
                </div>
            </div>

            <div class="report-image-container">
                <img :src="report.image" class="report-image">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import tagSFC from "../tags/tagSFC.vue";

const maxReportChars = 150;

const SERVERURL = "https://bpjwkxhm-8080.euw.devtunnels.ms/";
let props = defineProps(['reportId']);

let upvoteClass = ref("");
let fetched = ref(false);
const upvote = ref(false);
const report = ref({
    title: '',
    content: '',
    user: '',
    votes: 0,
    position: '',
    kind: '',
    category: '',
    state: '',
    comments: [],
    image: ''
});

const user = ref({
    name: '',
});

const fetchRep = async () => {
    try {
        let res = await fetch(SERVERURL + "api/reports/" + props.reportId);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        res = await res.json();
        report.value = res;
        if (report.value.content.length > maxReportChars) {
            report.value.content = report.value.content.slice(0, maxReportChars);
            report.value.content += "...";
        }
        // report.value.image = process.env.SERVERURL + "/report_images/" + props.reportId + "/_rep_image.jpeg";
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

function changeUpvote() {
    if (!upvoteClass.value)
        upvoteClass.value = "vote-svg-clicked";
    else
        upvoteClass.value = "";
    fetch(SERVERURL + "api/reports/" + props.reportId + '/votes',
        {
            method: "PUT",
            body: JSON.stringify({ liked: !upvote.value })
        }).catch(() => console.log("Sorry :("));
    upvote.value = !upvote.value;
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


/* Vote icon style*/
.vote-container {
    display: flex;
    align-items: center;
}

.vote-icon-container {
    padding: 5px;
}

.vote-icon-container:hover>* {
    stroke: #2DB432;
    transform: scale(1.1);
    cursor: pointer;
}

.vote-svg {
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
    animation-name: vote-clicked;
    animation-duration: 0.3s;
    animation-timing-function: ease-out;
}

@keyframes vote-clicked {
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

/* Image style */
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