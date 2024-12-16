import { Outlet } from "react-router"
import Sidebar from "~/elements/sidebar"
import Header from "~/elements/header"

const MainLayout = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <span className="flex">
        <Sidebar />
        <main className="bg-kgray text-kgray-darkest flex-1 h-full">
          <Outlet />
        </main>
      </span>
    </div>
  )
}

export default MainLayout