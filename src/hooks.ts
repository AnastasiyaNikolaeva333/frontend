import { useDispatch, useSelector, useStore, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch, AppStore } from './store/types' 
import * as ActionCreators from './store/action-creators/'
import { bindActionCreators } from 'redux'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore

export const useAppActions = () => {
    const dispatch = useDispatch()

    return bindActionCreators(ActionCreators, dispatch)
}