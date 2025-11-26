<script setup lang="ts">
import { getPasses, type Pass } from '@/services/pass-storage';
import { onMounted, ref } from 'vue';
import PassListItem from '@/components/PassList/PassListItem.vue';

const allPasses = ref<Pass[]>([]);

onMounted(async () => {
    allPasses.value = await getPasses();
})
</script>

<template>
    <div class="pass-list">
        <PassListItem v-for="pass in allPasses" :key="pass.id" :pass />
    </div>
</template>

<style scoped>
.pass-list {
    padding: 0 .5rem;
}
</style>
