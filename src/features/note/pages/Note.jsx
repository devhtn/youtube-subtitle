import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import noteApi from '../noteApi'

const Note = () => {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  console.log(id)

  useEffect(() => {
    ;(async () => {
      const note = await noteApi.getNote(id)
      setNote(note)
    })()
  }, [])
  return <div>Note</div>
}

export default Note
