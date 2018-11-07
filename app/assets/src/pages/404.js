import React from 'react';
import { Link } from 'dva/router';
import DocumentTitle from 'react-document-title';
import Exception from 'ant-design-pro/lib/Exception';
import {title} from './../utils/config';


export default () => (
  <DocumentTitle title={`404 - ${title}`}>
    <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
  </DocumentTitle>
);
