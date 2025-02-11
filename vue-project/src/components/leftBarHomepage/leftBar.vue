<template>
    <div class="logo-title-container">
        <div class="logo-container">
            <!-- <img src="resources/logo.png" class="logo"> -->
        </div>
        <a href="#/" class="logo-title-anchor">
            <div class="logo-title">
                <h1 class="title">Treport</h1>
            </div>
        </a>
    </div>

    <stateButtonList @state-changed="passUpState" />
</template>

<script setup>
import stateButtonList from './stateButtons/stateButtonList.vue';

const emits = defineEmits(["passUpState"]);

function passUpState(newState) {
    emits("passUpState", newState);
}
</script>