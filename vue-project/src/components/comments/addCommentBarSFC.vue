<template>
    <div class="comment-input-container">
      <textarea v-model="comment.content" placeholder="Scrivi un commento..." class="comment-input"></textarea>
      <button @click="submitComment" class="submit-button">Invia</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let props = defineProps(['reportId']);
  
const comment = ref({
    content: '',
    report: props.reportId,
    user: ''
});

const emit = defineEmits();
  
const submitComment = async () => {
    if (!comment.value.content.trim()) return; // Per non permettere commenti vuoti
    
    if(!localStorage.getItem("JWT")){
        window.location.hash = '/login';
    }

    try{
        let res = await fetch("/api/reports/"+props.reportId+"/comments",
            {
                method: "POST",
                headers: { "x-access-token": localStorage.getItem("JWT"), "Content-type": "application/json" },
                body: JSON.stringify(comment.value)
            }
        );

        if(res.ok){
            emit('commentAdded');
        } else {
            console.log("Errore nell'invio del commento.");
        }

    } catch(error){
        console.log("Errore nella richiesta:", error);
    }
    comment.value.content = '';
};

const getUserFromToken = () => {
    const token = localStorage.getItem("JWT");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica il payload
        return payload;
    } catch (error) {
        console.error("Errore nel decoding del token:", error);
        return null;
    }
};

onMounted(() => {
    const userData = getUserFromToken();
    if (userData) {
        comment.value.user = userData.id;
    }
});

</script>
  
<style scoped>
.comment-input-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.comment-input {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    margin: 10px;
    border: 1px solid;
    border-color: transparent;
    resize: none;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
    width: 100%;
}

.comment-input:focus {
    outline: none;
    border-color: transparent;
}

.submit-button {
    padding: 8px 15px;
    border: none;
    background-color: #2db432;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    resize: none;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.2);
}

.submit-button:hover {
    background-color: #249b29;
}

</style>
  