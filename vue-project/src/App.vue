<script setup>
import ReportList from "./components/reportListSFC.vue";
</script>

<template>
    <div class="page-container">
        <div class="left-bar">

            <div class="logo-title-container">
                <div class="logo-container">
                    <!-- <img src="resources/logo.png" class="logo"> -->
                </div>
                <div class="logo-title">
                    <h1 class="title">Treport</h1>
                </div>
            </div>

            <div class="state-selector-bar">
                <div class="state-selector-container selected-state-selector-container">
                    <h3 class="state-selector">ATTIVE</h3>
                </div>
                <div class="state-selector-container">
                    <h3 class="state-selector">PRESE IN CARICO</h3>
                </div>
                <div class="state-selector-container">
                    <h3 class="state-selector">ARCHIVIATE</h3>
                </div>
            </div>

        </div>

        <div class="central-bar">
            <div class="filter-options-bar">
                <div class="search-bar-container shaded">
                    <!-- <img class="search-icon" src="./resources/search-icon.png"> -->
                    <input class="search-bar" type="text" placeholder="Cerca...">
                </div>
                <div class="filter-buttons-container">
                    <button class="filter-button shaded">FILTRI</button>
                    <button class="filter-button shaded">ORDINA PER</button>
                </div>

            </div>
            
            <ReportList />
        </div>
        <div class="right-bar"></div>
    </div>
</template>
