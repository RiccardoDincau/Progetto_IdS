<template>
    <div class="comment-list-container">
        <h1>Commenti</h1>
        <ul class="comment-list">
            <li v-for="comment in commentList">
                <commentSFC 
                :username="comment.user.name"
                :userlevel="comment.user.user_level"
                :content="comment.content"> 
                </commentSFC>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import commentSFC from './commentSFC.vue';

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
        commentList.value = res;
    } catch(error){
        console.log(error);
        throw new Error(error);
    }
}

onBeforeMount(async () => {
    await fetchComments();
})

</script>

<style>

    .commentList {
        padding: 10px;
        margin: 10px;
    }

</style>