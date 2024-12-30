<template>
    <div class="notification-tag">
        <div class="notification-title-wrapper">
            <p class="notification-title"> {{ props.title }}</p>
        </div>
        <div class="notification-content-wrapper">
            <p class="notifcation-content"> {{ props.content }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['title', 'content']);
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
    max-width: 300px;
    max-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    overflow: hidden;
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