<template>
    <div class="comment-list-container">
        <h1>Commenti</h1>
        <addCommentBar :report-id="props.reportId" @commentAdded="handleCommentAdded"></addCommentBar>
        <ul class="comment-list">
            <li v-for="comment in commentList">
                <commentSFC 
                :username="comment.username"
                :userlevel="comment.user_level"
                :content="comment.content"> 
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

const fetchComments = async () => {
    try {
        let res = await fetch(SERVERURL+"api/reports/"+props.reportId+"/comments");
        if(!res.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        res = await res.json();
        console.log(res);

        for (let comment of res) {
            const userRes = await fetch(SERVERURL + "api/users/" + comment.user);
            if (userRes.ok) {
                const userData = await userRes.json();
                comment.username = userData.name;
                comment.userlevel = userData.user_level;
            }
        }

        commentList.value = res;
    } catch(error){
        console.log(error);
        throw new Error(error);
    }
}

const handleCommentAdded = async () => {
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

</style>