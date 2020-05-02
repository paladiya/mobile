export const setCurrentUser = user => ({
    type:'SET_CURRENT_USER',
    payload:user
})

export const doLogout = () => ({
    type:'LOG_OUT'
}) 