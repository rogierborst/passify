<script setup lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { onMounted, onUnmounted } from 'vue';
import { App } from '@capacitor/app';
import MainMenu from '@/components/MainMenu.vue';

const ionRouter = useIonRouter();
let backButtonListener: { remove: () => void } | null = null;
onMounted(async () => {
    backButtonListener = await App.addListener('backButton', () => {
        if (ionRouter.canGoBack()) {
            ionRouter.back();
        } else {
            App.exitApp();
        }
    });
});
onUnmounted(() => {
    backButtonListener?.remove();
});
</script>

<template>
    <ion-app>
        <ion-split-pane content-id="main-content">
            <MainMenu />
            <ion-router-outlet id="main-content" />
        </ion-split-pane>
    </ion-app>
</template>


