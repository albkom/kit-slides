<script setup lang="ts">
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'

interface TopperData { logo: string | null; department: string | null }

const topper = inject<ComputedRef<TopperData>>('slideTopper')
const logo       = computed(() => topper?.value?.logo       ?? null)
const department = computed(() => topper?.value?.department ?? null)
const hasContent = computed(() => !!(logo.value || department.value))

defineExpose({ hasContent })
</script>

<template>
  <div v-if="hasContent" class="slide-topper">
    <img v-if="logo" :src="logo" class="slide-logo" alt="logo" />
    <span v-if="department" class="slide-dep">{{ department }}</span>
  </div>
</template>
