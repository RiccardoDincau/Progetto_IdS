<template>
    <div class="report-wrapper" @click="goToBigReport(props.reportId)">
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

                <div class="report-interactions-container">
                    <div class="interaction-container">
                        <div class="interaction-icon-container" @click.stop="changeUpvote">
                            <svg class="interaction-svg" :class="{ 'vote-svg-clicked': hasVoted }" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">

                                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                                <g id="SVGRepo_iconCarrier">

                                    <path
                                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />

                                </g>
                            </svg>
                        </div>
                        <div class="interaction-counter">
                            <p> {{ report.votes }}</p>
                        </div>
                    </div>

                    <div class="interaction-container">
                        <div class="interaction-icon-container">
                            <svg class="interaction-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20"
                                height="20" viewBox="0 0 50 50">
                                <path
                                    d="M 25 4.0625 C 12.414063 4.0625 2.0625 12.925781 2.0625 24 C 2.0625 30.425781 5.625 36.09375 11 39.71875 C 10.992188 39.933594 11 40.265625 10.71875 41.3125 C 10.371094 42.605469 9.683594 44.4375 8.25 46.46875 L 7.21875 47.90625 L 9 47.9375 C 15.175781 47.964844 18.753906 43.90625 19.3125 43.25 C 21.136719 43.65625 23.035156 43.9375 25 43.9375 C 37.582031 43.9375 47.9375 35.074219 47.9375 24 C 47.9375 12.925781 37.582031 4.0625 25 4.0625 Z M 25 5.9375 C 36.714844 5.9375 46.0625 14.089844 46.0625 24 C 46.0625 33.910156 36.714844 42.0625 25 42.0625 C 22.996094 42.0625 21.050781 41.820313 19.21875 41.375 L 18.65625 41.25 L 18.28125 41.71875 C 18.28125 41.71875 15.390625 44.976563 10.78125 45.75 C 11.613281 44.257813 12.246094 42.871094 12.53125 41.8125 C 12.929688 40.332031 12.9375 39.3125 12.9375 39.3125 L 12.9375 38.8125 L 12.5 38.53125 C 7.273438 35.21875 3.9375 29.941406 3.9375 24 C 3.9375 14.089844 13.28125 5.9375 25 5.9375 Z">
                                </path>
                            </svg>
                        </div>
                        <div class="interaction-counter">
                            <p> {{ report.commentsNum }} </p>
                        </div>
                    </div>

                    <div class="interaction-container">
                        <div class="interaction-icon-container">
                            <svg class="interaction-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100"
                                height="100" viewBox="0 0 24 24">
                                <path
                                    d="M 16.707031 2.2929688 L 15.292969 3.7070312 L 17.585938 6 L 17 6 C 10.936593 6 6 10.936593 6 17 L 6 18 L 8 18 L 8 17 C 8 12.017407 12.017407 8 17 8 L 17.585938 8 L 15.292969 10.292969 L 16.707031 11.707031 L 21.414062 7 L 16.707031 2.2929688 z M 2 8 L 2 9 L 2 19 C 2 20.64497 3.3550302 22 5 22 L 19 22 C 20.64497 22 22 20.64497 22 19 L 22 18 L 22 17 L 20 17 L 20 18 L 20 19 C 20 19.56503 19.56503 20 19 20 L 5 20 C 4.4349698 20 4 19.56503 4 19 L 4 9 L 4 8 L 2 8 z">
                                </path>
                            </svg>
                        </div>
                    </div>
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
import tagSFC from "../tags/tagSFC.vue";
import { errorMessages } from 'vue/compiler-sfc';

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

        // await fetch(SERVERURL + "api/reports/" + props.reportId + "/image").then((res) => {
        //     if (!res.ok) isImg.value = false;
        //     else isImg.value = true;
        // })

        await fetch(SERVERURL + "api/reports/" + props.reportId + "/comments").then(async (res) => {
            if (!res.ok) report.value.commentsNum = 0;
            else report.value.commentsNum = (await res.json()).length;
        })

        updateUpVoteIcon();

        // console.log(report.value.image);
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
    if (localStorage.getItem("JWT")) {
        fetch(SERVERURL + "/api/reports/" + props.reportId + '/votes',
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "x-access-token": localStorage.getItem("JWT"),
                },
                body: JSON.stringify({ liked: !hasVoted.value })
            }).then(async (res) => {
                updateUpVoteIcon();
                if (res.ok) {
                    res = await res.json();
                    report.value.votes = res;
                }
            }).catch(() => console.log("Sorry :("));
    } else {
        window.location.hash = "#/required-login";
    }
}

async function updateUpVoteIcon() {
    if (localStorage.getItem("JWT")) {
        await fetch(SERVERURL + "api/reports/" + props.reportId + "/votes", {
            headers: {
                "x-access-token": localStorage.getItem("JWT"),
            }
        }).then(async (res) => {
            if (res.ok) {
                res = await res.json();
                hasVoted.value = res.hasVoted;
            }
        });
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


/* Vote icon style*/
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