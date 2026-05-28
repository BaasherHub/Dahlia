import type { Metadata } from "next";
import { fetchOrderBySession } from "@/lib/api";
import { OrderSuccessView, type OrderDetails } from "@/components/store/order-success-view";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let order: OrderDetails | null = null;

  if (sessionId) {
    try {
      order = await fetchOrderBySession(sessionId);
    } catch {
      order = null;
    }
  }

  return <OrderSuccessView sessionId={sessionId} order={order} />;
}
