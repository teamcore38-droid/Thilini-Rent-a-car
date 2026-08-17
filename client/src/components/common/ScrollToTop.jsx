import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { reportRouteTransitionComplete } from '../../utils/monitoring';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    reportRouteTransitionComplete(pathname);
  }, [pathname]);

  return null;
};
