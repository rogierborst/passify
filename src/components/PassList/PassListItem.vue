<script setup lang="ts">
import { useRouter } from 'vue-router';
import { textColorForBackground } from '@/utils/color';
import { Pass } from '@/stores/passes';
import { computed } from 'vue';
import { format, parseISO } from 'date-fns';

const props = defineProps<{ pass: Pass }>();

const router = useRouter();
const showPass = () => router.push(`/pass/${ props.pass.id }`);

const expiryLabel = computed(() => {
    if (!props.pass.expires) return null;
    return format(parseISO(props.pass.expires), 'd MMM yyyy');
});
</script>

<template>
    <div
        :style="{ backgroundColor: pass.color }"
        class="pass-item"
        @click="showPass()"
    >
        <h2 v-text="pass.label" :style="{ color: textColorForBackground(pass.color)}" />
        <p v-if="expiryLabel" class="expiry" :style="{ color: textColorForBackground(pass.color) }">
            Verloopt: {{ expiryLabel }}
        </p>
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

.expiry {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    opacity: 0.8;
}
</style>