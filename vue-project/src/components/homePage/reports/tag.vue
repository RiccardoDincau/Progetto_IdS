<template>
    <div :class="tagClass" class="report-tag">
        <p>{{ props.fieldValue }}</p>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';

const props = defineProps(['fieldValue']);
const tagClass = ref("");

onBeforeMount(async () => {
    tagClass.value = props.fieldValue + '-type-tag';
});
</script>


<style>
.report-tag {
    margin-left: 10px;
    color: black;
    padding: 5px 20px 2px 20px;
    background-color: rgb(35, 170, 82);
    border-radius: 10px 10px 0 0;
    margin-top: 5px;
    transition-duration: 0.2s;
}

.report-tag:hover {
    padding-bottom: 5px;
    margin-top: 0;
    cursor: pointer;
}

.report-type-tag {
    background-color: #e11717;
}
.suggestion-type-tag {
    background-color: rgb(68, 98, 233);
}
.complaint-type-tag {
    background-color: #f26417;
}

.lights-type-tag {
    background-color: #E6A704;
}
.road-type-tag {
    background-color: #2fc3e8;
}
.trash-type-tag {
    background-color: #337246;
}
</style>