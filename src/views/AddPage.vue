<script setup lang="ts">
import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter } from '@ionic/vue';
import Scanner from '@/components/Scanner.vue';
import { ScanResult } from '@/types/scan';
import { computed, ref, useTemplateRef } from 'vue';
import PassDetailsForm from '@/components/PassDetailsForm.vue';
import { useRouter } from 'vue-router';
import CodeViewer from '@/components/CodeViewer/CodeViewer.vue';
import { Pass, usePassesStore } from '@/stores/passes';
import { providePageRefresh } from '@/composables/usePageRefresh';
import { useSwipeToPage } from '@/composables/useSwipeToPage';

const passesStore = usePassesStore();
const router = useRouter();

const swipeableRef = useTemplateRef('swipeableRef');
useSwipeToPage(swipeableRef, '/passes');

const scannedCard = ref<ScanResult>();
const passData = ref<Partial<Pass>>({
    color: '#145920'
});


providePageRefresh();
const resetData = () => {
    scannedCard.value = undefined;
    passData.value = { color: '#145920' };
};
onIonViewWillEnter(() => resetData());

const handleCapture = (result: ScanResult) => {
    scannedCard.value = result;
    passData.value.data = result.data;
    passData.value.format = result.dataType;
}

const savePass = async () => {
    if (!dataIsValid.value) return;

    const savedPass = await passesStore.addPass(passData.value as Pass);
    await router.push(`pass/${ savedPass.id }`);
}

const dataIsValid = computed(() => {
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
            <div ref="swipeableRef" class="swipeable-container">
                <ion-header collapse="condense">
                    <ion-toolbar>
                        <ion-title size="large">Toevoegen</ion-title>
                    </ion-toolbar>
                </ion-header>

                <div id="container">
                    <Scanner @capture="handleCapture" />
                    <template v-if="scannedCard">
                        <CodeViewer v-if="scannedCard" :data="scannedCard" />
                        <form @submit.prevent="savePass">
                            <PassDetailsForm v-if="scannedCard" v-model="passData" />
                            <ion-button type="submit" color="success" :disabled="!dataIsValid">Opslaan</ion-button>
                        </form>
                    </template>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
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

.swipeable-container {
    min-height: 100%;
    width: 100%;
}
</style>
