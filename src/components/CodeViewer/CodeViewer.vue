<script setup lang="ts">
import BarCode from '@/components/CodeViewer/BarCode.vue';
import QRCode from '@/components/CodeViewer/QR-Code.vue';
import { ScanResult } from '@/types/scan';
import { computed, useTemplateRef } from 'vue';
import { Pass } from '@/stores/passes';
import { usePinchZoom } from '@/composables/usePinchZoom';

interface Props {
    data: ScanResult | Pass;
    lineColor?: string;
    backgroundColor?: string;
}

const props = defineProps<Props>();

const format = computed(() => {
    return 'dataType' in props.data ? props.data.dataType : props.data.format
})

const containerRef = useTemplateRef('containerRef');
const { transformStyle } = usePinchZoom(containerRef);
</script>

<template>
    <div class="container" ref="containerRef">
        <div :style="transformStyle">
            <QRCode v-if="format === 'QR_CODE'" :data="data.data" />
            <BarCode v-if="format !== 'QR_CODE'" :data="data.data" />
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
}
</style>
