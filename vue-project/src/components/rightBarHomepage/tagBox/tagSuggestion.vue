<template>
    <div :class="tagClass" class="suggestion-report-tag">
        <p>{{ props.category }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['category']);
const tagClass = ref(props.category + '-suggestion-type-tag');
</script>


<style>
.suggestion-report-tag {
    text-align: center;
    font-weight: bold;
    width: fit-content;
    margin: auto;
    color: black;
    padding: 5px 20px 5px 20px;
    background-color: red;
    border-radius: 10px 10px 10px 10px;
}

.suggestion-report-tag:hover {
    transform: scale(1.1);
    transition-duration: 0.2;
    cursor: pointer;
}

.report-suggestion-type-tag {
    background-color: #CA4B2E;
}

.lights-suggestion-type-tag {
    background-color: #E6A704;
}

.complaint-suggestion-type-tag {
    background-color: #d84f05;
}

.road-suggestion-type-tag {
    background-color: #8490F9;
}
</style>