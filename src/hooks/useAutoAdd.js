import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Runs onAdd once when the URL carries ?add=1 (quick-add links), then removes the param. */
export function useAutoAdd(onAdd) {
  const [params, setParams] = useSearchParams()
  const wanted = params.get('add') === '1'
  useEffect(() => {
    if (!wanted) return
    onAdd()
    setParams((p) => {
      p.delete('add')
      return p
    }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted])
}
