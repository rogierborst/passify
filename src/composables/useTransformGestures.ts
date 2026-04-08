import { ref, computed, watch, onUnmounted, type Ref } from 'vue';

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 300;

export function useTransformGestures(container: Ref<HTMLElement | null | undefined>) {
    const scale = ref(1);
    const panX = ref(0);
    const panY = ref(0);
    const rotation = ref(0); // degrees, snapped to 90° increments

    const transformStyle = computed(() => ({
        transform: `translate(${panX.value}px, ${panY.value}px) rotate(${rotation.value}deg) scale(${scale.value})`,
        transformOrigin: 'center center',
        willChange: 'transform',
    }));

    let isPinching = false;
    let lastTapTime = 0;

    // Two-finger gesture state (captured at gesture start)
    let startScale = 1;
    let startPanX = 0;
    let startPanY = 0;
    let startDistance = 0;
    let startMidX = 0;
    let startMidY = 0;
    let startRotation = 0;
    let startAngle = 0;

    // Pan state
    let startTouchX = 0;
    let startTouchY = 0;

    function dist(a: Touch, b: Touch) {
        return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    }

    function midpoint(a: Touch, b: Touch) {
        return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    }

    function angle(a: Touch, b: Touch) {
        return Math.atan2(b.clientY - a.clientY, b.clientX - a.clientX) * 180 / Math.PI;
    }

    // Convert screen position to coords relative to the element's center
    function toCenterRelative(screenX: number, screenY: number) {
        const rect = container.value!.getBoundingClientRect();
        return {
            x: screenX - rect.left - rect.width / 2,
            y: screenY - rect.top - rect.height / 2,
        };
    }

    function snapTo90(deg: number) {
        return Math.round(deg / 90) * 90;
    }

    function reset(touch?: Touch) {
        scale.value = 1;
        panX.value = 0;
        panY.value = 0;
        rotation.value = 0;
        if (touch) {
            startTouchX = touch.clientX;
            startTouchY = touch.clientY;
        }
    }

    function onTouchStart(e: TouchEvent) {
        if (e.touches.length === 2) {
            e.preventDefault();
            isPinching = true;
            startScale = scale.value;
            startPanX = panX.value;
            startPanY = panY.value;
            startRotation = rotation.value;
            startDistance = dist(e.touches[0], e.touches[1]);
            startAngle = angle(e.touches[0], e.touches[1]);
            const m = midpoint(e.touches[0], e.touches[1]);
            const c = toCenterRelative(m.x, m.y);
            startMidX = c.x;
            startMidY = c.y;
        } else if (e.touches.length === 1) {
            isPinching = false;
            const now = Date.now();
            if (now - lastTapTime < DOUBLE_TAP_MS) {
                e.preventDefault();
                reset(e.touches[0]);
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

            // Keep the pinch midpoint fixed
            const contentX = (startMidX - startPanX) / startScale;
            const contentY = (startMidY - startPanY) / startScale;
            scale.value = newScale;
            panX.value = startMidX - contentX * newScale;
            panY.value = startMidY - contentY * newScale;

            // Apply rotation delta freely during gesture
            const currentAngle = angle(e.touches[0], e.touches[1]);
            rotation.value = startRotation + (currentAngle - startAngle);
        } else if (e.touches.length === 1 && !isPinching) {
            panX.value = e.touches[0].clientX - startTouchX;
            panY.value = e.touches[0].clientY - startTouchY;
        }
    }

    function onTouchEnd(e: TouchEvent) {
        if (e.touches.length === 0) {
            isPinching = false;
            // Snap rotation to nearest 90°
            rotation.value = snapTo90(rotation.value);
        } else if (e.touches.length === 1 && isPinching) {
            // One finger lifted during pinch — snap rotation and don't start panning
            isPinching = false;
            rotation.value = snapTo90(rotation.value);
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
