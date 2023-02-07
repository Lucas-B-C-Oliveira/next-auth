import { AuthContext } from "@/context/AuthContext"
import { useCan } from "@/hooks/useCan"
import { setupAPIClient } from "@/services/api"
import { api } from "@/services/APIClient"
import { withSSRAuth } from "@/utils/withSSRAuth"
import { useContext, useEffect } from "react"


export default function Dashboard() {
  const { user } = useContext(AuthContext)

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.create']
  })

  useEffect(() => {
    api.get('/me')
      .then((response: any) => console.log(response))
      .catch(err => console.log(err))
  })

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      {userCanSeeMetrics && <div>Métricas</div>}
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  await apiClient.get('/me')

  return {
    props: {}
  }
})