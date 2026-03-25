'use client';

import { useEffect } from 'react';

import { GtmIframe } from 'sales-frontend-components';
import { loadGtmScript } from 'sales-frontend-utils';

export function DspGtmIframe() {
  useEffect(() => {
    loadGtmScript();
  }, []);

  return <GtmIframe />;
}
