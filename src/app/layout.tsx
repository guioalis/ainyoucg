import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '喵哥AI女友 - 智能聊天伴侣',
  description: '一个基于 Gemini AI 的智能聊天应用，提供语音对话、图片识别、多语言支持等功能。让科技更有温度，让对话更有趣。',
  generator: 'Next.js',
  manifest: '/manifest.json',
  authors: [
    { name: 'Your Name' }
  ],
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '喵哥AI女友 - 智能聊天伴侣',
    description: '一个基于 Gemini AI 的智能聊天应用，提供语音对话、图片识别、多语言支持等功能。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '喵哥AI女友 - 智能聊天伴侣',
    description: '智能AI聊天应用，支持语音对话和图片识别',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-site-verification': 'your-google-verification-code',
    keywords: 'AI聊天, 人工智能, 语音助手, Gemini AI, 智能对话, 图片识别, 多语言支持, 语音合成'
  }
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
