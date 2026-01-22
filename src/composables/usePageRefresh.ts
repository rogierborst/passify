import { inject, InjectionKey, onUnmounted, provide, ref, Ref, watch } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';

export const PageRefreshKey: InjectionKey<Ref<number>> = Symbol('PageRefresh');

export function providePageRefresh () {
    const key = ref(0);
    provide(PageRefreshKey, key);

    onIonViewWillEnter(() => key.value++);

    return key;
}

export function usePageRefreshSignal (): Ref<number> {
    const key = inject(PageRefreshKey);
    if (!key) throw new Error('usePageRefreshSignal must be used inside a page');

    return key;
}

export function useOnPageRefresh (fn: () => void | Promise<void>) {
    const signal = usePageRefreshSignal();
    const stop = watch(signal, () => void fn());

    onUnmounted(stop);
}