<script setup lang="ts">
import { getPass, type Pass } from '@/services/pass-storage';
import { IonContent, IonButtons, IonButton, IonMenuButton, IonTitle, IonToolbar, IonPage, IonHeader, IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { trashBinSharp } from 'ionicons/icons';
import { deletePass } from '@/services/pass-storage';
import CodeViewer from '@/components/CodeViewer.vue';

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
                <CodeViewer :data="pass" />
            </div>
        </div>

    </ion-content>
</ion-page>
</template>

<style scoped>
.main {
    max-width: 80vh;
    max-height: 80vh;
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
