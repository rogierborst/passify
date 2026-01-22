<script setup lang="ts">
import PassDetailsForm from '@/components/PassDetailsForm.vue';
import { IonButton } from '@ionic/vue';
import { Pass } from '@/stores/passes';
import { ref, toRaw, watch } from 'vue';

const pass = defineModel<Pass>();
const localPass = ref<Pass>();

// clone when model changes
watch(
    () => pass.value,
    (updatedPass: Pass) => {
        localPass.value = updatedPass ? structuredClone(toRaw(updatedPass)) : undefined;
    },
    { immediate: true }
);

const save = () => {
    if (localPass.value) {
        pass.value = structuredClone(toRaw(localPass.value));
    }
}
</script>

<template>
    <div>
        <PassDetailsForm v-model="localPass" />
        <ion-button @click="save">Save</ion-button>
    </div>
</template>
