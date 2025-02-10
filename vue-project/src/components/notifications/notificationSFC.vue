<template>
    <a :href="'#/big-report?id=' + props.id" class="notification-anchor">
        <div class="notification-tag">
            <div class="notification-title-wrapper">
                <p class="notification-title"> {{ props.title }}</p>
            </div>
            <div class="notification-content-wrapper">
                <p class="notifcation-content"> {{ props.content }}</p>
            </div>
        </div>
    </a>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps(['title', 'content', 'id']);
</script>

<style>
* {
    padding: 0px;
    margin: 0px;
}

.notification-tag {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
    border: none;
    /* max-width: 300px; */
    max-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    overflow: hidden;
}

.notification-anchor {
    text-decoration: none;
    color: black;
}

.notification-title {
    font-weight: bold;
}

.notification-content {
    font-weight: normal;
}

.notification-title-wrapper {
    margin-bottom: 5px;
}

.notification-content-wrapper {
    margin-top: 0px;
}

body {
    background-color: aqua;
}
</style>