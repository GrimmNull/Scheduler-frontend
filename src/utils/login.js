export const login = async (usernameField, passwordField) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: usernameField,
            password: passwordField
        })
    })
    const status = response.status
    const results = await response.json()
    if (status !== 200) {
        return {
            type: 'Error',
            message: results.message
        }
    }
    //daca nu avem nicio eroare, atunci salvam in localStorage informatiile despre user
    localStorage.setItem('userId', results.userId)
    localStorage.setItem('username', results.username)
    localStorage.setItem('email', results.email)
    localStorage.setItem('token', results.token)
    localStorage.setItem('expiresAt', results.expiresAt)
    return {
        type: 'Success',
        message: 'You have successfully logged in'
    }
}