import React from "react";
import { useEffect, useState, useRef } from 'react'

type DndArgs = {
  startX: number,
  startY: number,
  onDrag?: (newX: number, newY: number) => void,
  onFinish?: (newX: number, newY: number) => void,
}

type DndResult = {
  isDragging: boolean,
  top: number,
  left: number,
  onMouseDown: (event: React.MouseEvent) => void,
}

function useDnd(args: DndArgs): DndResult {
  const {
    startX,
    startY,
    onDrag,
    onFinish,
  } = args

  const [isDragging, setIsDragging] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [top, setTop] = useState(startY)
  const [left, setLeft] = useState(startX)
  
  const originalPosRef = useRef({ x: startX, y: startY })
  const hasPositionChangedRef = useRef(false)

  useEffect(() => {
    if (!isDragging) {
      setTop(startY)
      setLeft(startX)
    }
  }, [startX, startY, isDragging])

  const onMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true)
    setOffsetY(event.clientY - top)
    setOffsetX(event.clientX - left)
    originalPosRef.current = { x: startX, y: startY }
    hasPositionChangedRef.current = false
  }

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const newTop = event.clientY - offsetY
        const newLeft = event.clientX - offsetX
        
        const deltaX = Math.abs(newLeft - originalPosRef.current.x)
        const deltaY = Math.abs(newTop - originalPosRef.current.y)
        const hasMoved = deltaX > 1 || deltaY > 1 
        
        if (hasMoved) {
          setTop(newTop)
          setLeft(newLeft)
          onDrag?.(newLeft, newTop)
          hasPositionChangedRef.current = true
        }
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isDragging, offsetX, offsetY, onDrag])

  useEffect(() => {
    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        
        if (hasPositionChangedRef.current) {
          onFinish?.(left, top)
        }
      }
    }

    if (isDragging) {
      window.addEventListener('mouseup', onMouseUp)
    }

    return () => {
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, left, top, onFinish])

  return {
    isDragging,
    top,
    left,
    onMouseDown,
  }
}

export {
  useDnd,
}