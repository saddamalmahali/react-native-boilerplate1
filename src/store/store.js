import { applyMiddleware, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistCombineReducers } from 'redux-persist'
import { createLogger } from 'redux-logger'
import storage from '@react-native-async-storage/async-storage'

import globalSlice from './globalSlice'
import usersSlice from '../screens/UsersScreen/slice'
import settingsSlice from '../screens/SettingsScreen/slice'
import usersSaga from '../screens/UsersScreen/saga'

// group all reducers in a single reducer object
// ---------------------------------------
const reducers = {
    global: globalSlice,
    users: usersSlice,
    settings: settingsSlice
}

// Make Config For Redux Persist
// ---------------------------------------
const config = {
    key: 'root',
    storage,
    debug: false
}

// Middleware Object
// ---------------------------------------
const middleware = []

// create sagaMiddleware
// ---------------------------------------
const sagaMiddleware = createSagaMiddleware()

middleware.push(sagaMiddleware)

if (__DEV__) {
    middleware.push(createLogger())
}

// Make Object Persist Reducer
// ---------------------------------------
const persistedReducer = persistCombineReducers(config, reducers)
const enhancers = [applyMiddleware(...middleware)]
const persistConfig = { ...enhancers }

// create/configure store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
    enhancers: enhancers,
    devTools: process.env.NODE_ENV !== 'production'
})

const persistor = persistStore(store, persistConfig, () => {
    // console.log('Test: ', store.getState())
})

const configureStoreData = () => {
    return { persistor, store }
}

// run sagas in sagaMiddleware after mounting it in the store
sagaMiddleware.run(usersSaga)

export default configureStoreData