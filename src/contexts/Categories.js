import create from 'zustand'

export const useCategories= create(set => ({
    categories: [],
    setCategories: (payload) => set(state => ({categories: payload}))
}))