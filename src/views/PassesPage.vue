<script setup lang="ts">
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton, IonIcon,
    IonSegment, IonSegmentButton, IonLabel,
    onIonViewWillEnter,
} from '@ionic/vue';
import PassList from '@/components/PassList/PassList.vue';
import { refreshCircleSharp } from 'ionicons/icons';
import { usePassesStore } from '@/stores/passes';
import { useCategoriesStore } from '@/stores/categories';
import { computed } from 'vue';

const passesStore = usePassesStore();
const categoriesStore = useCategoriesStore();

onIonViewWillEnter(() => categoriesStore.loadCategories());

const showSegment = computed(() => categoriesStore.categories.length > 0);

const handleSegmentChange = (event: CustomEvent) => {
    const value = event.detail.value;
    categoriesStore.selectedCategoryId = value === 'all' ? null : value;
};

const segmentValue = computed(() => categoriesStore.selectedCategoryId ?? 'all');
</script>

<template>
    <ion-page>
        <span id="reader" />
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>Passes</ion-title>
                <ion-buttons slot="end">
                    <ion-button color="primary" @click="passesStore.loadPasses">
                        <ion-icon :icon="refreshCircleSharp"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
            <ion-toolbar v-if="showSegment">
                <ion-segment :value="segmentValue" @ionChange="handleSegmentChange" :scrollable="true">
                    <ion-segment-button value="all">
                        <ion-label>Alles</ion-label>
                    </ion-segment-button>
                    <ion-segment-button
                        v-for="cat in categoriesStore.categories"
                        :key="cat.id"
                        :value="cat.id"
                    >
                        <ion-label>{{ cat.name }}</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="container">
                <div class="main">
                    <PassList />
                    <ion-button size="large" router-link="/add">Toevoegen</ion-button>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
#container {
    text-align: center;
    padding: 1rem 0;
}
</style>
