import React from 'react';
import { Link } from 'dva/router';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import styles from './pageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => {

  // 修改浏览器tabs上的title
  if(restProps.title){
    document.title = restProps.title; 
  }

  // const breadcrumb = this.conversionBreadcrumbList();

  return (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
)
};