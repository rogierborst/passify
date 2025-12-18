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

/** Save all passes to storage at the storage key. */
export const savePasses = async (passes: Pass[]): Promise<void> => {
    await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(passes),
    });
};

/** Get all passes saved in storage. */
export const getPasses = async (): Promise<Pass[]> => {
    console.log('getting passes');
    const { value } = await Preferences.get({key: STORAGE_KEY });

    return value ? JSON.parse(value) : [];
}

/** Add a single pass to the storage. */
export const addPass = async (pass: Pass): Promise<Pass> => {
    const existingPasses = await getPasses();
    const newPass = {
        ...pass,
        id: generateId(),
        timestamp: Date.now(),
    }

    existingPasses.push(newPass);
    await savePasses(existingPasses);

    return newPass;
}

export const getPass = async (id: string): Promise<Pass | undefined> => {
    const passes = await getPasses();

    return passes.find((pass) => pass.id === id);
}

/** Persist changes to pass at given id. */
export const updatePass = async (id: string, updatedPass: Partial<Pass>): Promise<void> => {
    const passes = await getPasses();
    const index = passes.findIndex(pass => pass.id === id);
    if (index !== -1) {
        passes[index] = { ...passes[index], ...updatedPass };
        await savePasses(passes);
    }
}

export const deletePass = async (id: string): Promise<void> => {
    const passes = await getPasses();
    const filtered = passes.filter(pass => pass.id !== id);
    await savePasses(filtered);
}

export const clearAll = async () : Promise<void> => {
    await Preferences.remove({key: STORAGE_KEY});
}