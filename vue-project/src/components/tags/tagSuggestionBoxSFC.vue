<template>
    <div v-if="displayBox" class="suggestionContainer">
        <h1 class="suggestionTitle">Preferiti</h1>
        <ul class="suggestionList">
            <li v-for="suggestion in suggestionList">
                <tagSuggestionSFC :category="suggestion" :key="suggestion" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import tagSuggestionSFC from './tagSuggestionSFC.vue';

const staticTags = ["lights", "road", "report", "via Pio X"];

const suggestionList = ref([]);
const displayBox = ref(false);

function fillSuggestionListRandom() {
    suggestionList.value = staticTags;
}

onMounted(() => {
    if (localStorage.getItem("JWT")) displayBox.value = true;
    fillSuggestionListRandom();
}) 
</script>

<style>
.suggestionList {
    list-style: none;
    display: flex;
    margin: 5px;
    padding: 5px;
    flex-wrap: wrap;
    gap: 10px;
}

.suggestionTitle {
    color: #00483A;
    margin: 5px;
    padding: 5px;
}

.suggestionContainer {
    padding: 20px;
    /* margin-top: 400px; */
}
</style>