import { AuthContext } from "@/context/AuthContext"
import { api } from "@/services/api"
import { useContext, useEffect } from "react"


export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me')
      .then((response: any) => console.log(response))
      .catch(err => console.log(err))
  })

  return (
    <h1>Dashboard: {user?.email}</h1>
  )
}