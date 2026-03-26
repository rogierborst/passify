import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

export interface Category {
    id: string;
    name: string;
}

const STORAGE_KEY = 'categories';

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref<Category[]>([]);
    const selectedCategoryId = ref<string | null>(null);
    const isLoaded = ref(false);

    const saveToStorage = async (data: Category[]) => {
        await Preferences.set({
            key: STORAGE_KEY,
            value: JSON.stringify(data),
        });
    };

    const loadFromStorage = async (): Promise<Category[]> => {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        return value ? JSON.parse(value) : [];
    };

    const loadCategories = async () => {
        if (!isLoaded.value) {
            categories.value = await loadFromStorage();
            isLoaded.value = true;
        }
    };

    const addCategory = async (name: string): Promise<Category> => {
        const newCategory: Category = {
            id: generateId(),
            name,
        };
        categories.value.push(newCategory);
        await saveToStorage(categories.value);
        return newCategory;
    };

    const updateCategory = async (id: string, name: string) => {
        const index = categories.value.findIndex(c => c.id === id);
        if (index !== -1) {
            categories.value[index] = { ...categories.value[index], name };
            await saveToStorage(categories.value);
        }
    };

    const getCategoryById = (id: string) => {
        return categories.value.find(c => c.id === id);
    };

    const selectedCategory = computed(() => {
        if (!selectedCategoryId.value) return null;
        return getCategoryById(selectedCategoryId.value) ?? null;
    });

    const sortedCategories = computed(() =>
        [...categories.value].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    );

    return {
        categories: sortedCategories,
        selectedCategoryId,
        selectedCategory,
        isLoaded,

        loadCategories,
        addCategory,
        updateCategory,
        getCategoryById,
    };
});
