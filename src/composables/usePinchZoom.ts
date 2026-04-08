import { ref, computed, watch, onUnmounted, type Ref } from 'vue';

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 300;

export function usePinchZoom(container: Ref<HTMLElement | null | undefined>) {
    const scale = ref(1);
    const panX = ref(0);
    const panY = ref(0);

    const transformStyle = computed(() => ({
        transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
        transformOrigin: 'center center',
        willChange: 'transform',
    }));

    let isPinching = false;
    let lastTapTime = 0;

    // Pinch state (captured at gesture start)
    let startScale = 1;
    let startPanX = 0;
    let startPanY = 0;
    let startDistance = 0;
    let startMidX = 0;
    let startMidY = 0;

    // Pan state
    let startTouchX = 0;
    let startTouchY = 0;

    function dist(a: Touch, b: Touch) {
        return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    }

    function midpoint(a: Touch, b: Touch) {
        return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    }

    // Convert screen position to coords relative to the element's center
    function toCenterRelative(screenX: number, screenY: number) {
        const rect = container.value!.getBoundingClientRect();
        return {
            x: screenX - rect.left - rect.width / 2,
            y: screenY - rect.top - rect.height / 2,
        };
    }

    function reset() {
        scale.value = 1;
        panX.value = 0;
        panY.value = 0;
    }

    function onTouchStart(e: TouchEvent) {
        if (e.touches.length === 2) {
            e.preventDefault();
            isPinching = true;
            startScale = scale.value;
            startPanX = panX.value;
            startPanY = panY.value;
            startDistance = dist(e.touches[0], e.touches[1]);
            const m = midpoint(e.touches[0], e.touches[1]);
            const c = toCenterRelative(m.x, m.y);
            startMidX = c.x;
            startMidY = c.y;
        } else if (e.touches.length === 1) {
            isPinching = false;
            const now = Date.now();
            if (now - lastTapTime < DOUBLE_TAP_MS) {
                reset();
                lastTapTime = 0;
                return;
            }
            lastTapTime = now;
            startTouchX = e.touches[0].clientX - panX.value;
            startTouchY = e.touches[0].clientY - panY.value;
        }
    }

    function onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 2 && isPinching) {
            const d = dist(e.touches[0], e.touches[1]);
            const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale * d / startDistance));

            // Keep the pinch midpoint fixed: derive content coords at start, reapply after scale
            const contentX = (startMidX - startPanX) / startScale;
            const contentY = (startMidY - startPanY) / startScale;

            scale.value = newScale;
            panX.value = startMidX - contentX * newScale;
            panY.value = startMidY - contentY * newScale;
        } else if (e.touches.length === 1 && !isPinching) {
            panX.value = e.touches[0].clientX - startTouchX;
            panY.value = e.touches[0].clientY - startTouchY;
        }
    }

    function onTouchEnd(e: TouchEvent) {
        if (e.touches.length === 0) {
            isPinching = false;
        } else if (e.touches.length === 1 && isPinching) {
            // One finger lifted during pinch — don't accidentally start panning
            isPinching = false;
        }
    }

    function attach(el: HTMLElement) {
        el.addEventListener('touchstart', onTouchStart, { passive: false });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd);
    }

    function detach(el: HTMLElement) {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
    }

    watch(container, (newEl, oldEl) => {
        if (oldEl) detach(oldEl);
        if (newEl) attach(newEl);
    }, { immediate: true });

    onUnmounted(() => {
        if (container.value) detach(container.value);
    });

    return { transformStyle };
}
