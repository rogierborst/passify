<script setup lang="ts">
import { IonContent, IonButtons, IonButton, IonMenuButton, IonTitle, IonToolbar, IonPage, IonHeader, IonIcon } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, useTemplateRef } from 'vue';
import { trashBinSharp } from 'ionicons/icons';
import CodeViewer from '@/components/CodeViewer/CodeViewer.vue';
import { Pass, usePassesStore } from '@/stores/passes';
import { createGesture, Gesture } from '@ionic/vue';

const router = useRouter();
const route = useRoute();
const pass = ref<Pass>();
const passesStore = usePassesStore();
const swipableRef = useTemplateRef('swipableRef');
let gesture: Gesture | null = null;

const goToIndex = () => {
    router.push('/passes');
};

onMounted(() => {
    pass.value = passesStore.getPassById(route.params.id as string);

    if (!swipableRef.value?.$el) return;

    gesture = createGesture({
        el: swipableRef.value.$el,
        gestureName: 'to-index',
        direction: 'x',
        threshold: 50,
        onMove: (detail) => {
            if (detail.deltaX > 0) {
                // Swiping right (going back)
                const opacity = Math.min(detail.deltaX / 100, 0.7);
                swipableRef.value!.$el.style.transform = `translateX(${detail.deltaX}px)`;
                swipableRef.value!.$el.style.opacity = 1 - opacity;
            }
        },
        onEnd: (detail) => {
            // Reset visual feedback
            swipableRef.value!.$el.style.transform = '';
            swipableRef.value!.$el.style.opacity = '';

            // If swiped right more than 100px, navigate
            if (detail.deltaX > 100) {
                goToIndex();
            }
        }
    });

    gesture.enable();
});

const removePass = async () => {
    await passesStore.deletePass(route.params.id as string);
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

    <ion-content ref="swipableRef" :fullscreen="true" :style="{ '--pass-color': pass?.color }">
        <div ref="swipableRef" class="swipable-container">
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

.swipable-container {
    min-height: 100%;
    width: 100%;
}
</style>
