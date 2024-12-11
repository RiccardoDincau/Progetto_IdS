<template>
    <div class = "notification-container">
        <h3 class="notification-title">Notifiche</h3>
        <notificationSFC v-for="notification in notificationList" :title="notification.title" :content="notification.content" :key="notification.id"/>
    </div>
</template>

<script setup> 
    import { onBeforeMount } from 'vue';
    import notificationSFC from './notificationSFC.vue';
    const userId = localStorage.getItem("id");
    const notificationList = ref([]);
    const SERVERURL = "/";

    console.log("Ciao");
    async function fetchUsr () {
        const res = await fetch(SERVERURL+'api/user/'+userId+'/notifications');
        const resJSON = await res.json();
        for (let el of resJSON){
            notificationList.value.push(el);
        }
    }

    onBeforeMount(()=>{
        fetchUsr();
    });
</script>

<style>
    .notification-container{
        margin: 20px;
    }

    .notification-title {
        color : #00483A;
    }
</style>