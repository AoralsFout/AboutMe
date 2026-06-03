<template>
  <component :is="comp" v-if="comp" @done="$emit('done')" />
</template>

<script setup lang="ts">
import { ref, watch, shallowRef } from 'vue'
import ShatterWave from '@/transitions/ShatterWave.vue'
import VortexField from '@/transitions/VortexField.vue'
import BlocksShift from '@/transitions/BlocksShift.vue'
import StripesSwipe from '@/transitions/StripesSwipe.vue'
import DotsWave from '@/transitions/DotsWave.vue'

const props = defineProps<{
  transitionName: string | null
  active: boolean
}>()

defineEmits<{ done: [] }>()

const transitionMap: Record<string, typeof ShatterWave> = {
  ShatterWave,
  VortexField,
  BlocksShift,
  StripesSwipe,
  DotsWave
}

const comp = shallowRef<typeof ShatterWave | null>(null)

watch(() => props.active, (val) => {
  if (val && props.transitionName) {
    comp.value = transitionMap[props.transitionName] ?? null
  } else {
    comp.value = null
  }
})
</script>
