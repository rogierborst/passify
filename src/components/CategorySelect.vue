<script setup lang="ts">
import { IonSelect, IonSelectOption, alertController } from '@ionic/vue';
import { useCategoriesStore } from '@/stores/categories';
import { computed, onBeforeMount } from 'vue';

const categoriesStore = useCategoriesStore();
onBeforeMount(() => categoriesStore.loadCategories());

const categoryId = defineModel<string | undefined>();

const CREATE_NEW = '__create_new__';

const options = computed(() => [
    ...categoriesStore.categories,
    { id: CREATE_NEW, name: 'Nieuwe categorie...' },
]);

const handleChange = async (event: CustomEvent) => {
    const value = event.detail.value;

    if (value === CREATE_NEW) {
        const alert = await alertController.create({
            header: 'Nieuwe categorie',
            inputs: [{ name: 'name', type: 'text', placeholder: 'Naam' }],
            buttons: [
                { text: 'Annuleren', role: 'cancel' },
                { text: 'Toevoegen', role: 'confirm' },
            ],
        });

        await alert.present();
        const { data, role } = await alert.onDidDismiss();

        if (role === 'confirm' && data?.values?.name?.trim()) {
            const newCategory = await categoriesStore.addCategory(data.values.name.trim());
            categoryId.value = newCategory.id;
        } else {
            // Reset to previous value by forcing reactivity
            const prev = categoryId.value;
            categoryId.value = undefined;
            await new Promise(r => setTimeout(r, 0));
            categoryId.value = prev;
        }
    } else {
        categoryId.value = value || undefined;
    }
};
</script>

<template>
    <ion-select
        label="Categorie"
        :value="categoryId"
        placeholder="Geen categorie"
        @ionChange="handleChange"
        interface="action-sheet"
    >
        <ion-select-option
            v-for="option in options"
            :key="option.id"
            :value="option.id"
        >
            {{ option.name }}
        </ion-select-option>
    </ion-select>
</template>
