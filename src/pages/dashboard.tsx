import { AuthContext } from "@/context/AuthContext"
import { setupAPIClient } from "@/services/api"
import { api } from "@/services/APIClient"
import { withSSRAuth } from "@/utils/withSSRAuth"
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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  const response = await apiClient.get('/me')

  console.log('response', response)

  return {
    props: {}
  }
})