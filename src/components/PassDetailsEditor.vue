<script setup lang="ts">
import { IonList, IonItem, IonInput } from '@ionic/vue';
import { Pass } from '@/services/pass-storage';

const pass = defineModel<Pass>({ required: true });
</script>

<template>
    <div class="container">
        <ion-list>
            <ion-item>
                <ion-input label="Naam" v-model="pass.label" />
            </ion-item>
            <ion-item>
                <ion-input label="color" type="color" v-model="pass.color" />
            </ion-item>
        </ion-list>
    </div>
</template>

<style scoped>
</style>
