import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import accountReducer from "./src/reducers/accountReducer.js";
import directoryReducer from "./src/reducers/directoryReducer";
import settingReducer from "./src/reducers/settingReducer";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const rootReducer = combineReducers({
  account: accountReducer,
  directory: directoryReducer,
  setting: settingReducer,
});

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
