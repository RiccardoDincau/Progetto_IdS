<!-- <template>
    <div>
      <label for="order-select">Ordina per:</label>
      <select id="order-select" class="dropdown" v-model="selectedSort" @change="emitOrderChange">
        <option value="votes-up">Voti Ascendente</option>
        <option value="votes-down">Voti Discendente</option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const selectedSort = ref('votes-up'); // Valore iniziale
  const emit = defineEmits(['order-changed']);
  
  function emitOrderChange() {
    // console.log("Ordinamento selezionato:", selectedSort.value);
    emit('order-changed', selectedSort.value);
  }
  </script>
  
  <style scoped>
  .dropdown {
    margin-top: 0.25rem;
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  </style> -->
<template>
    <div class="dropdown-container">
        <button class="dropdown-button" @click="toggleDropdown">
            Ordina per
        </button>
        <ul v-if="isDropdownOpen" class="dropdown-menu">
            <li @click="selectOrder('votes-up')">Voti Ascendente</li>
            <li @click="selectOrder('votes-down')">Voti Discendente</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const isDropdownOpen = ref(false);
const emit = defineEmits(['order-changed']);

function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
    // console.log("🔍 Stato Dropdown:", isDropdownOpen.value);
}

function selectOrder(order) {
    // console.log("✅ Ordinamento selezionato:", order);
    emit('order-changed', order);
    isDropdownOpen.value = false; // Chiude il menu dopo la selezione
}


// watch(isDropdownOpen, (newValue) => {
//     console.log("Stato cambiato:", newValue);
// });
</script>

<style scoped>
.dropdown-container {
    position: relative;
    display: inline-block;
}

.dropdown-button {
    background-color: #00483A;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    list-style: none;
    padding: 0;
    margin: 0;
    width: 150px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 1000;
}

.dropdown-menu li {
    padding: 10px;
    cursor: pointer;
    text-align: center;
}

.dropdown-menu li:hover {
    background-color: #f0f0f0;
}
</style>