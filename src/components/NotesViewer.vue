<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonButtons, IonTextarea } from '@ionic/vue';
import { Pass, usePassesStore } from '@/stores/passes';

const model = defineModel<Pass>({ required: true });
const store = usePassesStore();

const editing = ref(false);
const localNote = ref(model.value.notes ?? '');

const startEditing = () => {
    localNote.value = model.value.notes ?? '';
    editing.value = true;
};

const save = async () => {
    await store.updatePass(model.value.id!, { notes: localNote.value });
    model.value = { ...model.value, notes: localNote.value };
    editing.value = false;
};

const cancel = () => {
    editing.value = false;
};
</script>

<template>
    <div class="notes-viewer">
        <div v-if="!editing" class="note-content">
            <p class="note-text">{{ model.notes }}</p>
            <ion-buttons class="actions">
                <ion-button fill="outline" @click="startEditing">Bewerken</ion-button>
            </ion-buttons>
        </div>
        <div v-else class="note-editor">
            <ion-textarea
                v-model="localNote"
                :auto-grow="true"
                class="note-textarea"
            />
            <ion-buttons class="actions">
                <ion-button fill="outline" color="medium" @click="cancel">Annuleren</ion-button>
                <ion-button fill="solid" @click="save">Opslaan</ion-button>
            </ion-buttons>
        </div>
    </div>
</template>

<style scoped>
.notes-viewer {
    padding: 16px;
}

.note-text {
    white-space: pre-wrap;
    margin: 0 0 16px;
}

.note-editor ion-textarea {
    margin-bottom: 16px;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
