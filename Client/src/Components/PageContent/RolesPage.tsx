
import type React from "react"
import type { User } from "../../Types/User";


interface RolesPageProps {
  user: User | null; // ✅ Thêm prop user
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}



export default function RolesPage({  user,setUser }: RolesPageProps) {
  

  return (
    <>
      {user ? (
            <div>
                <h1>day la RolesPage</h1>
            </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  )
}
