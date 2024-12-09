<template>
    <div class = "notification-container">
        <h3 class="notification-title">Notifiche</h3>
        <notificationSFC v-for="notification in notificationList" :title="notification.title" :content="notification.content" :key="notification.id"/>
    </div>
</template>

<script setup> 
    import { onBeforeMount } from 'vue';
    import notificationSFC from './notificationSFC.vue';
    const props = defineProps(['userId']);
    const notificationList = ref([]);
    const SERVERURL = "https://bpjwkxhm-8080.euw.devtunnels.ms/";

    
    async function fetchUsr () {
        const res = await fetch(SERVERURL+'api/user/'+userId+'/notifications');
        for (let el of res){
            const elJSON = el.json();
            notificationList.value.append(elJSON);
        }
    }

    onBeforeMount(){
        await fetchUsr();
    }
</script>

<style>
    .notification-container{
        margin: 20px;
    }

    .notification-title {
        color : #00483A;
    }
</style>