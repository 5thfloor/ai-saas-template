import { Header } from "@/components/header";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="fixed left-0 right-0 top-0 bg-white shadow-sm">
        <Header />
      </div>
      <main className="h-dvh bg-slate-50 pt-16">{children}</main>
    </>
  );
}
