export interface DynamicPage {
  unmount: () => void
  nextTransition?: string
  prevTransition?: string
}
