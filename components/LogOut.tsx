'use client'
import { authClient } from '@/lib/auth-client'
import  { MdLogout } from 'react-icons/md'

const LogOut = () => {
    
  return (
    <div>
      <button className="bg-red-500 text-white px-5 cursor-pointer hover:bg-red-600 transition-colors  duration-200 text-sm rounded-xs py-1 flex gap-2 items-center" onClick={async () => await authClient.signOut()}>Sign Out <MdLogout className="" /></button>
    </div>

  )
}

export default LogOut