const useRouter = jest.spyOn(require('next/router'), 'useRouter')

/**
 * mockNextUseRouter
 * Mocks the useRouter React hook from Next.js on a test-case by test-case basis
 */
export function mockNextUseRouter({
  route = '',
  pathname = '',
  asPath = '',
  query = '',
  replace = () => {},
}: {
  route?: string
  pathname?: string
  query?: string | object
  asPath?: string
  replace?: (path?: string) => void
}) {
  useRouter.mockImplementation(() => ({
    route,
    pathname,
    query,
    asPath,
    replace,
  }))
}
