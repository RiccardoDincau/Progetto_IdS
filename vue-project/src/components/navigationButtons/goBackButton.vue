<template>
    <div @click="$emit('goBackPressed')" class="go-back-container">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
            <path
                d="M20.586,39.414C20.977,39.805,21.488,40,22,40s1.023-0.195,1.414-0.586c0.781-0.781,0.781-2.047,0-2.828L12.828,26H40 c1.104,0,2-0.896,2-2s-0.896-2-2-2H12.828l10.586-10.586c0.781-0.781,0.781-2.047,0-2.828c-0.781-0.781-2.047-0.781-2.828,0l-14,14 c-0.781,0.781-0.781,2.047,0,2.828L20.586,39.414z">
            </path>
        </svg>
        Torna indietro
    </div>
</template>

<style lang="css" scoped>
.go-back-container {
    padding: 10px;
    border: 3px solid #00483A;
    background-color: white;
    border-radius: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    max-width: 150px;
    margin-top: 20px;
}
</style>