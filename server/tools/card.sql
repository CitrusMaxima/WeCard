/*
Navicat MySQL Data Transfer

Source Server         : conn
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : card

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2018-05-28 15:26:55
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `card`
-- ----------------------------
DROP TABLE IF EXISTS `card`;
CREATE TABLE `card` (
  `card_id` int(30) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL,
  `logo_url` varchar(100) NOT NULL,
  `img_url` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `org` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `mobile` varchar(100) DEFAULT NULL,
  `tel` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `adr` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `template_id` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of card
-- ----------------------------

-- ----------------------------
-- Table structure for `collect`
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect` (
  `collect_id` int(30) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL,
  `card_id` int(30) NOT NULL,
  PRIMARY KEY (`collect_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of collect
-- ----------------------------
