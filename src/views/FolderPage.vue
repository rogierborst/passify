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
import {ref} from "vue";
import QRCode from "@/components/QR-Code.vue";
import BarCode from "@/components/BarCode.vue";

const scannedCode = ref<CapacitorBarcodeScannerScanResult | null>(null);

const scanCode = async () => {
    try {
        scannedCode.value = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
            scanInstructions: 'scan a code, bitch!',
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
            scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
            android: {
                scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT
            },
            web: {
                showCameraSelection: true,
                scannerFPS: 50
            }
        });
    } catch (error) {
        console.error('🥐', error);
    }
}
</script>

<template>
    <ion-page>
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
                <ion-button @click="scanCode" style="margin-bottom: 1rem;">Scannen</ion-button>

                <div style="margin-bottom: 1rem;">
                    Code: <span v-text="scannedCode?.ScanResult || 'No code, yet'" />
                </div>
                <div>
                    Format: <span v-text="scannedCode?.format || 'No format, yet'" />
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
