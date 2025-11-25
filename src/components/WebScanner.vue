<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { BrowserCodeReader, BrowserMultiFormatReader } from '@zxing/browser';
import { ScanResult } from '@/types/scan';

const isActive = ref<boolean>(false);
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

const emit = defineEmits<{
    capture: [ScanResult]
}>();

const codeReader: BrowserMultiFormatReader = new BrowserMultiFormatReader();

const scan = async () => {
    isActive.value = true;

    try {
        const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
        const selectedDevice = videoInputDevices[0].deviceId;

        const result = await codeReader.decodeOnceFromVideoDevice(selectedDevice, videoRef.value!);

        const returnData: ScanResult = {
            data: result.getText(),
            dataType: result.getBarcodeFormat()
        }
        emit('capture', returnData);

        return returnData;
    } catch (error) {
        console.error(error);
    } finally {
        // Clear video element
        if (videoRef.value && videoRef.value.srcObject) {
            const stream = videoRef.value.srcObject as MediaStream;
            const tracks = stream.getTracks();

            tracks.forEach((track) => {
                track.stop();
                track.enabled = false;
            })
            videoRef.value.srcObject = null;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        isActive.value = false;
    }
}
defineExpose({ scan });
</script>

<template>
    <div>
        <video
            ref="videoRef"
            style="background-color: rgba(215,202,181,0.7);"
            :class="{ active: isActive }"
        />
    </div>
</template>

<style scoped>
video.active {
    display: block;
    width: 100%;
    height: 60dvh;
}

video {
    display: none;
}
</style>
