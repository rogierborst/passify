<script setup lang="ts">
import { IonList, IonItem, IonInput } from '@ionic/vue';
import { Pass } from '@/stores/passes';

const pass = defineModel<Pass>({ required: true });
</script>

<template>
    <ion-list>
        <ion-item>
            <ion-input label="Naam" v-model="pass.label" />
        </ion-item>
        <ion-item>
            <!-- @TODO: use custom color picker -->
            <ion-input label="color" :type="'color' as any" v-model="pass.color" />
        </ion-item>
    </ion-list>
</template>
