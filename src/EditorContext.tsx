import React, { createContext, Dispatch, FC, Reducer, useReducer } from "react"

export type EditorProps = {
    pdfData: ArrayBufferLike | null
    type: "vip" | "regular"
}

const initial_state:EditorProps = {
    pdfData: null,
    type: "regular"
}

export enum Actions {
    DATA_CHANGED = "data_changed",
    TYPE_CHANGED = "type_changed"
}

type ActionProps = {
    type: Actions,
    payload: any
}

const EditorContext = createContext<{state: EditorProps, dispatch: Dispatch<ActionProps>}>({
    state: initial_state,
    dispatch: () => null
})

const reducer:Reducer<EditorProps, ActionProps> = (state, action) => {
    switch(action.type) {
        case Actions.DATA_CHANGED:
            return {...state, pdfData: action.payload}
        case Actions.TYPE_CHANGED:
            return {...state, type: action.payload}
        default:
            return {...state}
    }
}

type Props = {
    children?: React.ReactNode
  };

const EditorProvider:FC<Props> = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initial_state)

    return (
        <EditorContext.Provider value={{state, dispatch}}>{children}</EditorContext.Provider>
    )
}

export {EditorContext, EditorProvider}