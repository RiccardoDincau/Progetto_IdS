<template>
    <div class="suggestionContainer">
        <ul class="suggestionList">
            <li v-for="suggestion in suggestionList">
                <tagSuggestionSFC :fieldValue="suggestion"/>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import tagSuggestionSFC from './tagSuggestionSFC.vue';

    const props = defineProps(['allTagList']);

    const tagList = ref( props.allTagList );
    const tagListLength = ref( tagList.value.length );
    const suggestionList = ref([]);
    const index = ref(0);

    function fillSuggestionListRandom(){
        tagListLength.value = tagList.value.length;
        const rand = Math.floor(Math.random() * tagListLength.value);
        suggestionList.value[index] = tagList.value[rand];
        index.value++;
        tagList.value.splice(rand, 1);
    }

    fillSuggestionListRandom();
</script>

<style>
</style>