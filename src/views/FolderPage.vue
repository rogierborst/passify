<script setup lang="ts">
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
} from '@ionic/vue';

import {
    CapacitorBarcodeScanner,
    CapacitorBarcodeScannerAndroidScanningLibrary,
    CapacitorBarcodeScannerCameraDirection,
    CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerScanResult,
    CapacitorBarcodeScannerTypeHintALLOption
} from '@capacitor/barcode-scanner';
import { ref, useTemplateRef } from "vue";
import QRCode from "@/components/QR-Code.vue";
import BarCode from "@/components/BarCode.vue";
import { Capacitor } from '@capacitor/core';
import WebScanner from '@/components/WebScanner.vue';
import { ScanResult } from '@/types/scan';

const scannedCode = ref<CapacitorBarcodeScannerScanResult | null>(null);
const data = ref<string | null>(null);
const dataType = ref<string | number | null>(null);

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
            web: {
                showCameraSelection: true,
                scannerFPS: 30
            }
        });

        data.value = scannedCode.value.ScanResult;
        dataType.value = scannedCode.value.format;
    } catch (error) {
        console.error('🥐', error);
    }
}
</script>

<template>
    <ion-page>
        <span id="reader" />
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>{{ $route.params.id }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">{{ $route.params.id }}</ion-title>
                </ion-toolbar>
            </ion-header>

            <div id="container">
                <WebScanner ref="webScannerRef" />
                <ion-button @click="scanCode" style="margin-bottom: 1rem;">Scannen</ion-button>

                <div style="margin-bottom: 1rem;">
                    Code: <span v-text="data || 'No code, yet'" />
                </div>
                <div>
                    Format: <span v-text="dataType || 'No format, yet'" />
                </div>

                <QRCode :data="scannedCode?.ScanResult ?? ''" />

                 <hr />
                <BarCode :data="scannedCode?.ScanResult ?? ''" />
            </div>
        </ion-content>
    </ion-page>
</template>

<style scoped>
#container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

#container strong {
    font-size: 20px;
    line-height: 26px;
}

#container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
}

#container a {
    text-decoration: none;
}
</style>
