import React from "react";
import { useEffect, useState } from 'react'

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
	}

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			if (isDragging) {
				const newTop = event.clientY - offsetY
				const newLeft = event.clientX - offsetX
				setTop(newTop)
				setLeft(newLeft)
				onDrag?.(newLeft, newTop)
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
				onFinish?.(left, top)
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