import { Can } from "@/components/Can"
import { AuthContext } from "@/context/AuthContext"
import { useCan } from "@/hooks/useCan"
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
    <>
      <h1>Dashboard: {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>Métricas</div>
      </Can>
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