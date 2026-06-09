import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-center px-6">
      <h1 className="text-6xl font-bold font-space-grotesk text-gradient mb-4">
        404
      </h1>
      <p className="text-xl text-text-secondary mb-8">
        Yeh page nahi mila.
      </p>
      <Link
        href="/check"
        className="inline-block px-8 py-4 bg-accent hover:bg-accent-2 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
      >
        GST rate check karein →
      </Link>
    </div>
  );
}
