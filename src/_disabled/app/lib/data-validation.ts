// Data validation and sanitization utilities

/**
 * Type guard utilities for runtime type checking
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

/**
 * Safe data extraction with defaults
 */
export function safeGet<T>(
  obj: unknown,
  path: string,
  defaultValue: T
): T {
  try {
    if (!isObject(obj)) return defaultValue;
    
    const keys = path.split('.');
    let current: any = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Validate widget data structure
 */
export interface WidgetDataValidation {
  isValid: boolean;
  errors: string[];
  sanitizedData: any;
}

export function validateWidgetData(data: unknown, widgetType: string): WidgetDataValidation {
  const errors: string[] = [];
  let sanitizedData: any = {};

  if (!isObject(data)) {
    errors.push('Widget data must be an object');
    return { isValid: false, errors, sanitizedData: {} };
  }

  switch (widgetType) {
    case 'number-card':
      sanitizedData = validateNumberCardData(data, errors);
      break;
    case 'line-chart':
    case 'bar-chart':
      sanitizedData = validateChartData(data, errors);
      break;
    case 'pie-chart':
      sanitizedData = validatePieChartData(data, errors);
      break;
    case 'funnel':
      sanitizedData = validateFunnelChartData(data, errors);
      break;
    case 'data-table':
      sanitizedData = validateTableData(data, errors);
      break;
    default:
      sanitizedData = data;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

function validateNumberCardData(data: Record<string, unknown>, errors: string[]) {
  const sanitized: any = {};
  
  // Validate value
  const value = data.value;
  if (isNumber(value)) {
    sanitized.value = value;
  } else if (isString(value)) {
    sanitized.value = value;
  } else {
    errors.push('Number card value must be a number or string');
    sanitized.value = 0;
  }
  
  // Validate change (optional)
  const change = data.change;
  if (change !== undefined) {
    if (isNumber(change)) {
      sanitized.change = change;
    } else {
      errors.push('Number card change must be a number');
    }
  }
  
  // Validate isPositive (optional)
  const isPositive = data.isPositive;
  if (isPositive !== undefined) {
    sanitized.isPositive = Boolean(isPositive);
  }
  
  // Validate format (optional)
  const format = data.format;
  if (format !== undefined) {
    if (isString(format) && ['number', 'percentage', 'currency'].includes(format)) {
      sanitized.format = format;
    } else {
      errors.push('Number card format must be one of: number, percentage, currency');
    }
  }
  
  return sanitized;
}

function validateChartData(data: Record<string, unknown>, errors: string[]) {
  const sanitized: any = {};
  
  const series = data.series;
  if (isArray(series)) {
    sanitized.series = series.filter((item) => {
      if (!isObject(item)) return false;
      const name = safeGet(item, 'name', '');
      const value = safeGet(item, 'value', 0);
      return isString(name) && isNumber(value);
    }).map((item: any) => ({
      name: String(item.name),
      value: Number(item.value),
    }));
    
    if (sanitized.series.length === 0) {
      errors.push('Chart must have at least one valid data point');
      sanitized.series = [{ name: 'No data', value: 0 }];
    }
  } else {
    errors.push('Chart data must contain a series array');
    sanitized.series = [{ name: 'No data', value: 0 }];
  }
  
  return sanitized;
}

function validatePieChartData(data: Record<string, unknown>, errors: string[]) {
  // Pie chart uses same structure as other charts
  return validateChartData(data, errors);
}

function validateFunnelChartData(data: Record<string, unknown>, errors: string[]) {
  const sanitized: any = {};
  
  // Check for steps first (preferred format)
  const steps = data.steps;
  const stages = data.stages;
  const series = data.series;
  const items = data.items;
  const dataArray = data.data;
  
  let funnelArray: any[] | null = null;
  let arrayKey = '';
  
  if (isArray(steps)) {
    funnelArray = steps;
    arrayKey = 'steps';
  } else if (isArray(stages)) {
    funnelArray = stages;
    arrayKey = 'stages';
  } else if (isArray(series)) {
    funnelArray = series;
    arrayKey = 'series';
  } else if (isArray(dataArray)) {
    funnelArray = dataArray;
    arrayKey = 'data';
  } else if (isArray(items)) {
    funnelArray = items;
    arrayKey = 'items';
  }
  
  if (funnelArray) {
    const validatedArray = funnelArray.filter((item) => {
      if (!isObject(item)) return false;
      const name = safeGet(item, 'name', '');
      const value = safeGet(item, 'value', 0);
      return isString(name) && isNumber(value);
    }).map((item: any) => ({
      name: String(item.name),
      value: Number(item.value),
      // Preserve color if it exists
      ...(item.color && { color: String(item.color) }),
    }));
    
    if (validatedArray.length === 0) {
      errors.push('Funnel must have at least one valid stage');
      sanitized[arrayKey] = [{ name: 'No data', value: 0 }];
    } else {
      sanitized[arrayKey] = validatedArray;
    }
  } else {
    errors.push('Funnel data must contain a steps, stages, series, data, or items array');
    sanitized.steps = [{ name: 'No data', value: 0 }];
  }
  
  return sanitized;
}

function validateTableData(data: Record<string, unknown>, errors: string[]) {
  const sanitized: any = {};
  
  const items = data.items;
  if (isArray(items)) {
    sanitized.items = items.filter(isObject).map((item) => {
      const sanitizedItem: Record<string, unknown> = {};
      
      // Sanitize each property in the item
      for (const [key, value] of Object.entries(item)) {
        if (isString(key)) {
          sanitizedItem[key] = sanitizeTableCell(value);
        }
      }
      
      return sanitizedItem;
    });
    
    if (sanitized.items.length === 0) {
      errors.push('Table must have at least one valid row');
      sanitized.items = [{ message: 'No data available' }];
    }
  } else {
    errors.push('Table data must contain an items array');
    sanitized.items = [{ message: 'No data available' }];
  }
  
  return sanitized;
}

function sanitizeTableCell(value: unknown): unknown {
  if (isString(value)) {
    // Basic XSS prevention - strip HTML tags
    return value.replace(/<[^>]*>/g, '').trim();
  }
  
  if (isNumber(value)) {
    return value;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (value === null || value === undefined) {
    return '';
  }
  
  // Convert other types to string
  return String(value);
}

/**
 * Sanitize user input strings
 */
export function sanitizeString(input: unknown): string {
  if (!isString(input)) {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .trim();
}

/**
 * Validate and sanitize dashboard title
 */
export function validateDashboardTitle(title: unknown): {
  isValid: boolean;
  sanitizedTitle: string;
  error?: string;
} {
  if (!isString(title)) {
    return {
      isValid: false,
      sanitizedTitle: 'Untitled Dashboard',
      error: 'Title must be a string',
    };
  }
  
  const sanitized = sanitizeString(title);
  
  if (sanitized.length === 0) {
    return {
      isValid: false,
      sanitizedTitle: 'Untitled Dashboard',
      error: 'Title cannot be empty',
    };
  }
  
  if (sanitized.length > 100) {
    return {
      isValid: false,
      sanitizedTitle: sanitized.substring(0, 100),
      error: 'Title must be less than 100 characters',
    };
  }
  
  return {
    isValid: true,
    sanitizedTitle: sanitized,
  };
}

/**
 * Create a safe fallback for missing or invalid data
 */
export function createSafeFallback<T>(
  value: unknown,
  fallback: T,
  validator: (val: unknown) => val is T
): T {
  return validator(value) ? value : fallback;
}