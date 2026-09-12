import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Briefcase } from '@icon-park/react'
import { motion } from 'framer-motion'
import { useSettings } from '../../SettingsContext'
import { useResultStore } from '../resultStore'
import CareerMatches from '../CareerMatches'
import CareerDetail from '../CareerDetail'
import type { CareerMatchData } from '../useResultData'

function CareersPage() {
  const { t } = useSettings()
  const { data } = useResultStore()
  const [selectedCareer, setSelectedCareer] = useState<CareerMatchData | null>(null)

  if (!data) return <Navigate to="/result" replace />

  const hasCareerSource = data.sources.includes('career')

  return (
    <div className="flex flex-col">
      {hasCareerSource ? (
        <CareerMatches
          topCareers={data.topCareers}
          allCareers={data.allCareers}
          onCareerClick={setSelectedCareer}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md rounded-2xl p-8 text-center"
          style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
        >
          <span
            className="inline-flex size-11 items-center justify-center rounded-xl text-white"
            style={{ background: 'var(--accent)' }}
          >
            <Briefcase className="size-5" strokeWidth={4.4} />
          </span>
          <p className="mx-auto mt-4 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            {t('catalog.careerTestFirst')}
          </p>
        </motion.div>
      )}

      {selectedCareer && <CareerDetail career={selectedCareer} onClose={() => setSelectedCareer(null)} />}
    </div>
  )
}

export default CareersPage