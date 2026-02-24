import type { Metadata } from 'next'
import { MainLayout } from '@/components/layouts/main-layout'
import { RefundContent } from './refund-content'

export const metadata: Metadata = {
  title: 'Refund Policy | Plag Checker',
  description: "Understand Plag Checker's refund policy for subscription plans and services.",
}

export default function RefundPage() {
  return (
    <MainLayout>
      <RefundContent />
    </MainLayout>
  )
}
