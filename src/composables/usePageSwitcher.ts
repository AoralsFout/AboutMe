import { shallowRef, ref, type Component, type Ref, type ShallowRef, type InjectionKey } from 'vue'
import type { DynamicPage } from '@/types/DynamicPage'

export interface PageItem {
  id: number
  component: Component
}

export interface SlotState {
  left: Ref<string>
  zIndex: Ref<string>
  component: ShallowRef<Component | null>
  compRef: Ref<DynamicPage | null>
}

// 外部接口供禁用鼠标滚动
export interface WheelControl {
  setWheelEnabled: (enabled: boolean) => void
}

export const WHEEL_CONTROL_KEY: InjectionKey<WheelControl> = Symbol('wheelControl')

const POSITIONS = ['-100vw', '0vw', '100vw'] as const
const Z_INDICES = ['1', '2', '3'] as const

function createSlots(): [SlotState, SlotState, SlotState] {
  return [
    { left: ref('-100vw'), zIndex: ref('1'), component: shallowRef(null), compRef: ref(null) },
    { left: ref('0vw'), zIndex: ref('2'), component: shallowRef(null), compRef: ref(null) },
    { left: ref('100vw'), zIndex: ref('3'), component: shallowRef(null), compRef: ref(null) },
  ]
}

export function usePageSwitcher(pages: PageItem[]) {
  const slots = createSlots()

  const order = ref<[number, number, number]>([0, 1, 2])
  const currentPageId = ref(1)
  const switching = ref(false)
  const wheelEnabled = ref(true)

  const sortedIds = pages.map(p => p.id).sort((a, b) => a - b)

  slots[1].component.value = pages.find(p => p.id === currentPageId.value)?.component ?? null

  function findComponent(id: number): Component | null {
    return pages.find(p => p.id === id)?.component ?? null
  }

  function unmountSlot(slotIdx: number) {
    const slot = slots[slotIdx]!
    if (slot.compRef.value) {
      slot.compRef.value.unmount()
      setTimeout(() => {
        slot.component.value = null
      }, 400)
    }
  }

  function unmount() {
    unmountSlot(order.value[1])
  }

  function switchToPage(id: number) {
    if (id === currentPageId.value || switching.value) return

    switching.value = true
    setTimeout(() => { switching.value = false }, 400)

    const oldOrder = order.value
    const newOrder: [number, number, number] = id < currentPageId.value
      ? [oldOrder[2], oldOrder[0], oldOrder[1]]
      : [oldOrder[1], oldOrder[2], oldOrder[0]]

    for (const pos of [0, 1, 2] as const) {
      slots[newOrder[pos]]!.left.value = POSITIONS[pos]
    }

    slots[newOrder[1]]!.component.value = findComponent(id)

    unmountSlot(oldOrder[1])

    order.value = newOrder
    for (const pos of [0, 1, 2] as const) {
      slots[newOrder[pos]]!.zIndex.value = Z_INDICES[pos]
    }
    currentPageId.value = id
  }

  function switchToNext() {
    const idx = sortedIds.indexOf(currentPageId.value)
    if (idx < sortedIds.length - 1) {
      switchToPage(sortedIds[idx + 1]!)
    }
  }

  function switchToPrev() {
    const idx = sortedIds.indexOf(currentPageId.value)
    if (idx > 0) {
      switchToPage(sortedIds[idx - 1]!)
    }
  }

  function setWheelEnabled(enabled: boolean) {
    wheelEnabled.value = enabled
  }

  function onWheel(e: WheelEvent) {
    if (!wheelEnabled.value) return
    if (e.deltaY > 0) {
      switchToNext()
    } else if (e.deltaY < 0) {
      switchToPrev()
    }
  }

  function getCurrentTransition(direction: 'next' | 'prev'): string | null {
    const centerIdx = order.value[1]
    const page = slots[centerIdx]!.compRef.value
    if (!page) return null
    return direction === 'next' ? (page.nextTransition ?? null) : (page.prevTransition ?? null)
  }

  return {
    slots, pages, currentPageId,
    switchToPage, switchToNext, switchToPrev,
    unmount, onWheel, setWheelEnabled, wheelEnabled,
    getCurrentTransition,
  }
}
