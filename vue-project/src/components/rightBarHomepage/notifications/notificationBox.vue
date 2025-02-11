<template>
    <div class="notification-container" v-if="notificationList.length > 0">
        <h1 class="notification-title">Notifiche</h1>
        <notification v-for="notification in notificationList" :title="notification.title"
            :content="notification.content" :id="notification.report" :key="notification.id" />
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import notification from './notification.vue';

const userId = localStorage.getItem("userId");
const notificationList = ref([]);
const SERVERURL = "/";

async function fetchUsr() {
    if (localStorage.getItem("JWT")) {
        const res = await fetch(SERVERURL + 'api' + userId + '/notifications', {
            headers: {
                "x-access-token": localStorage.getItem("JWT"),
            }
        });

        if (res.status == 200) {
            const resJSON = await res.json();
            for (let el of resJSON) {
                notificationList.value.push(el);
            }
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
    overflow-y: scroll;
    max-height: 50%;
    padding-right: 10px;
}

.notification-title {
    color: #00483A;
    margin: 5px;
    padding: 5px;
}
</style>