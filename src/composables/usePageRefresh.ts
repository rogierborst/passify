import { inject, InjectionKey, provide, ref, Ref } from 'vue';

export const PageRefreshKey: InjectionKey<Ref<number>> = Symbol('PageRefresh');

export function providePageRefresh() {
    const key = ref(0);
    provide(PageRefreshKey, key);

    return key;
}

export function usePageRefreshSignal(): Ref<number> {
    const key = inject(PageRefreshKey);
    if (!key) throw new Error('usePageRefreshSignal must be used inside a page');

    return key;
}