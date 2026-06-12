import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#040814] text-center px-6 relative overflow-hidden">
      {/* L3 ambient orb */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#8a2be2] opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#00f0ff] opacity-15 blur-[100px] pointer-events-none" />

      {/* L3 Outfit 900 brutalist heading */}
      <h1 className="font-outfit font-black text-[10rem] md:text-[14rem] leading-none text-gradient mb-4 relative z-10">
        404
      </h1>

      {/* L2 muted subtitle */}
      <p className="text-xl text-[#71717a] mb-10 relative z-10">
        Yeh page nahi mila.
      </p>

      {/* L1 gradient CTA */}
      <Link
        href="/check"
        className="relative z-10 inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-black font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all duration-200 hover:-translate-y-0.5"
      >
        GST Rate Check Karein →
      </Link>
    </div>
  );
}
