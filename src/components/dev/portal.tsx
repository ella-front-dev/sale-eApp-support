import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

export default function Portal({
  children,
  containerId = 'ds-portal'
}: {
  children: React.ReactNode;
  containerId?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const portalRoot = document.getElementById(containerId);
  if (!portalRoot) {
    return null;
  }

  return createPortal(children, portalRoot);
}
