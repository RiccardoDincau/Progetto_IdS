<template>
    <div class = "notification-tag">
        <div class="notification-title-wrapper">
            <p class="notification-title"> {{ title.value }}</p>
        </div>
        <div class="notification-content-wrapper">
            <p class="notifcation-content"> {{ content.value }}</p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    
    const props = defineProps(['notificationId']);
    const title = ref('');
    const content = ref('');
    const getNot = async (() => {
        try {
            let notification = fetch(SERVERURL + "api/notifications/" + props.notificationId);
            notification = notification.json();
            content.value = notification.content;
            title.value = notification.title;
        } catch (error){
            console.log("Errore");
        }
    });

    onMounted(async () => {
        getNot();
    })
</script>

<style>
        * {
        padding : 0px;
        margin: 0px;
    }
    .notification-tag {
        background-color: white;
        border-radius: 20px;
        box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
        border : none;
        max-width: 300px;
        max-height : 100px;
        padding : 10px;
        overflow:hidden;
    }

    .notification-title {
        font-weight: bold;
    }

    .nofification-content {
        font-weight: normal;
    }

    .notification-title-wrapper{
        margin-bottom: 5px;
    }
    .notification-content-wrapper{
        margin-top : 0px;
    }
    body {
        background-color: aqua;
    }
</style>