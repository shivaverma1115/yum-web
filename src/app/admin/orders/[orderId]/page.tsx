import OrderDetails from "@/components/admin/orders/OrderDetails";
import Preloader from "@/components/layout/Preloader";
import { Suspense } from "react";
import { Metadata } from 'next';
interface AdminOrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}
export const metadata: Metadata = {
  title: "Order Details",
  description: "Order Details",
};

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<Preloader />}>
      <OrderDetails orderId={orderId} />
    </Suspense>
  )
}
