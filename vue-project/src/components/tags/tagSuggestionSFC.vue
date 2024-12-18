<template>
    <div :class="tagClass" class="report-tag">
        <p>{{ props.category }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['category']);
const tagClass = ref(props.category + '-type-tag');
</script>


<style>
.report-tag {
    text-align: center;
    font-weight: bold;
    width: fit-content;
    margin: auto;
    /* margin-left: 10px; */
    color: black;
    padding: 5px 20px 5px 20px;
    background-color: red;
    border-radius: 10px 10px 10px 10px;
    /* margin-top: 5px; */
    /* transition-duration: 0.2s; */
    /* box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2); */
}

.report-tag:hover {
    transform: scale(1.1);
    transition-duration: 0.2;
    cursor: pointer;
}

.report-type-tag {
    background-color: #CA4B2E;
}

.lights-type-tag {
    background-color: #E6A704;
}

.complaint-type-tag {
    background-color: #d84f05;
}

.road-type-tag {
    background-color: #8490F9;
}
</style>