<template>
    <div class="report-wrapper">

        <div v-if="districtUser" class="change-state-container">
            <button :class="'change-state-' + report.state" class="state-button" @click="showStates = !showStates">
                <h1>Cambia stato</h1>
                <ul v-if="showStates" class="stateList">
                    <li v-for="state in states" :class="'change-state-' + state.type"
                        @click.stop="changeState(state.type)">
                        {{ state.text }}
                    </li>
                </ul>
            </button>
        </div>

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
                    <p class="report-content">{{ report.content }}</p>
                </div>
                <div class="report-interactions-container">
                    <div class="interaction-container">
                        <div class="interaction-icon-container" @click="changeUpvote">
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
                            <svg class="interaction-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50"
                                height="50" viewBox="0 0 48 48">
                                <path
                                    d="M 27.478516 7 A 1.50015 1.50015 0 0 0 26 8.5 L 26 16.285156 C 23.342281 16.581601 18.972916 17.343283 14.574219 20.191406 C 9.5799927 23.42513 5.1401785 29.370264 5.0371094 39.185547 C 5.0356094 39.193047 5.0307869 39.197598 5.0292969 39.205078 L 5.0332031 39.205078 C 5.0321348 39.313011 5 39.391123 5 39.5 A 1.50015 1.50015 0 0 0 7.9707031 39.794922 C 9.1580428 33.858682 12.859175 31.228006 16.960938 29.878906 C 20.422894 28.740243 23.812407 28.73987 26 28.855469 L 26 36.5 A 1.50015 1.50015 0 0 0 28.560547 37.560547 L 42.560547 23.560547 A 1.50015 1.50015 0 0 0 42.560547 21.439453 L 28.560547 7.4394531 A 1.50015 1.50015 0 0 0 27.478516 7 z M 29 12.121094 L 39.378906 22.5 L 29 32.878906 L 29 27.384766 A 1.50015 1.50015 0 0 0 27.640625 25.890625 C 25.556671 25.695502 20.789675 25.461646 16.023438 27.029297 C 13.79672 27.761681 11.585426 28.994302 9.6875 30.755859 C 11.206563 27.041671 13.545736 24.432841 16.205078 22.710938 C 20.579045 19.878826 25.605232 19.19049 27.609375 19.042969 A 1.50015 1.50015 0 0 0 29 17.546875 L 29 12.121094 z">
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
        <CommentListSFC @comment-sent="commentCorrectlySent" @thereIsContent="(val) => { commentIsReadyToPost = val }"
            :report-id="reportId">
        </CommentListSFC>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import tagSFC from '../tags/tagSFC.vue';
import CommentListSFC from '../comments/commentListSFC.vue';
import { provide } from 'vue'

let props = defineProps({ id: String });

const isImg = ref(false);
let hasVoted = ref(false);
let fetched = ref(false);
let districtUser = ref(false);
let showStates = ref(false);
let reportId = ref(null);
let commentIsReadyToPost = ref(false);
const SERVERURL = "";
let newSelectedState;


const count = ref(0)
provide('sendCommentTrigger', count)

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

const states = ref([
    { type: "active", text: "Attiva" },
    { type: "work_in_progress", text: "Presa in carico" },
    { type: "archived", text: "Archiviata" },
]);

computed(() => {
    reportId.value = props.id;
});

function commentCorrectlySent() {
    fetch(SERVERURL + "api/reports/" + reportId.value,
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("JWT"),
            },
            body: JSON.stringify({ state: newSelectedState })
        }
    ).then(async (res) => {
        if (res.ok) {
            res = await res.json();
            report.value = res;
        } else {
            console.log("User level 'citizen' non sufficiente");
        }
    }).catch(error => console.log("Errore nella PUT del report per il cambio di stato: ", error));
}

function changeState(newState) {
    if (!commentIsReadyToPost.value) {
        alert("Scrivi un commento prima di cambiare stato. (Non premere \"inviva\", una volta scritto il commento invece ripremi il tasto di cambio stato)");
        return;
    }

    count.value += 1;
    showStates.value = false;
    newSelectedState = newState;
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
        fetch(SERVERURL + "api/reports/" + reportId.value + "/votes", {
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

const fetchRep = async () => {
    try {
        let res = await fetch(SERVERURL + "api/reports/" + reportId.value);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        res = await res.json();
        report.value = res;
        // console.log(report.value);

        report.value.image = SERVERURL + "api/reports/" + reportId.value + "/image";

        await fetch(SERVERURL + "api/reports/" + reportId.value + "/comments").then(async (res) => {
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
};

const getUserFromToken = () => {
    const token = localStorage.getItem("JWT");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica il payload
        return payload;
    } catch (error) {
        console.error("Errore nel decoding del token:", error);
        return null;
    }
};

onBeforeMount(async () => {
    reportId.value = props.id;
    await fetchRep();
    await fetchUsr();
    const userData = getUserFromToken();
    if (userData && (userData.user_level == 'district' || userData.user_level == 'admin')) {
        districtUser.value = true;
    }
    fetched.value = true;
})
</script>

<style scoped>
.report-wrapper {
    max-width: 1000px;
    font-family: "Raleway", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    margin-top: 20px;

    background-color: white;

    padding: 20px;
}

.report-container {
    background-color: white;
    border: 1px solid black;
    border-radius: 20px;
    display: flex;
    padding: 10px;
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

.change-state-container {
    position: relative;
    display: inline-block;
}

.state-button {
    padding: 8px 12px;
    font-size: 8px;
    font-weight: bold;
    color: black;
    background-color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Menu a tendina */
.stateList {
    position: absolute;
    top: 100%;
    left: 0;
    border-radius: 8px;
    overflow: hidden;
    z-index: 10;
    width: 150px;
    padding: 5px 0;
    animation: fadeIn 0.2s ease-in-out;
}

/* Animazione di apertura */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Stile delle opzioni */
.stateList li {
    list-style: none;
    padding: 10px;
    margin: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.1s ease;
    border-radius: 8px;
}

/* Stati specifici nel menu */
.change-state-active {
    border: 2px solid #2DB432;
    color: black;
    background-color: #96e999;
}

.change-state-work_in_progress {
    border: 2px solid #d8c707;
    color: black;
    background-color: #f1ea99;
}

.change-state-archived {
    border: 2px solid #c20000;
    color: black;
    background-color: #d97272;
}

/* Effetto hover sulle opzioni */
.stateList li:hover {
    transform: scale(1.02);
}
</style>