<template>
    <div :class="{ 'selected-state-selector-container': props.pressed }" class="state-selector-container"
        @click="$emit('stateButtonPressed', props.state, props.pressed)">
        <h3 class=" state-selector">{{ props.text }}</h3>
    </div>
</template>

<script setup>
let props = defineProps(["state", "text", "pressed"]);
</script>

<style>
.state-selector-container {
    width: 90%;
    min-width: 70px;
    margin: auto;
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
}

.state-selector {
    font-size: 30px;
    font-weight: 400;
    border: 0px solid #ffffff;
    border-bottom-width: 4px;
    padding-top: 4px;
    width: fit-content;
    transition-duration: 0.1s;
}

.state-selector-container:hover>.state-selector {
    border-color: #00483A;
}

.state-selector-container:hover {
    cursor: pointer;
}

.selected-state-selector-container {
    background-color: #00483A;
    color: white;
    font-weight: bolder;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.selected-state-selector-container>.state-selector {
    border-color: #00483A;
}
</style>