import { setupAPIClient } from "@/services/api"
import { withSSRAuth } from "@/utils/withSSRAuth"


export default function Metrics() {

  return (
    <>
      <h1>Metrics</h1>
      <div>Métricas</div>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx)
  await apiClient.get('/me')

  return {
    props: {}
  }
}, {
  permissions: ['metrics.list'],
  roles: ['administrator']
})