<template>
  <div :class="{ 'wide-button-container': isDropdownOpen }" class="dropdown-container">
    <button :class="{ 'wide-filter': isDropdownOpen }" class="dropdown-button shaded" @click="toggleDropdown">
      ORDINA PER
    </button>
    <ul v-if="isDropdownOpen" class="dropdown-menu">
      <li @click="selectOrder('votes-up')" class="dropdown-item">Voti Decrescente</li>
      <li @click="selectOrder('votes-down')" class="dropdown-item">Voti Crescente</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const isDropdownOpen = ref(false);
const emit = defineEmits(['order-changed']);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOrder(order) {
  emit('order-changed', order);
  isDropdownOpen.value = false;
}
</script>

<style scoped>
.wide-button-container {
  width: 140px;
  border-radius: 20px 20px 0 0;
  background-color: white;
}

.dropdown-button {
  height: 90%;
  padding: 3px 10px;
  margin: auto;
  margin-left: 7px;
  margin-right: 0;
  border-radius: 10px;
  border: 3px solid #ffffff;
  cursor: pointer;
  text-align: center;
  background-color: white;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.dropdown-button:active {
  border: 3px solid #00483A;
  transition-duration: 0.1s;
}

.wide-filter {
  width: 100%;
  margin: 0;
}

.dropdown-menu {
  list-style: none;
  transition-duration: 1s;
  width: 120px;
  background-color: white;
  margin: auto;
  padding: 10px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dropdown-item {
  margin-top: 8px;
  margin-bottom: 8px;
  border-bottom: 3px solid transparent;
  padding-left: 7px;
}

.dropdown-item:hover {
  cursor: pointer;
  border-bottom: 3px solid #00483A;
}
</style>
