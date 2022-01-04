import create from 'zustand'


export const useFetch= create( set => ({
    refetch: false,
    reload: () => set(state => ({refetch: !state.refetch}))
    }))