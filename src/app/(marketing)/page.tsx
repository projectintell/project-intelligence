import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getLocale } from '@/lib/i18n/get-locale';

export default async function HomePage() {
  const dict = await getDictionary(getLocale());

  return (
    <section className="py-20">
      <h1 className="text-4xl font-bold tracking-tight">{dict.home.title}</h1>
      <p className="mt-2 text-sm italic text-slate-500">{dict.home.definition}</p>
      <p className="mt-6 max-w-2xl text-slate-600">{dict.home.intro}</p>
      <div className="mt-8 flex gap-4">
        <a
          href="/claim-score"
          className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white"
        >
          {dict.home.ctaTryClaimScore}
        </a>
        <a
          href="/pricing"
          className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium"
        >
          {dict.home.ctaViewPricing}
        </a>
      </div>
    </section>
  );
}
