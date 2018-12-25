
import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './SiderMenuUtils';

console.log(123);
const SiderMenuWrapper = React.memo(props => {
  const { isMobile, menuData, collapsed, onCollapse } = props;
  console.log('menuData:',menuData);

  const flatMenuKeys = getFlatMenuKeys(menuData);
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu {...props} flatMenuKeys={flatMenuKeys} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
  );
});

export default SiderMenuWrapper;
