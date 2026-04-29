import {configureStore} from '@reduxjs/toolkit'
import userDataReducer from './userDataSlice'
import departmentDataReducer from './departmentDataSlice'
export const Store=configureStore({
    reducer:{
        userData:userDataReducer,
        departmentData:departmentDataReducer
    }
})