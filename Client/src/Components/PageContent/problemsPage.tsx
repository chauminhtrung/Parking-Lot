
import type React from "react"
import type { User } from "../../Types/User";


interface problemsPageProps {
  user: User | null; // ✅ Thêm prop user
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}



export default function problemsPage({  user,setUser }: problemsPageProps) {
  

  return (
    <>
      {user ? (
            <div>
                <h1>day la problemsPage</h1>
            </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  )
}
