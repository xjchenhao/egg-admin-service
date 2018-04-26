/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost:3306
 Source Schema         : eas_basis

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : 65001

 Date: 10/04/2018 14:51:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(100) DEFAULT NULL COMMENT '菜单名称',
  `url` varchar(1000) DEFAULT NULL COMMENT '菜单路径',
  `uri` varchar(1000) DEFAULT NULL,
  `iconfont` varchar(1000) DEFAULT NULL COMMENT '菜单打开方式及样式',
  `describe` varchar(500) DEFAULT NULL COMMENT '菜单描述',
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  `show` int(2) DEFAULT '1' COMMENT '是否显示，1为显示,0为隐藏',
  `parent_id` int(11) DEFAULT NULL COMMENT '父菜单ID',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of module
-- ----------------------------
BEGIN;
INSERT INTO `module` VALUES (1, '权限管理', '', 'auth', 'fa fa-universal-access ', '', 0, 1, 0, '2017-10-16 11:59:26', '2017-10-16 11:59:26');
INSERT INTO `module` VALUES (298, '功能模块管理', '/auth/modules', 'auth.module', '', '菜单管理', 10, 1, 1, '2017-08-22 16:44:12', '2017-08-22 16:44:12');
INSERT INTO `module` VALUES (300, '系统用户管理', '/auth/users', 'auth.user', '', '', 0, 1, 1, '2017-08-22 19:23:37', '2017-08-22 19:23:37');
INSERT INTO `module` VALUES (301, '用户组管理', '/auth/groups', 'auth.group', '', '角色管理', 1, 1, 1, '2017-08-22 16:44:38', '2017-08-22 16:44:38');
INSERT INTO `module` VALUES (304, '用户组管理：列表查询', '', 'auth.group.index', '', '', 1, 0, 301, '2017-08-22 16:02:48', '2017-08-22 16:02:48');
INSERT INTO `module` VALUES (305, '用户组管理：添加', '', 'auth.group.create', '', '', 1, 0, 301, '2017-08-22 16:07:10', '2017-08-22 16:07:10');
INSERT INTO `module` VALUES (306, '用户组管理：删除', '', 'auth.group.destroy', '', '', 1, 0, 301, '2017-08-22 16:07:13', '2017-08-22 16:07:13');
INSERT INTO `module` VALUES (307, '用户组管理：编辑前查询', '', 'auth.group.edit', '', '', 1, 0, 301, '2017-08-22 16:08:19', '2017-08-22 16:08:19');
INSERT INTO `module` VALUES (308, '用户组管理：编辑', '', 'auth.group.update', '', '', 1, 0, 301, '2017-08-22 19:29:27', '2017-08-22 19:29:27');
INSERT INTO `module` VALUES (311, '用户组管理：查看用户组成员', '', 'auth.group.getUser', '', '', 1, 0, 301, '2017-08-23 15:47:17', '2017-08-23 15:47:17');
INSERT INTO `module` VALUES (312, '用户组管理：修改用户组成员', '', 'auth.group.setUser', '', '', 1, 0, 301, '2017-08-23 15:47:37', '2017-08-23 15:47:37');
INSERT INTO `module` VALUES (313, '用户组管理：修改模块权限', '', 'auth.group.setModule', '', '', 1, 0, 301, '2017-08-23 15:48:09', '2017-08-23 15:48:09');
INSERT INTO `module` VALUES (314, '用户组管理：查看模块权限', '', 'auth.group.getModule', '', '', 1, 0, 301, '2017-08-23 15:48:26', '2017-08-23 15:48:26');
INSERT INTO `module` VALUES (317, '用户列表', '', 'auth.user.index', '', '', 1, 0, 300, '2017-09-11 14:55:33', '2017-09-11 14:55:33');
INSERT INTO `module` VALUES (318, '新建用户', '', 'auth.user.create', '', '', 1, 0, 300, '2017-09-11 14:55:44', '2017-09-11 14:55:44');
INSERT INTO `module` VALUES (319, '删除用户', '', 'auth.user.destroy', '', '', 1, 0, 300, '2017-09-11 14:55:54', '2017-09-11 14:55:54');
INSERT INTO `module` VALUES (320, '用户详情', '', 'auth.user.edit', '', '', 1, 0, 300, '2017-09-11 14:56:05', '2017-09-11 14:56:05');
INSERT INTO `module` VALUES (321, '修改用户详情', '', 'auth.user.update', '', '', 1, 0, 300, '2017-09-11 14:56:19', '2017-09-11 14:56:19');
INSERT INTO `module` VALUES (322, '重置密码', '', 'auth.user.setPassword', '', '', 1, 0, 300, '2017-09-11 14:56:31', '2017-09-11 14:56:31');
INSERT INTO `module` VALUES (324, '模块列表', '', 'auth.module.index', '', '', 1, 0, 298, '2017-09-13 19:53:00', '2017-09-13 19:53:00');
INSERT INTO `module` VALUES (325, '添加模块', '', 'auth.module.create', '', '', 1, 0, 298, '2017-09-13 19:53:09', '2017-09-13 19:53:09');
INSERT INTO `module` VALUES (326, '删除模块', '', 'auth.module.destroy', '', '', 1, 0, 298, '2017-09-13 19:53:20', '2017-09-13 19:53:20');
INSERT INTO `module` VALUES (327, '模块详情', '', 'auth.module.edit', '', '', 1, 0, 298, '2017-09-13 19:53:30', '2017-09-13 19:53:30');
INSERT INTO `module` VALUES (328, '修改模块详情', '', 'auth.module.update', '', '', 1, 0, 298, '2017-09-13 19:53:40', '2017-09-13 19:53:40');
INSERT INTO `module` VALUES (357, '系统级模块列表', '', 'auth.module.system', '', '', 1, 0, 298, '2017-10-24 16:42:06', '2017-10-24 16:42:06');
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(50) DEFAULT NULL COMMENT '角色名称',
  `summary` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `super` int(11) DEFAULT '0' COMMENT '父节点ID',
  `addtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '角色添加时间',
  `addip` varchar(16) DEFAULT NULL COMMENT '角色添加IP',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1092 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES (1076, 'admin', '超级管理员', 0, '2017-08-18 17:27:35', '::ffff:127.0.0.1');
COMMIT;

-- ----------------------------
-- Table structure for role_module
-- ----------------------------
DROP TABLE IF EXISTS `role_module`;
CREATE TABLE `role_module` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键,不为空',
  `module_id` int(11) DEFAULT NULL COMMENT '模块外键,不为空',
  `role_id` int(11) DEFAULT NULL COMMENT '角色外键,不为空',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7367 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_module
-- ----------------------------
BEGIN;
INSERT INTO `role_module` VALUES (7261, 1, 1076);
INSERT INTO `role_module` VALUES (7262, 298, 1076);
INSERT INTO `role_module` VALUES (7263, 300, 1076);
INSERT INTO `role_module` VALUES (7264, 301, 1076);
INSERT INTO `role_module` VALUES (7265, 304, 1076);
INSERT INTO `role_module` VALUES (7266, 305, 1076);
INSERT INTO `role_module` VALUES (7267, 306, 1076);
INSERT INTO `role_module` VALUES (7268, 307, 1076);
INSERT INTO `role_module` VALUES (7269, 308, 1076);
INSERT INTO `role_module` VALUES (7270, 311, 1076);
INSERT INTO `role_module` VALUES (7271, 312, 1076);
INSERT INTO `role_module` VALUES (7272, 313, 1076);
INSERT INTO `role_module` VALUES (7273, 314, 1076);
INSERT INTO `role_module` VALUES (7274, 317, 1076);
INSERT INTO `role_module` VALUES (7275, 318, 1076);
INSERT INTO `role_module` VALUES (7276, 319, 1076);
INSERT INTO `role_module` VALUES (7277, 320, 1076);
INSERT INTO `role_module` VALUES (7278, 321, 1076);
INSERT INTO `role_module` VALUES (7279, 322, 1076);
INSERT INTO `role_module` VALUES (7280, 324, 1076);
INSERT INTO `role_module` VALUES (7281, 325, 1076);
INSERT INTO `role_module` VALUES (7282, 326, 1076);
INSERT INTO `role_module` VALUES (7283, 327, 1076);
INSERT INTO `role_module` VALUES (7284, 328, 1076);
INSERT INTO `role_module` VALUES (7309, 357, 1076);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键,不为空',
  `name` varchar(64) DEFAULT NULL COMMENT '姓名',
  `account` varchar(64) DEFAULT NULL COMMENT '用户名',
  `password` varchar(64) DEFAULT NULL COMMENT '登录密码',
  `remark` varchar(256) DEFAULT NULL COMMENT '备注',
  `status` int(2) DEFAULT '1' COMMENT '1启用，0禁用,3 删除',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `qq` varchar(20) DEFAULT NULL COMMENT 'QQ号码',
  `sex` varchar(2) DEFAULT NULL COMMENT '性别',
  `address` varchar(256) DEFAULT NULL COMMENT '住址',
  `telephone` varchar(20) DEFAULT NULL COMMENT '联系电话',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号码',
  `email` varchar(64) DEFAULT NULL,
  `role_id` varchar(64) DEFAULT '' COMMENT '角色ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `UK_account` (`account`) USING BTREE,
  UNIQUE KEY `UK_name` (`name`) USING BTREE,
  KEY `id` (`id`) USING BTREE,
  KEY `account` (`account`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (84, '超级管理员', 'admin', 'e10adc3949ba59abbe56e057f20f883e', NULL, 1, '2017-08-17 15:02:11', '2018-04-10 14:49:06', NULL, NULL, NULL, NULL, '18711111111', 'admin@admin.com', '');
COMMIT;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键,不为空',
  `role_id` int(8) NOT NULL COMMENT '角色外键,不为空',
  `user_id` int(8) NOT NULL COMMENT '用户外键,不为空',
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1205 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES (1203, 1076, 84);
COMMIT;

-- ----------------------------
-- Function structure for getChildUserRole
-- ----------------------------
DROP FUNCTION IF EXISTS `getChildUserRole`;
delimiter ;;
CREATE DEFINER=`xjzx_test_root01`@`%` FUNCTION `getChildUserRole`(rootId INT) RETURNS varchar(1000) CHARSET utf8
BEGIN 

DECLARE sTemp VARCHAR(1000); 

DECLARE sTempChd VARCHAR(1000); 

SET sTemp = '$'; 

SET sTempChd =CAST(rootId AS CHAR); 

WHILE sTempChd IS NOT NULL DO 

SET sTemp = CONCAT(sTemp,',',sTempChd); 

SELECT GROUP_CONCAT(id) INTO sTempChd FROM back_role WHERE FIND_IN_SET(role_super,sTempChd)>0; 

END WHILE; 

RETURN sTemp; 

END;
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
