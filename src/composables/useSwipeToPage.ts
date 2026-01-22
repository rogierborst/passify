import { onMounted, TemplateRef } from 'vue';
import { createGesture, Gesture } from '@ionic/vue';
import { useRouter } from 'vue-router';

export function useSwipeToPage(pageElement: TemplateRef<HTMLElement | null>, targetRoute: string): void {
    const router = useRouter();
    let gesture: Gesture | null = null;

    onMounted(() => {
        if (!pageElement.value) {
            console.error('Page element was not found');
            return;
        }

        gesture = createGesture({
            el: pageElement.value,
            gestureName: 'to-index',
            direction: 'x',
            threshold: 50,
            onMove: (detail) => {
                if (detail.deltaX > 0) {
                    // Swiping right (going back)
                    const opacity = Math.min(detail.deltaX / 100, 0.7);
                    pageElement.value!.style.transform = `translateX(${detail.deltaX}px)`;
                    pageElement.value!.style.opacity = (1 - opacity).toString();
                }
            },
            onEnd: (detail) => {
                // Reset visual feedback
                pageElement.value!.style.transform = '';
                pageElement.value!.style.opacity = '';

                // If swiped right more than 100px, navigate
                if (detail.deltaX > 200) {
                    router.push(targetRoute);
                }
            }
        });

        gesture.enable();
    });
}