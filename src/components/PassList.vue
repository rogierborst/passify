<script setup lang="ts">
import { getPasses, type Pass } from '@/services/pass-storage';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const allPasses = ref<Pass[]>([]);
const router = useRouter();

const showPass = (passId: string) => {
    console.log('going to pass:', passId);
    router.push(`/pass/${ passId }`);
}

onMounted(async () => {
    allPasses.value = await getPasses();
})
</script>

<template>
    <div>
        <div
            v-for="pass in allPasses"
            :key="pass.id"
            :style="{ backgroundColor: pass.color }"
            class="pass-item"
            @click="showPass(pass.id)"
        >
            <h2 v-text="pass.label" />
        </div>
    </div>
</template>

<style scoped>
.pass-item {
    border-radius: 2rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
}
</style>
