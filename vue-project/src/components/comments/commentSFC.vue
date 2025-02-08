<template>
    <div :class="commentClass" class="comment">
        <h1 :class="usernameClass" class="username">{{ props.username }}</h1>
        <h2 class="content">{{ props.content }}</h2>
    </div>
</template>

<script setup>
import { ref } from 'vue';

let props = defineProps(['username', 'userlevel', 'content']);

let commentClass = ref("comment-"+props.userlevel);
let usernameClass = ref("username-"+props.userlevel);

</script>

<style>
.comment {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    margin: 10px;
}

.comment-admin {
    background: #d4d3d3;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
}

.username {
    font-size: 24px;
    font-weight: normal;
}

.username-admin {
    font-size: 24px;
    font-weight: bold;
    color: blue;
}

.content {
    font-size: 18px;
    font-weight: lighter;
}

</style>