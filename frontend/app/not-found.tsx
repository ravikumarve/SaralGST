import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="mono text-[#FBBF24] text-xs uppercase tracking-[0.2em] mb-6">
        LOG_00 — Error 404
      </div>

      <h1 className="text-[8rem] md:text-[12rem] font-bold leading-none mb-4" style={{ color: '#020202', textShadow: '0 0 40px rgba(245,158,11,0.3), 0 0 80px rgba(245,158,11,0.1)' }}>
        404
      </h1>

      <p className="text-lg text-[#a1a1aa] mb-12 font-light">
        Yeh page nahi mila. The resource you requested does not exist in this namespace.
      </p>

      <Link href="/check" className="btn btn-primary">
        ← GST Rate Check Karein
      </Link>
    </div>
  );
}
