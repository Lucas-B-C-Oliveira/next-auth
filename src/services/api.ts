import { signOut } from '@/context/AuthContext'
import axios, { AxiosError } from 'axios'
import { GetServerSidePropsContext, PreviewData } from 'next'
import { parseCookies, setCookie } from 'nookies'
import { ParsedUrlQuery } from 'querystring'
import { AuthTokenError } from './errors/AuthTokenError'

let isRefreshing = false
let failedRequestsQueue: any[] = []

export function setupAPIClient(ctx: undefined | GetServerSidePropsContext<ParsedUrlQuery, PreviewData> = undefined) {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`
    }
  })


  api.interceptors.response.use(response => {
    return response
  }, (error: AxiosError) => {
    if (error?.response?.status === 401) {
      // @ts-ignore
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx)
        const { 'nextauth.refreshToken': refreshToken } = cookies
        const originalConfig = error.config

        if (!isRefreshing) {
          isRefreshing = true

          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data

            setCookie(ctx, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })

            setCookie(ctx, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            failedRequestsQueue.forEach((request: any) => request.onSuccess(token))
            failedRequestsQueue = []

          }).catch(err => {
            failedRequestsQueue.forEach((request: any) => request.onFailure(err))
            failedRequestsQueue = []
            if (process.browser) {
              signOut()
            }

          }).finally(() => {
            isRefreshing = false
          })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              //@ts-ignore
              originalConfig.headers['Authorization'] = `Bearer ${token}`
              resolve(originalConfig)
            },
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        })
      }
      else {
        if (process.browser) {
          signOut()
        }
        else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error)
  })

  return api
}
