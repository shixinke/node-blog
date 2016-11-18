-- MySQL dump 10.13  Distrib 5.6.30, for Linux (x86_64)
--
-- Host: localhost    Database: nodeblog
-- ------------------------------------------------------
-- Server version	5.6.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_attachments`
--

DROP TABLE IF EXISTS `blog_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_attachments` (
  `id` int(11) NOT NULL,
  `posts_id` int(11) NOT NULL DEFAULT '0' COMMENT '文章ID',
  `filetype` enum('VIDEO','AUDIO','FILE','IMAGE') DEFAULT 'IMAGE' COMMENT '文件类型',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '文件说明',
  `url` varchar(200) NOT NULL COMMENT '文件地址',
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_attachments`
--

LOCK TABLES `blog_attachments` WRITE;
/*!40000 ALTER TABLE `blog_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_category`
--

DROP TABLE IF EXISTS `blog_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_category` (
  `category_id` int(11) NOT NULL,
  `pid` int(11) NOT NULL DEFAULT '0',
  `category_name` varchar(50) NOT NULL COMMENT '分类名称',
  `category_alias` varchar(50) NOT NULL COMMENT '分类别名',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '分类标题名称',
  `keywords` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '' COMMENT '描述',
  `icon` varchar(50) DEFAULT NULL COMMENT '小图标',
  `visible` tinyint(4) DEFAULT '0' COMMENT '是否在菜单中显示',
  `status` enum('DISABLED','ENABLE') DEFAULT 'DISABLED',
  `items` int(10) DEFAULT NULL COMMENT '文章数',
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_category`
--

LOCK TABLES `blog_category` WRITE;
/*!40000 ALTER TABLE `blog_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_config`
--

DROP TABLE IF EXISTS `blog_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_config` (
  `key` varchar(20) NOT NULL COMMENT '配置项键',
  `group` varchar(20) NOT NULL DEFAULT 'SYSTEM' COMMENT '分组',
  `value` varchar(1000) NOT NULL DEFAULT '' COMMENT '配置项值',
  `title` varchar(20) NOT NULL COMMENT '配置项名称',
  `datatype` enum('JSON','FLOAT','INT','STRING') NOT NULL DEFAULT 'STRING' COMMENT '配置项值的类型',
  PRIMARY KEY (`key`),
  KEY `idx_grp` (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_config`
--

LOCK TABLES `blog_config` WRITE;
/*!40000 ALTER TABLE `blog_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_links`
--

DROP TABLE IF EXISTS `blog_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_links` (
  `id` int(11) NOT NULL,
  `group` varchar(20) NOT NULL DEFAULT 'LINK' COMMENT '链接分组',
  `title` varchar(20) NOT NULL COMMENT '显示名称',
  `website` varchar(30) NOT NULL COMMENT '网站名称',
  `url` varchar(100) NOT NULL DEFAULT '' COMMENT '链接 地址',
  `logo` varchar(100) NOT NULL DEFAULT '' COMMENT 'logo',
  `display` enum('TEXT','LOGO') DEFAULT 'TEXT' COMMENT '显示类型',
  `status` enum('DISABLED','CHECKED','UNCHECKED') DEFAULT 'UNCHECKED' COMMENT '状态',
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='友情链接表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_links`
--

LOCK TABLES `blog_links` WRITE;
/*!40000 ALTER TABLE `blog_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `posts_id` int(11) NOT NULL COMMENT '文章ID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT '分类ID',
  `type` enum('POSTS','PAGES') NOT NULL DEFAULT 'POSTS' COMMENT '文章类型：单页或博客文章',
  `title` varchar(200) NOT NULL COMMENT '文章标题',
  `alias` varchar(100) NOT NULL DEFAULT '' COMMENT '文章别名',
  `keywords` varchar(100) NOT NULL DEFAULT '' COMMENT '关键词',
  `description` varchar(200) NOT NULL DEFAULT '' COMMENT '描述',
  `summary` varchar(200) NOT NULL DEFAULT '' COMMENT '概述',
  `cover` varchar(200) NOT NULL DEFAULT '' COMMENT '封面',
  `content` text NOT NULL,
  `uid` int(11) NOT NULL,
  `tags` varchar(100) NOT NULL DEFAULT '' COMMENT '标签列表(冗余字段)',
  `views` int(11) NOT NULL DEFAULT '0',
  `comments` int(11) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`posts_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_tag_relation`
--

DROP TABLE IF EXISTS `blog_tag_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_tag_relation` (
  `tag_id` int(11) NOT NULL COMMENT '标签ID',
  `posts_id` int(11) NOT NULL COMMENT '文章ID',
  PRIMARY KEY (`tag_id`,`posts_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签与文章关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_tag_relation`
--

LOCK TABLES `blog_tag_relation` WRITE;
/*!40000 ALTER TABLE `blog_tag_relation` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_tag_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_tags`
--

DROP TABLE IF EXISTS `blog_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(20) NOT NULL COMMENT '标签名称',
  `tag_alias` varchar(20) DEFAULT NULL COMMENT '标签别名',
  `items` int(11) DEFAULT NULL COMMENT '文章数',
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `idx_tag_name` (`tag_name`),
  KEY `idx_tag_alias` (`tag_alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_tags`
--

LOCK TABLES `blog_tags` WRITE;
/*!40000 ALTER TABLE `blog_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_user`
--

DROP TABLE IF EXISTS `blog_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `account` char(20) NOT NULL COMMENT '账号',
  `password` char(32) NOT NULL COMMENT '密码',
  `email` varchar(30) NOT NULL COMMENT '邮箱',
  `nickname` varchar(30) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` varchar(200) NOT NULL DEFAULT '' COMMENT '头像',
  `status` enum('ENABLE','DISABLED','UNCHECKED','LOCKED') NOT NULL DEFAULT 'UNCHECKED' COMMENT '状态',
  `last_login_time` timestamp NULL DEFAULT NULL COMMENT '上次登录时间',
  `last_login_ip` char(16) DEFAULT NULL,
  `create_time` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `idx_account` (`account`),
  KEY `idx_nickname` (`nickname`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_user`
--

LOCK TABLES `blog_user` WRITE;
/*!40000 ALTER TABLE `blog_user` DISABLE KEYS */;
INSERT INTO `blog_user` VALUES (1,'shixinke','c9e3701293713ff56d05f3fdcb3aad64','ishixinke@qq.com','shixinke','/static/img/contact-img2.png','ENABLE',NULL,NULL,'2016-11-18 10:30:09'),(2,'withec','d7e413d7968183af0fa04a9a8b726f1b','withec@sina.com','微滋12','/static/img/contact-img2.png','ENABLE',NULL,NULL,'2016-11-17 13:18:19');
/*!40000 ALTER TABLE `blog_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-18 18:33:15
