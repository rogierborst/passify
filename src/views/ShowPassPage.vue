<script setup lang="ts">
import { getPass, type Pass } from '@/services/pass-storage';
import { IonContent, IonButtons, IonButton, IonMenuButton, IonTitle, IonToolbar, IonPage, IonHeader, IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import QRCode from '@/components/QR-Code.vue';
import BarCode from '@/components/BarCode.vue';
import { trashBinSharp } from 'ionicons/icons';
import { deletePass } from '@/services/pass-storage';

const router = useRouter();
const route = useRoute();
const pass = ref<Pass>();

onMounted(async() => {
    pass.value = await getPass(route.params.id as string);
});

const removePass = async () => {
    await deletePass(route.params.id as string);
    await router.push('/passes');
}
</script>

<template>
<ion-page>
    <ion-header :translucent="true">
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-menu-button color="primary"></ion-menu-button>
            </ion-buttons>
            <ion-title>{{ pass?.label }}</ion-title>
            <ion-buttons slot="end">
                <ion-button color="danger" @click="removePass">
                    <ion-icon :icon="trashBinSharp"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" :style="{ '--pass-color': pass?.color }">
        <ion-header collapse="condense">
            <ion-toolbar>
                <ion-title size="large">{{ pass?.label }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <div class="container">
            <div class="main" v-if="pass">
                <QRCode v-if="pass.format === 'QR_CODE'" :data="pass.data" />
                <BarCode v-else :data="pass.data" />
            </div>
        </div>

    </ion-content>
</ion-page>
</template>

<style scoped>
.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

ion-content {
    --background: var(--pass-color);
}

.container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
