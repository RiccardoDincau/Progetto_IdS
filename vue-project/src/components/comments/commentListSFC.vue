<template>
    <div class="comment-list-container">
        <h1 class="comment-list-title">Commenti</h1>
        <addCommentBar :report-id="props.reportId" @has-content="updateThereIsContent"
            @commentAdded="handleCommentAdded"></addCommentBar>

        <ul class="comment-list">
            <li v-for="comment in commentList">
                <commentSFC :username="comment.username" :userlevel="comment.userlevel" :content="comment.content">
                </commentSFC>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import commentSFC from './commentSFC.vue';
import addCommentBar from './addCommentBarSFC.vue';

const SERVERURL = "/";

let props = defineProps(['reportId']);

let commentList = ref([]);

let emits = defineEmits(["thereIsContent", "commentSent"]);
function updateThereIsContent(hasContent) {
    emits("thereIsContent", hasContent);
}

const fetchComments = async () => {
    try {
        let res = await fetch(SERVERURL + "api/reports/" + props.reportId + "/comments");
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        res = await res.json();

        for (let comment of res) {
            const userRes = await fetch(SERVERURL + "api/users/" + comment.user);
            if (userRes.ok) {
                const userData = await userRes.json();
                comment.username = userData.name;
                comment.userlevel = userData.user_level;
            }
        }

        commentList.value = res;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const handleCommentAdded = async () => {
    emits("commentSent");
    await fetchComments();
};

onBeforeMount(async () => {
    await fetchComments();
})

</script>

<style>
.comment-list {
    list-style-type: none;
}

.comment-list-title {
    margin-top: 20px;
}
</style>