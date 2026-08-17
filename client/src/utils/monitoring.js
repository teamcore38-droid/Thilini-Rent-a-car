const monitoringEndpoint = import.meta.env.VITE_MONITORING_ENDPOINT || '';
const monitoringEnabled =
  import.meta.env.PROD &&
  import.meta.env.VITE_ENABLE_MONITORING === 'true' &&
  Boolean(monitoringEndpoint);

const safeNumber = (value) =>
  Number.isFinite(Number(value)) ? Number(Number(value).toFixed(1)) : undefined;

const sanitizePayload = (type, payload = {}) => ({
  type,
  timestamp: new Date().toISOString(),
  route: typeof payload.route === 'string' ? payload.route.split('?')[0] : undefined,
  method: payload.method,
  statusCode: Number.isInteger(payload.statusCode) ? payload.statusCode : undefined,
  durationMs: safeNumber(payload.durationMs),
  category: payload.category,
  metric: payload.metric,
  value: safeNumber(payload.value),
  requestId: payload.requestId,
  release: import.meta.env.VITE_APP_RELEASE || undefined
});

export const reportMonitoringEvent = (type, payload = {}) => {
  if (!monitoringEnabled || typeof window === 'undefined') return;

  const body = JSON.stringify(sanitizePayload(type, payload));
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(monitoringEndpoint, new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch(monitoringEndpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    }).catch(() => {});
  } catch {
    // Monitoring must never affect the customer experience.
  }
};

const observeMetric = (entryType, handler) => {
  if (typeof PerformanceObserver === 'undefined') return;
  try {
    const observer = new PerformanceObserver((list) => handler(list.getEntries()));
    observer.observe({ type: entryType, buffered: true });
  } catch {
    // Older browsers may not support a requested entry type.
  }
};

export const initializeMonitoring = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', () => {
    reportMonitoringEvent('javascript_error', {
      route: window.location.pathname,
      category: 'window_error'
    });
  });

  window.addEventListener('unhandledrejection', () => {
    reportMonitoringEvent('javascript_error', {
      route: window.location.pathname,
      category: 'unhandled_rejection'
    });
  });

  observeMetric('largest-contentful-paint', (entries) => {
    const latest = entries.at(-1);
    if (latest) reportMonitoringEvent('web_vital', { metric: 'LCP', value: latest.startTime });
  });

  let cumulativeLayoutShift = 0;
  observeMetric('layout-shift', (entries) => {
    for (const entry of entries) {
      if (!entry.hadRecentInput) cumulativeLayoutShift += entry.value;
    }
    reportMonitoringEvent('web_vital', { metric: 'CLS', value: cumulativeLayoutShift });
  });

  observeMetric('paint', (entries) => {
    const firstContentfulPaint = entries.find((entry) => entry.name === 'first-contentful-paint');
    if (firstContentfulPaint) {
      reportMonitoringEvent('web_vital', { metric: 'FCP', value: firstContentfulPaint.startTime });
    }
  });
};

export const markRouteTransitionStart = (route) => {
  if (typeof window === 'undefined') return;
  window.__trcRouteTransition = {
    route: String(route || '').split('?')[0],
    startedAt: performance.now()
  };
};

export const reportRouteTransitionComplete = (route) => {
  if (typeof window === 'undefined') return;
  const transition = window.__trcRouteTransition;
  if (!transition || transition.route !== route) return;
  reportMonitoringEvent('route_transition', {
    route,
    durationMs: performance.now() - transition.startedAt,
    category: 'completed'
  });
  window.__trcRouteTransition = null;
};
