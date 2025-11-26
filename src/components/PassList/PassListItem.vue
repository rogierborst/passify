<script setup lang="ts">
import type { Pass } from '@/services/pass-storage';
import { useRouter } from 'vue-router';

const props = defineProps<{ pass: Pass }>();

const router = useRouter();
const showPass = () => router.push(`/pass/${ props.pass.id }`);
</script>

<template>
    <div
        :style="{ backgroundColor: pass.color }"
        class="pass-item"
        @click="showPass()"
    >
        <h2 v-text="pass.label" />
    </div>
</template>

<style scoped>
.pass-item {
    border-radius: .5rem .5rem 0 0;
    padding-top: 1rem;
    padding-bottom: 2.5rem;
    margin-bottom: -2rem;
    box-shadow: 0 -3px 5px rgba(0 0 0 / 20%);
    border-top: 1px solid rgba(255 255 255 / 60%);
}
</style>