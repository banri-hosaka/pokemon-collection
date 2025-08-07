export default defineAppConfig({
  ui: {
    primary: 'red',
    gray: 'slate',
    button: {
      default: {
        size: 'md',
        variant: 'solid',
        color: 'primary',
        loadingIcon: 'i-heroicons-arrow-path-20-solid'
      }
    },
    input: {
      default: {
        size: 'md',
        color: 'white',
        variant: 'outline'
      }
    },
    card: {
      base: 'overflow-hidden',
      background: 'bg-white dark:bg-gray-900',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
      rounded: 'rounded-lg',
      shadow: 'shadow-lg',
      body: {
        base: '',
        background: '',
        padding: 'px-4 py-5 sm:p-6'
      },
      header: {
        base: '',
        background: '',
        padding: 'px-4 py-5 sm:px-6'
      },
      footer: {
        base: '',
        background: '',
        padding: 'px-4 py-4 sm:px-6'
      }
    }
  }
})