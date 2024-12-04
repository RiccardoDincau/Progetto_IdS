

<template>
    <div class="report-wrapper">
                    <tagSFC />
                    <div class="report-container">
                        <div class="state-container">
                            <div class="state-circle"></div>
                        </div>

                        <div class="content-contaier">
                            <div class="report-title-container">
                                <h1 class="report-title">{{ report.title }}</h1>
                                <h3 class="report-username-date report-subtitle">{{ user.username }}, 3gg</h3>
                            </div>

                            <div class="report-position-container">
                                <h3 class="report-position report-subtitle">{{ report.position }}</h3>

                            </div>

                            <div class="report-content-container">
                                <p class="report-content">{{ report.content }}.</p>
                            </div>
                            <div class="vote-container">
                                <svg class="vote-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                    stroke="#ffffff">

                                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

                                    <g id="SVGRepo_iconCarrier">

                                        <path
                                            d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />

                                    </g>
                                </svg>
                            </div>
                        </div>

                        <div class="report-image-container">
                            <img :src="report.image" class="report-image">
                        </div>
                    </div>
                </div>
</template>

<script setup>
    import{ defineProps, ref, onMounted } from 'vue';
    import{ tagSFC } from './tagSFC.vue';

    const SERVERURL = process.env.SERVERURL;
    const props = defineProps(['reportId']);

    // const upvote = ref(false); TODO

    const report = ref({
        title: '',
        content: '',
        user: '',
        votes: 0,
        position : '',
        kind: '',
        category: '',
        state: '',
        comments: [],
        image: ''
    });

    const user = ref({
        username: ''
    });

    await fetch(SERVERURL+"/api/reports/"+props.reportId)
    .then( async (res) => {
        res = await res.json();
        report.value = res;
        report.image = process.env.SERVERURL+"/report_images/"+props.reportId+"/_rep_image.jpeg";
    })
    .catch( () => console.log("errore report in 'reportSFC'"));

    await fetch(SERVERURL+"/api/users/"+report.user)
    .then( async (res) => {
        res = await res.json();
        user.value = res;
    })
    .catch(() => console.log("errore user in 'reportsSFC'"));
    
    onMounted(fetch);
    
</script>

<style>

</style>