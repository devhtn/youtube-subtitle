import { useEffect, useRef, useState } from 'react'

import { io } from 'socket.io-client'

import env from '~/config/env'

const useCommentSocket = (userId) => {
  const socketRef = useRef(null)
  const [newNotify, setNewNotify] = useState(null)

  useEffect(() => {
    if (!userId) return

    // Tạo kết nối WebSocket một lần duy nhất cho mỗi userId
    socketRef.current = io(env.API_URL)

    // Gửi userId khi kết nối
    socketRef.current.emit('register', userId)

    // Lắng nghe sự kiện 'comment' và cập nhật trạng thái
    const handleNewNotification = (newNotification) => {
      setNewNotify(newNotification)
    }

    socketRef.current.on('comment', handleNewNotification)

    // Dọn dẹp khi component unmount hoặc userId thay đổi
    return () => {
      socketRef.current.off('comment', handleNewNotification) // Loại bỏ sự kiện khi component unmount
      socketRef.current.disconnect()
      console.log('Socket disconnected')
    }
  }, [userId]) // Tái tạo socket khi userId thay đổi

  return { socketRef, newNotify }
}

export default useCommentSocket
