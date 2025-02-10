<template>
    <div :class="{ 'comment-admin': (props.userlevel == 'admin' || props.userlevel == 'district') }" class="comment">
        <h1 :class="{ 'username-admin': (props.userlevel == 'admin' || props.userlevel == 'district') }"
            class="username">{{ props.username }}</h1>
        <h2 class="content">{{ props.content }}</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

let props = defineProps(['username', 'userlevel', 'content']);

onMounted(() => {
    console.log("awdawda", props.userlevel);
});

</script>

<style scoped>
.comment {
    background: #E4E4E4;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    margin: 10px;
}

.comment-admin {
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