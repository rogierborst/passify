<script setup lang="ts">
import {useQRCode} from '@vueuse/integrations/useQRCode'
import {toRefs} from "vue";

interface Props {
    data?: string;
    backgroundColor?: string;
    lineColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
    backgroundColor: '#fff',
    lineColor: '#000'
});

const { data } = toRefs(props);

const qrCode = useQRCode(data, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
        dark: props.lineColor,
        light: props.backgroundColor,
    },
});

</script>

<template>
    <img v-if="data" :src="qrCode" alt="QR Code" />
</template>

<style scoped>
img {
    width: 100%;
}
</style>