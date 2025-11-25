<script setup lang="ts">
import {
    CapacitorBarcodeScanner,
    CapacitorBarcodeScannerAndroidScanningLibrary,
    CapacitorBarcodeScannerCameraDirection,
    CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerScanResult,
    CapacitorBarcodeScannerTypeHintALLOption
} from '@capacitor/barcode-scanner';
import { ref, useTemplateRef } from "vue";
import { Capacitor } from '@capacitor/core';
import { ScanResult } from '@/types/scan';
import { CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner/dist/esm/definitions';
import WebScanner from '@/components/WebScanner.vue';
import QRCode from '@/components/QR-Code.vue';
import { IonButton, IonCard, IonCardHeader, IonCardContent } from '@ionic/vue';
import BarCode from '@/components/BarCode.vue';

const scannedCode = ref<CapacitorBarcodeScannerScanResult | null>(null);
const data = ref<string | null>(null);
const dataType = ref<string | number | null>(null);

const emit = defineEmits<{capture: [ScanResult]}>();

const webScannerRef = useTemplateRef('webScannerRef');
const scanCode = async () => {
    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
        const result: ScanResult | undefined = await webScannerRef.value!.scan();

        if (!result) {
            console.error('no scan result');
            return;
        }

        data.value = result.data;
        dataType.value = result.dataType;

        emit('capture', {
            data: data.value,
            dataType: dataType.value
        });

        return;
    }

    try {
        scannedCode.value = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
            scanInstructions: 'scan a code!',
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
            scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
            android: {
                scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT
            },
        });

        data.value = scannedCode.value.ScanResult;
        dataType.value = CapacitorBarcodeScannerTypeHint[scannedCode.value.format];

        emit('capture', {
            data: data.value,
            dataType: dataType.value
        });
    } catch (error) {
        console.error('🥐', error);
    }
}
</script>

<template>
    <WebScanner ref="webScannerRef" />
    <ion-card>
        <ion-card-header>
            <ion-button @click="scanCode" style="margin-bottom: 1rem;">Scannen</ion-button>
        </ion-card-header>
        <ion-card-content>
            <QRCode v-if="dataType === 'QR_CODE'" :data="data" />

            <BarCode v-if="dataType && dataType !== 'QR_CODE'" :data="data" />

            <div v-if="dataType" class="text-center">{{ data }}</div>
        </ion-card-content>
    </ion-card>
</template>
