import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { contentService } from '../services/api/services'
import type { ContentRecord } from '../types/domain'

const fallbackHero: ContentRecord = {
  id: 'hero-default',
  type: 'hero',
  title: 'Sistem Klinik Modern untuk Operasional Harian',
  subtitle: 'Kelola pasien, antrian, pemeriksaan, reminder, keuangan, HRD, dan laporan dalam satu dashboard.',
  description: 'Siap deploy Cloudflare + Google Sheets + Google Apps Script.',
  cta_text: 'Masuk Dashboard',
  cta_link: '/login',
  is_active: 'true',
  sort_order: 1,
}

export function LandingPage() {
  const [hero, setHero] = useState<ContentRecord>(fallbackHero)
  const [features, setFeatures] = useState<ContentRecord[]>([])
  const [pricing, setPricing] = useState<ContentRecord[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [heroData, featureData, pricingData] = await Promise.all([
          contentService.list('hero'),
          contentService.list('features'),
          contentService.list('pricing'),
        ])

        if (heroData.length > 0) setHero(heroData[0])
        setFeatures(featureData)
        setPricing(pricingData)
      } catch {
        setFeatures([])
        setPricing([])
      }
    }

    void load()
  }, [])

  return (
    <div className="landing">
      <header className="landing-nav">
        <strong>KlinikApp</strong>
        <Link className="btn" to="/login">
          Login
        </Link>
      </header>

      <section className="hero">
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
        <div className="hero-actions">
          <Link className="btn" to={hero.cta_link || '/login'}>
            {hero.cta_text || 'Masuk'}
          </Link>
        </div>
      </section>

      <section className="section-grid">
        <h2>Fitur Utama</h2>
        <div className="grid-3">
          {(features.length ? features : [
            { ...fallbackHero, id: 'f1', title: 'Antrian & Pasien', subtitle: 'Manajemen cepat', type: 'features' },
            { ...fallbackHero, id: 'f2', title: 'Pemeriksaan & Reminder', subtitle: 'Follow up otomatis', type: 'features' },
            { ...fallbackHero, id: 'f3', title: 'Keuangan & HRD', subtitle: 'Operasional terukur', type: 'features' },
          ]).map((item) => (
            <article key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>{item.subtitle || item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid">
        <h2>Pricing</h2>
        <div className="grid-3">
          {(pricing.length ? pricing : [
            { ...fallbackHero, id: 'p1', title: 'Starter', subtitle: 'Rp299k/bln', type: 'pricing' },
            { ...fallbackHero, id: 'p2', title: 'Growth', subtitle: 'Rp599k/bln', type: 'pricing' },
            { ...fallbackHero, id: 'p3', title: 'Enterprise', subtitle: 'Custom', type: 'pricing' },
          ]).map((plan) => (
            <article key={plan.id} className="card">
              <h3>{plan.title}</h3>
              <p>{plan.subtitle}</p>
              <p className="muted">{plan.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">© {new Date().getFullYear()} KlinikApp — Production ready for Cloudflare.</footer>
    </div>
  )
}
