// stores/passes.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

export interface Pass {
    format: string;
    data: string;
    label: string;
    color: string;
    id?: string;
    timestamp?: number;
}

const STORAGE_KEY = 'passes';

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const usePassesStore = defineStore('passes', () => {
    const passes = ref<Pass[]>([]);
    const isLoaded = ref(false);
    const isLoading = ref(false);

    // Private helper methods
    const saveToStorage = async (passesToSave: Pass[]) => {
        await Preferences.set({
            key: STORAGE_KEY,
            value: JSON.stringify(passesToSave),
        });
    };

    const loadFromStorage = async (): Promise<Pass[]> => {
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        return value ? JSON.parse(value) : [];
    };

    // Public actions
    const loadPasses = async (forceRefresh = false) => {
        if (isLoading.value) return;

        if (!isLoaded.value || forceRefresh) {
            isLoading.value = true;
            try {
                passes.value = await loadFromStorage();
                isLoaded.value = true;
            } finally {
                isLoading.value = false;
            }
        }
    };

    const addPass = async (pass: Omit<Pass, 'id' | 'timestamp'>) => {
        const newPass: Pass = {
            ...pass,
            id: generateId(),
            timestamp: Date.now(),
        };

        passes.value.push(newPass);
        await saveToStorage(passes.value);
        return newPass;
    };

    const updatePass = async (id: string, updates: Partial<Pass>) => {
        const index = passes.value.findIndex(p => p.id === id);
        if (index !== -1) {
            passes.value[index] = { ...passes.value[index], ...updates };
            await saveToStorage(passes.value);
        }
    };

    const deletePass = async (id: string) => {
        passes.value = passes.value.filter(p => p.id !== id);
        await saveToStorage(passes.value);
    };

    const getPassById = (id: string) => {
        return passes.value.find(p => p.id === id);
    };

    const clearAll = async () => {
        await Preferences.remove({ key: STORAGE_KEY });
        passes.value = [];
        isLoaded.value = false;
    };

    return {
        // State
        passes,
        isLoading,
        isLoaded,

        // Actions
        loadPasses,
        addPass,
        updatePass,
        deletePass,
        getPassById,
        clearAll,
    };
});