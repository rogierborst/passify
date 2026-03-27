<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IonButton, IonButtons, IonTextarea } from '@ionic/vue';
import { Pass, usePassesStore } from '@/stores/passes';

const model = defineModel<Pass>({ required: true });
const store = usePassesStore();

const localNote = ref(model.value.notes ?? '');

watch(() => model.value.notes, (val) => {
    localNote.value = val ?? '';
});

const isDirty = computed(() => localNote.value !== (model.value.notes ?? ''));

const save = async () => {
    await store.updatePass(model.value.id!, { notes: localNote.value });
    model.value = { ...model.value, notes: localNote.value };
};

const cancel = () => {
    localNote.value = model.value.notes ?? '';
};
</script>

<template>
    <div class="notes-viewer">
        <ion-textarea
            v-model="localNote"
            :auto-grow="true"
            placeholder="Voeg een notitie toe..."
        />
        <ion-buttons class="actions" :class="{ invisible: !isDirty }">
            <ion-button fill="clear" color="medium" @click="cancel">Annuleren</ion-button>
            <ion-button fill="clear" @click="save">Opslaan</ion-button>
        </ion-buttons>
    </div>
</template>

<style scoped>
.notes-viewer {
    padding: 16px;
}

.actions {
    display: flex;
    justify-content: flex-end;
}

.invisible {
    visibility: hidden;
}
</style>
