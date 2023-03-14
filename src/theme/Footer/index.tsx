import React from 'react';

import {useThemeConfig} from '@docusaurus/theme-common';
import CustomFooter from '../../components/CustomFooter';

function Footer(): JSX.Element | null {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }

  return (
    <CustomFooter />
  );
}

export default React.memo(Footer);
