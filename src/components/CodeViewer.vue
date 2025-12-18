<script setup lang="ts">
import BarCode from '@/components/BarCode.vue';
import QRCode from '@/components/QR-Code.vue';
import { ScanResult } from '@/types/scan';
import { computed } from 'vue';
import { Pass } from '@/services/pass-storage';

interface Props {
    data: ScanResult | Pass;
    lineColor?: string;
    backgroundColor?: string;
}

const props = defineProps<Props>();

const format = computed(() => {
    return props.data.dataType ?? props.data.format;
})
</script>

<template>
    <div class="container">
        <QRCode v-if="format === 'QR_CODE'" :data="data.data" />
        <BarCode v-if="format !== 'QR_CODE'" :data="data.data" />
    </div>
</template>

<style scoped>
.container {
    max-width: 100%;
}
</style>
