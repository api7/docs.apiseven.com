import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

import styles from './styles.module.css';

const DocVersionWrapper: React.FC<{ docsPluginId: string, type?: 'mobile' | 'desktop' }> = ({ docsPluginId, type = 'desktop' }) => {
  return (
    <div className={type === 'desktop' ? styles.sidebarVersionSwitch : styles.sidebarVersionSwitchMobile}>
      Version:
      <DocsVersionDropdownNavbarItem
        docsPluginId={docsPluginId}
        dropdownItemsBefore={[]}
        dropdownItemsAfter={[]}
        items={[]}
      />
    </div>
  );
};

export default DocVersionWrapper;
