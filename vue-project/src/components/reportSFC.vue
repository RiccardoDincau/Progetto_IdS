<template>
    <div class="report-wrapper">
        <tagSFC :kind="'strada'" :category="'strada'" />
        <div class="report-container">
            <div class="state-container">
                <div class="state-circle"></div>
            </div>

            <div class="content-contaier">
                <div class="report-title-container">
                    <h1 class="report-title">{{ report.title }}</h1>
                    <h3 class="report-username-date report-subtitle">{{ user.username }}, 3gg</h3>
                </div>

                <div class="report-position-container">
                    <h3 class="report-position report-subtitle">{{ report.position }}</h3>

                </div>

                <div class="report-content-container">
                    <p class="report-content">{{ report.content }}.</p>
                </div>
                <div class="vote-container" :class="upvoteClass" @click="changeUpvote">
                    <svg class="vote-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">

                        <g id="SVGRepo_bgCarrier" stroke-width="0" />

                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                        <g id="SVGRepo_iconCarrier">

                            <path
                                d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />

                        </g>
                    </svg>
                </div>
            </div>

            <div class="report-image-container">
                <img :src="report.image" class="report-image">
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import tagSFC from "./tagSFC.vue";

const SERVERURL = "http://localhost:8080/";
let props = defineProps(['reportId']);
let upvoteClass = ref("");


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
    username: ''
});

const fetchRep = async () => {
    try {
        let res = await fetch(SERVERURL + "api/reports/" + props.reportId);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        res = await res.json();
        report.value = res;
        if (report.value.content.length > 150) {
            report.value.content = report.value.content.slice(0, 150);
            report.value.content += "...";
        }
        report.value.image = process.env.SERVERURL + "/report_images/" + props.reportId + "/_rep_image.jpeg";
    } catch (error) {
        console.log(error);
    }
};

const fetchUsr = async () => {
    try {
        await fetch(SERVERURL + "/api/users/" + report.user);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const resData = await res.json();
        user.value = resData;
    } catch (error) {
        console.log(error);
    }
}

function change() {
    if (!upvoteClass)
        upvoteClass = "vote-container-clicked";
    else
        upvoteClass = "";
    fetch(SERVERURL + "/api/reports/" + reportId + '/votes',
        {
            method: "PUT",
            body: JSON.stringify({ liked: !upvote.value })
        });
    upvote.value = !upvote.value;
}
onMounted(async () => {
    await fetchRep();
    await fetchUsr();
    change
});

</script>

<style>
* {
    padding: 0;
    margin: 0;
}

body {
    background-color: #D8D8D8;
}

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
    background-color: #2DB432;
    border-radius: 50%;
    margin-left: auto;
    margin-right: 0;
    margin-top: 10px;
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

.vote-container {
    height: 50px;
    width: 30px;
    margin-bottom: 0;
}

.vote-container:hover>* {
    fill: #2DB432;
    margin-bottom: 5px;
    margin-top: 5px;
    cursor: pointer;
}

.vote-container-clicked>* {
    fill: #2DB432;
    margin-bottom: 5px;
    margin-top: 5px;
    cursor: pointer;
}


.vote-svg {
    padding: 0;
    width: 30px;
    height: 30px;
    fill: white;
    stroke: #2DB432;
    transition-duration: 0.1s;
    margin-bottom: 0;
    margin-top: 10px;
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

.report-tag {
    margin-left: 10px;
    color: black;
    padding: 5px 20px 2px 20px;
    background-color: red;
    border-radius: 10px 10px 0 0;
    margin-top: 5px;
    transition-duration: 0.2s;
    /* box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2); */
}

.report-tag:hover {
    padding-bottom: 5px;
    margin-top: 0;
    cursor: pointer;
}

.report-type-tag {
    background-color: #CA4B2E;
}

.lights-type-tag {
    background-color: #E6A704;
}

.complaint-type-tag {
    background-color: #d84f05;
}

.road-type-tag {
    background-color: #8490F9;
}
</style>