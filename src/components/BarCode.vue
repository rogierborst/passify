<script setup lang="ts">
import JsBarcode from "jsbarcode";
import { onMounted, useTemplateRef, watch } from "vue";

const svgRef = useTemplateRef('canvas');

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
<svg ref="canvas" />
</template>

<style scoped>
svg {
    width: 100%;
}
</style>