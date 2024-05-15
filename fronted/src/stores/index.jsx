import {configureStore} from "@reduxjs/toolkit";
import tableReducer from "./modules/file";

const store = configureStore(
{
    reducer: {
        table: tableReducer,
    }
})

export default store;