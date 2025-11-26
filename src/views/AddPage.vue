<script setup lang="ts">
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/vue';
import Scanner from '@/components/Scanner.vue';
import { ScanResult } from '@/types/scan';
import { computed, ref } from 'vue';
import PassDetailsEditor from '@/components/PassDetailsEditor.vue';
import {type Pass, addPass} from '@/services/pass-storage';
import { useRouter } from 'vue-router';

const scannedCard = ref<ScanResult>();
const passData = ref<Partial<Pass>>({
    color: '#145920'
});
const router = useRouter();

const handleCapture = (result: ScanResult) => {
    scannedCard.value = result;
    passData.value.data = result.data;
    passData.value.format = result.dataType;
}

const savePass = async () => {
    if (!everythingSet.value) return;

    const savedPass = await addPass(passData.value as Pass);
    await router.push(`pass/${savedPass.id}`);
}

const everythingSet = computed(() => {
    return scannedCard.value && passData.value.label && passData.value.color;
});

</script>

<template>
    <ion-page>
        <span id="reader" />
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>Pas toevoegen</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Toevoegen</ion-title>
                </ion-toolbar>
            </ion-header>

            <div id="container">
                <form @submit.prevent="savePass">
                    <Scanner @capture="handleCapture"/>
                    <PassDetailsEditor v-if="scannedCard" v-model="passData" />
                    <ion-button type="submit" color="success" :disabled="!everythingSet">Opslaan</ion-button>
                </form>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
#container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

#container strong {
    font-size: 20px;
    line-height: 26px;
}

#container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
}

#container a {
    text-decoration: none;
}
</style>
