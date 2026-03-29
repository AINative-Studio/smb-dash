'use client';

import { useState } from 'react';
import { AgingTable } from '@/components/tables/AgingTable';
import { useBreakdowns } from '@/hooks/useBreakdowns';
import { KPICardGrid } from '@/components/kpi-cards/KPICardGrid';
import type { KPIMetric } from '@/lib/types/kpi';
import type { BalanceType } from '@/lib/types/aging';

const DEFAULT_ORG = 'org-001-acme';

const AR_AP_METRICS: KPIMetric[] = [
  { metric_name: 'ar_balance', metric_value: 78500, metric_unit: 'currency', period_id: 'p1', delta_percent: 9.0, delta_absolute: 6500, comparison_type: 'previous_month' },
  { metric_name: 'ap_balance', metric_value: 34200, metric_unit: 'currency', period_id: 'p1', delta_percent: -10.2, delta_absolute: -3900, comparison_type: 'previous_month' },
  { metric_name: 'dso', metric_value: 34, metric_unit: 'days', period_id: 'p1', delta_percent: 5.1, delta_absolute: 2, comparison_type: 'previous_month' },
  { metric_name: 'dpo', metric_value: 28, metric_unit: 'days', period_id: 'p1', delta_percent: -7.3, delta_absolute: -2, comparison_type: 'previous_month' },
];

export default function ARAPDashboard() {
  const [activeTab, setActiveTab] = useState<BalanceType>('ar');
  const { data: agingData, isLoading } = useBreakdowns(DEFAULT_ORG, 'aging', { balanceType: activeTab });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">AR / AP Dashboard</h1>

      <KPICardGrid metrics={AR_AP_METRICS} />

      <div className="mt-8">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('ar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ar' ? 'bg-[#4B6FED] text-white' : 'bg-[#161B22] text-gray-400 hover:text-white'
            }`}
          >
            Accounts Receivable
          </button>
          <button
            onClick={() => setActiveTab('ap')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ap' ? 'bg-[#4B6FED] text-white' : 'bg-[#161B22] text-gray-400 hover:text-white'
            }`}
          >
            Accounts Payable
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse rounded-xl border border-[#2D333B] bg-[#161B22] h-48" />
        ) : (
          <AgingTable rows={agingData} balanceType={activeTab} />
        )}
      </div>
    </div>
  );
}
