<template>
    <div class="state-selector-bar">
        <StateButton v-for="button in stateButtons" :state="button.state" :text="button.text" :pressed="button.pressed"
            :key="button.state" @state-button-pressed="stateChanged" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StateButton from "./stateButtonSFC.vue";

const emit = defineEmits(['stateChanged']);

const stateButtons = ref([{
    state: "active",
    text: "ATTIVE",
    pressed: !false
}, {
    state: "work_in_progress",
    text: "PRESE IN CARICO",
    pressed: false
}, {
    state: "archived",
    text: "ARCHIVIATE",
    pressed: false
}]);

let currentState = "";

function stateChanged(newState, p) {
    if (currentState !== newState) {
        for (let i = 0; i < stateButtons.value.length; i++) {
            if (stateButtons.value[i].state != newState) {
                stateButtons.value[i].pressed = false;
            } else {
                stateButtons.value[i].pressed = true;
            }
        }
        currentState = newState;
        emit("stateChanged", newState);
    }
}


onMounted(() => {
    stateChanged("active");
})



</script>

<style>
.state-selector-bar {
    margin: auto;
    margin-top: 50px;
}
</style>