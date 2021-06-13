import { useBackend } from '@h/useBackend'
import { CollectionNames } from '@t/Relations'
import { useEffect } from 'react'

export default function TestPage() {
  const be = useBackend()

  useEffect(() => {
    console.log(be.firestore())
  }, [])

  const createExercise = async () => {
    const service = be.getService(CollectionNames.EXERCISE)
    const [data, error] = await service.create({
      name: 'PUSH UP',
      exerciseId: '-1',
      tags: [],
      createdBy: '-1',
    })
    console.log({ data, error })
  }

  return (
    <div className="h-full-screen w-screen bg-bg-gray flex flex-col flex-center">
      <h1>Click to create</h1>
      <button onClick={createExercise} className="block btn btn--ghost">
        Click me to create mock exercise
      </button>
    </div>
  )
}
