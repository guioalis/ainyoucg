import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

// 先使用最基本的配置
export const metadata: Metadata = {
  title: '喵哥AI女友 - 智能聊天伴侣',
  description: '一个基于 Gemini AI 的智能聊天应用，提供语音对话、图片识别、多语言支持等功能。让科技更有温度，让对话更有趣。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
