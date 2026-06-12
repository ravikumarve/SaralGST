import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="status-badge mb-6">
        Error 404
      </div>

      <h1 className="text-[8rem] md:text-[12rem] font-bold font-space-grotesk leading-none text-gradient mb-4">
        404
      </h1>

      <p className="text-xl text-[#a1a1aa] mb-10">
        Yeh page nahi mila.
      </p>

      <Link href="/check" className="btn btn-primary">
        GST Rate Check Karein →
      </Link>
    </div>
  );
}
