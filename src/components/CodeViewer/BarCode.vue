<script setup lang="ts">
import JsBarcode from "jsbarcode";
import { onMounted, ref, useTemplateRef, watch } from "vue";

const svgRef = useTemplateRef('canvas');
const rotatedCount = ref<number>(0);

interface Props {
    data?: string;
    lineColor?: string;
    backgroundColor?: string;
}

const props = withDefaults(defineProps<Props>(),{
    data: '007',
    lineColor: '#000',
    backgroundColor: '#fff',
});

watch(props, () => {
    renderBarcode();
});

const rotate = () => {
    rotatedCount.value = (rotatedCount.value + 1) % 4;

    const angle = 90 * rotatedCount.value;
    svgRef.value!.style.transform = `rotate(${angle}deg)`;
}

onMounted(() => renderBarcode());

const renderBarcode = () => {
    JsBarcode(svgRef.value, props.data, {
        background: props.backgroundColor,
        lineColor: props.lineColor,
        width: 5,
        height: 300
    });
}

</script>

<template>
<svg ref="canvas" @click="rotate" />
</template>

<style scoped>
svg {
    width: 100%;
}
</style>