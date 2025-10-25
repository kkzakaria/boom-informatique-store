import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  stock: number
  maxQuantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void

  // Computed properties
  totalItems: number
  totalPrice: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get()
        const existingItem = items.find(item => item.productId === newItem.productId)

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            existingItem.maxQuantity
          )
          get().updateQuantity(newItem.productId, newQuantity)
        } else {
          // Add new item
          set({
            items: [...items, { ...newItem, quantity: 1 }],
            isOpen: true
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId)
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map(item =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      get totalPrice() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        // Don't persist isOpen state
      })
    }
  )
)