export interface FunnelDatum {
  name: string;
  value: number;
  color?: string;
}

export function normalizeFunnelData(raw: any): FunnelDatum[] {
  if (!raw || typeof raw !== 'object') {
    return [];
  }

  // Prioritize 'steps' as the standard format
  if (Array.isArray(raw.steps)) {
    return raw.steps.map((step: any) => ({
      name: step.name,
      value: step.value,
      color: step.color,
    }));
  }

  // Keep backwards compatibility with 'stages'
  if (Array.isArray(raw.stages)) {
    return raw.stages.map((stage: any) => ({
      name: stage.name,
      value: stage.value,
      color: stage.color,
    }));
  }

  if (Array.isArray(raw.series)) {
    return raw.series.map((item: any) => ({
      name: item.name ?? item.step ?? item.label,
      value: item.value ?? item.count ?? item.users ?? 0,
      color: item.color,
    }));
  }

  if (Array.isArray(raw.data)) {
    return raw.data;
  }

  if (Array.isArray(raw.items)) {
    const items = raw.items;
    const first = items[0];
    if (first && typeof first === 'object' && 'name' in first && 'value' in first) {
      return items;
    }
    return items.map((item: any, index: number) => ({
      name: item.name || item.event || item.label || `Step ${index + 1}`,
      value: item.value || item.users || item.count || 0,
      color: item.color,
    }));
  }

  return [];
}
