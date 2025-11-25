<script setup lang="ts">
import { ref } from 'vue';
import {IonList, IonItem, IonInput, IonButton} from '@ionic/vue';

const name = ref<string>();
const color = ref<string>();

const savePass = () => {
    console.log('saving 🪪')
}
</script>

<template>
    <div class="container">
        <form @submit.prevent="savePass">
            <ion-list>
                <ion-item>
                    <ion-input label="Naam" v-model="name" />
                </ion-item>
                <ion-item>
                    <ion-input label="color" type="color" v-model="color" />
                </ion-item>
            </ion-list>

            <ion-button type="submit" color="success">Opslaan</ion-button>
        </form>
    </div>
</template>

<style scoped>
</style>
