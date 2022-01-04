import create from 'zustand'

export const useAuth= create(set => ({
    auth: localStorage.getItem('auth') !== undefined ? localStorage.getItem('auth') : false,
    setAuth: (payload) => set( state => {
        localStorage.setItem('auth', payload)
        return {
            auth: payload
        }
    })
}))
//https://kentcdodds.com/blog/how-to-use-react-context-effectively