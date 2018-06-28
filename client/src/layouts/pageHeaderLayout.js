import React from 'react';
import { Link } from 'dva/router';
import DocumentTitle from 'react-document-title';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import styles from './pageHeaderLayout.less';
import {title} from './../utils/config';

export default ({ children, wrapperClassName, top, ...restProps }) => {

  // const breadcrumb = this.conversionBreadcrumbList()

  return (
    <DocumentTitle title={`${restProps.title} - ${title}`}>
      <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
        {top}
        <PageHeader key="pageheader" {...restProps} linkElement={Link} />
        {children ? <div className={styles.content}>{children}</div> : null}
      </div>
    </DocumentTitle>
  )
};