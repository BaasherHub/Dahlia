import { Navbar } from "@/components/store/navbar";
import { Footer } from "@/components/store/footer";
import { PromoStrip } from "@/components/store/promo-strip";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40">
        <PromoStrip />
        <Navbar />
      </div>
      <main className="pt-[calc(2.5rem+4rem)]">{children}</main>
      <Footer />
    </>
  );
}
