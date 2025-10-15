
import type React from "react"
import type { User } from "../../Types/User";


interface DasboardPageProps {
  user: User | null; // ✅ Thêm prop user
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}



export default function DasboardPage({  user,setUser }: DasboardPageProps) {
  

  return (
    <>
      {user ? (
            <div>
                    <h1>day la DasboardPages</h1>
            </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  )
}
