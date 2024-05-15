import { createBrowserRouter } from "react-router-dom"
import { UserList } from "@/pages/FilesTable"

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserList />
    }
])

export default router;