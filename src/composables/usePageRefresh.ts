import { inject, InjectionKey, onUnmounted, provide, ref, Ref, watch } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';

/**
 * Composable to manage reactive page refresh signaling in Ionic Vue apps.
 *
 * Ionic pages are often cached and do not remount on navigation,
 * so Vue's `onMounted` does not trigger on every page visit.
 * This composable provides a reactive signal that increments
 * every time the page becomes active (`onIonViewWillEnter`),
 * allowing child components to react and refresh accordingly.
 *
 * ## Why use this?
 * - Enables child components to refresh data on each page visit without remounting.
 * - Avoids hacks like forcing remount or manual event buses.
 * - Integrates cleanly with Ionic lifecycle and Vue reactivity.
 *
 * ## Basic usage
 *
 * ```ts
 * // In your Ionic page component setup:
 * const refreshSignal = providePageRefreshSignal();
 *
 * onIonViewWillEnter(() => {
 *   // Optionally perform page-level reset logic here
 * });
 * ```
 *
 * ```ts
 * // In child components:
 * useOnPageRefresh(() => {
 *   // Refresh child component data here
 * });
 * ```
 *
 * This pattern allows child components to reactively run logic
 * every time the page is entered, without remounting or prop drilling.
 */

/**
 * Injection key for the page refresh reactive signal.
 * Used to provide/inject the refresh signal in the component tree.
 */
export const PageRefreshSignalKey: InjectionKey<Ref<number>> = Symbol('PageRefreshSignal');

/**
 * Provides a reactive refresh signal scoped to the current Ionic page.
 * The signal automatically increments on every `onIonViewWillEnter` lifecycle event.
 *
 * @returns A reactive number ref representing the current refresh state.
 */
export function providePageRefresh (): Ref<number> {
    const refreshSignal = ref(0);
    provide(PageRefreshSignalKey, refreshSignal);

    onIonViewWillEnter(() => refreshSignal.value++);

    return refreshSignal;
}

/**
 * Injects the page refresh reactive signal.
 * Must be called inside a component within a page that called `providePageRefreshSignal`.
 *
 * @throws Will throw an error if called outside the refresh signal provider.
 * @returns The reactive number ref representing the page refresh signal.
 */
export function usePageRefreshSignal (): Ref<number> {
    const refreshSignal = inject(PageRefreshSignalKey);
    if (!refreshSignal) {
        throw new Error('usePageRefreshSignal must be called within a component wrapped by providePageRefreshSignal');
    }

    return refreshSignal;
}

/**
 * Registers a callback function that runs every time the page refresh signal changes.
 * The callback can be synchronous or asynchronous.
 * Automatically cleans up the watcher when the component unmounts.
 *
 * @param callback - Function to execute when the page refresh signal updates.
 */
export function useOnPageRefresh (callback: () => void | Promise<void>): void {
    const refreshSignal = usePageRefreshSignal();

    const stopWatcher = watch(refreshSignal, () => {
        void callback();
    });

    onUnmounted(stopWatcher);
}