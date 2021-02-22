export function copyToClipboard(value, enqueueSnackbar, message, type = 'default') {
    // type: default, success, error, warning, info
    navigator.clipboard.writeText(value)
    enqueueSnackbar(message, {
        variant: type,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
        },
    })
}


export function showNotification(enqueueSnackbar, message, type = 'default') {
    // type: default, success, error, warning, info
    enqueueSnackbar(message, {
        variant: type,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
        },
    })
}