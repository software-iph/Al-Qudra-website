import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-navy-950 pt-20 text-white">
      <div className="container-x text-center">
        <p className="text-8xl font-extrabold text-sky" dir="ltr">
          404
        </p>
        <h1 className="mt-6 text-3xl font-extrabold">Page not found · الصفحة غير موجودة</h1>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/ar" className="btn-light">
            الرئيسية
          </Link>
          <Link href="/en" className="btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
