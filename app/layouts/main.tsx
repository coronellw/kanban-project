import { Outlet } from "react-router"

const MainLayout = () =>{
  return (
    <div className="flex flex-col">
      <header className="flex-1">Header</header>
      <aside className="w-64">Sidbar</aside>
      <main className="bg-kgray text-kgray-darkest flex-1 h-full">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout