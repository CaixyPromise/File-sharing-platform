import store from "./index"

// 定义 dispatch 和 RootState 类型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;