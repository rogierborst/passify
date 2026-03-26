<script setup lang="ts">
import {
    IonContent,
    IonButtons,
    IonButton,
    IonModal,
    IonMenuButton,
    IonTitle,
    IonToolbar,
    IonPage,
    IonHeader,
    IonIcon, onIonViewDidEnter, alertController,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, useTemplateRef } from 'vue';
import { trashBinSharp, createOutline } from 'ionicons/icons';
import CodeViewer from '@/components/CodeViewer/CodeViewer.vue';
import { Pass, usePassesStore } from '@/stores/passes';
import { useSwipeToPage } from '@/composables/useSwipeToPage';
import PassEditor from '@/components/PassEditor.vue';

const router = useRouter();
const route = useRoute();
const pass = ref<Pass>();
const passesStore = usePassesStore();

const fetchPass = () => {
    pass.value = passesStore.getPassById(route.params.id as string);
}
onIonViewDidEnter(() => fetchPass());
onMounted(() => fetchPass());


const swipeableRef = useTemplateRef('swipeableRef');
useSwipeToPage(swipeableRef, '/passes');

const editing = ref<boolean>(false);

const removePass = async () => {
    const alert = await alertController.create({
        header: 'Kaart verwijderen',
        message: `Weet je zeker dat je "${pass.value?.label}" wilt verwijderen?`,
        buttons: [
            { text: 'Annuleren', role: 'cancel' },
            { text: 'Verwijderen', role: 'confirm' },
        ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'confirm') {
        await passesStore.deletePass(route.params.id as string);
        await router.push('/passes');
    }
}
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary" />
                </ion-buttons>
                <ion-title>{{ pass?.label }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button fill="clear" @click="editing = true">
                        <ion-icon :icon="createOutline" />
                    </ion-button>
                    <ion-button color="danger" @click="removePass">
                        <ion-icon :icon="trashBinSharp" />
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <div ref="swipeableRef" class="swipeable-container">
            <ion-modal ref="editor" :is-open="editing" @willDismiss="editing = false">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Kaart bewerken</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <PassEditor v-model="pass" @save="editing = false" @cancel="editing=false" />
                </ion-content>
            </ion-modal>

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
                    <h1 v-else>GEEN PASS</h1>
                </div>
            </ion-content>
        </div>
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
    min-height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.swipeable-container {
    min-height: 100%;
    width: 100%;
}
</style>
