<script setup lang="ts">
import { ref } from 'vue';
import {IonList, IonItem, IonInput, IonButton} from '@ionic/vue';

const name = ref<string>();
const color = ref<string>();

const savePass = async() => {
    // @TODO: Check out this snippet on Claude.ai: https://claude.ai/chat/cfb8885f-fc97-4447-a86e-0ffcfdd97745
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
