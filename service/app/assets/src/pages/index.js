// import Link from 'umi/link';
import DocumentTitle from 'react-document-title';
import {title} from './../utils/config';

export default () =>
  <DocumentTitle title={title}>
    <div>欢迎访问后台管理系统</div>
  </DocumentTitle>