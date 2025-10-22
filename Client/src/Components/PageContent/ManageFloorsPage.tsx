
import type React from "react"
import type { User } from "../../Types/User";


interface ManageFloorsPageProps {
  user: User | null; // ✅ Thêm prop user
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}



export default function ManageFloorsPage({  user,setUser }: ManageFloorsPageProps) {
  

  return (
    <>
      {user ? (
            <div>
                <h1>Thay doi o day ko xóa user</h1>
            </div>
      ) : (
        <h2 className="text-xl text-gray-500">Chưa đăng nhập</h2>
      )}
    </>

  )
}
