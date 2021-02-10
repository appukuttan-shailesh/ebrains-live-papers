import React from 'react'

const ContextMain = React.createContext()

const ContextMainProvider = props => {
    // Context state
    const [auth, setAuth] = React.useState({});

    return (
        <ContextMain.Provider
            value={{
                auth: [auth, setAuth],
            }}
        >
            {props.children}
        </ContextMain.Provider>
    )
}

export default ContextMain

export { ContextMainProvider }