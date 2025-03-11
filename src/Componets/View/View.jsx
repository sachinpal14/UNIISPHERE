import React, { useState, useEffect } from 'react';
import DesktopView from '../DesktopView/DesktopView';
import MobileView from '../Mobileview/Mobileview';

function View() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileView /> : <DesktopView />;
}

export default View;