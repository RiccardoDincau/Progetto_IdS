<template>
    <div class="notification-container" v-if="notificationList.length > 0">
        <h3 class="notification-title">Notifiche</h3>
        <notificationSFC v-for="notification in notificationList" :title="notification.title"
            :content="notification.content" :key="notification.id" />
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import notificationSFC from './notificationSFC.vue';
const userId = localStorage.getItem("userId");
const notificationList = ref([]);
const SERVERURL = "/";

async function fetchUsr() {
    const res = await fetch(SERVERURL + 'api' + userId + '/notifications', {
        headers: {
            "x-access-token": localStorage.getItem("JWT"),
        }
    });

    if (res.status == 200) {
        const resJSON = await res.json();
        console.log(resJSON);
        for (let el of resJSON) {
            notificationList.value.push(el);
        }
    }
}

onBeforeMount(() => {
    fetchUsr();
});
</script>

<style>
.notification-container {
    margin: 20px;
}

.notification-title {
    color: #00483A;
}
</style>