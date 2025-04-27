CREATE DATABASE  IF NOT EXISTS `quilltz_test_2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quilltz_test_2`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quilltz_test_2
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `idx_creation_date` (`creation_date`),
  KEY `role` (`role`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`role`) REFERENCES `user_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (21,'mohammad1@gmail.com','mohmmad','qady','$2b$12$FnaC7lFE2tJGztRvkRCyjuWsISiWcgjhiBsYhBxRbEC2QfTYTz1E.','manager','2024-06-09 17:02:28'),(22,'employee1@gmail.com','employee','emp','$2b$12$Mibc0IAfeq7zgKTKhCqzMeEDftSkGxlsCW94E8wULDKyLOH02T2gS','employee','2024-06-09 17:04:05'),(23,'client@gmail.com','client','client','$2b$12$FnaC7lFE2tJGztRvkRCyjuWsISiWcgjhiBsYhBxRbEC2QfTYTz1E.','client','2024-06-09 17:04:05'),(24,'ahmad@gmail.com','khaled','ahmad','$2b$12$FnaC7lFE2tJGztRvkRCyjuWsISiWcgjhiBsYhBxRbEC2QfTYTz1E.','employee','2024-06-09 17:04:05'),(25,'said@gmial.com','said','omar','$2b$12$FnaC7lFE2tJGztRvkRCyjuWsISiWcgjhiBsYhBxRbEC2QfTYTz1E.','employee','2024-06-09 17:04:05'),(26,'khaled@gmail.com','khaled','omar','$2b$12$rTvUsm14SYGrZsdBIDH11OjLCLBXeT1U0t8QF1dFU8xIWvvoQRsRm','employee','2024-06-09 19:19:30'),(27,'omar@gmail.com','omar','qady','$2b$12$HFhQteGd1Ur70YAyaYa2.OK.146WHs0ZNUPTqlHmnW2HdJZxyqxOG','employee','2024-06-09 19:19:30'),(28,'ahamd@gmail.com','ahamd','mohammad','$2b$12$j5OqIRE/6Mh0FkUeb5WGJ.Rl/S5xY.lEUYUIgwtyY5kv9wf31cb0W','client','2024-06-09 19:19:30'),(29,'kk@gmail.com','khaled','qady','$2b$12$9SirYvyFuUybyeuzCoOmheK8ii61mGwHCWiBfV.YpsaNExJaRIdte','client','2024-06-09 20:46:43'),(30,'mohammad123@gmail.com','Mohammad','Qady12','$2b$12$th8pfGcX0DBG81Xrr3Dxs.Xzz/5vz/knHQdi.Gqu/lPTUF10EkO3G','employee','2024-06-09 20:46:43'),(51,'singhrichard@example.net','Paul','Owens','$2b$12$oqv.YJAgUJRRlzBR7EHjHuMmuj5iMUf4qIkSsNzgEK44c5R.BCaau','employee','2023-07-09 05:21:35'),(52,'gallowayjonathan@example.org','Brandon','Anderson','$2b$12$mKHgNOccknDXS4mZK790temEDq0bl9s0gZjLz9azOhZ4KNsTFGS1a','client','2023-10-30 23:33:48'),(53,'judygonzalez@example.com','William','Robinson','$2b$12$oLav4LdWfEQG9nS.AfvvvuB6lPmp3cRqcEn6avkTpPIqKYolSNQIm','client','2023-03-04 05:49:25'),(54,'martin01@example.com','David','Hansen','$2b$12$SK1xETh8Fb2SweCX.35T..iyZtOl3wnACKgkEkeLLoH4Ol.aqTgDy','client','2022-06-15 23:50:23'),(55,'mortiz@example.com','Joshua','Hawkins','$2b$12$SLHyH60JIY10/FkYhEI1g.ywMBW1MRX/UUqswj6eyh3txJ.r56KIG','employee','2023-04-09 07:57:46'),(56,'jennamahoney@example.net','Debra','Huerta','$2b$12$ELThNRAxsfO4ygH5BszLwORHq9secDsHH7sGCqmbc4Iqqe8MXKMUm','client','2020-07-10 13:15:27'),(57,'alleneric@example.net','Christopher','Mcintosh','$2b$12$BELzwpk9kcavJ0JnMy9Fuu622pZFBFCR1ujo6POrOocNM9ikThNMG','client','2022-04-09 21:37:11'),(58,'igreene@example.net','Maria','Christian','$2b$12$Uw8wk6lhd1CJSjz.MgaiI.uTp7DnkZAWaX9AtFjtaq.6SkRm.2pmK','client','2020-11-18 11:37:01'),(59,'mendozacarrie@example.com','Mary','Herring','$2b$12$KLxAjK1/H.ftd7R9LT.xuOcDZw580RzAwM9cBRpB2Q1.51Pn4EF5i','client','2021-11-07 09:34:23'),(60,'jaredrobles@example.net','Tara','Chen','$2b$12$bc1aKnSOK5Nvfny1bPF3K.RDLXk4Hzm/QWwNxekc4xdLq4hyWpI9a','client','2023-08-13 14:33:15'),(71,'leebianca@example.com','Oscar','Reyes','$2b$12$1aGJDfvcS3WwKSDSt3H0HeMpb4B6DULvD6TwMkhzlXnbbgjrFfqAy','client','2023-06-18 11:34:31'),(72,'kevin86@example.org','Samantha','Oneill','$2b$12$sXmhcO7GdT2puoaoQb9t7.MXmRZpZlrrWfbYzIz7yWMOYxGR7sXh.','employee','2020-07-29 06:00:07'),(73,'jacksonbilly@example.net','John','Martinez','$2b$12$GAgnR1I5k.AQ7Pzhl6N4I.E/pJasi2FQSeCGuitsCafCEwiZqd.B6','client','2022-09-18 17:10:57'),(74,'fisherjonathan@example.net','Harold','Mclaughlin','$2b$12$QvehaPwJ8cP8dCGz5QAkDuRWxgQt2wkSsppX5DAycwscdJg2MDerS','client','2021-04-18 10:34:23'),(75,'tuckerrebecca@example.net','Emily','Baldwin','$2b$12$EviVOLSXmn/5GbLeewysveB1k9SUKmZL2wXsDZ3M5eK7lvt2ppNUq','client','2023-03-13 16:07:29'),(76,'ysnyder@example.net','Sue','Dorsey','$2b$12$9JNm/.wUk1nweHwTZoX91ugoEmqTzegfLHvVj8bISH2vQhrR6PKfK','client','2021-01-23 20:20:54'),(77,'coledonald@example.net','Dalton','Mitchell','$2b$12$mwWWz5UOOm14hVcOg6Izmeb4xR9phi7HJI62zv34b7RLY5n4mWTEq','client','2023-04-22 17:18:40'),(78,'evargas@example.net','Kimberly','Cunningham','$2b$12$Tmn5kbOsGFc27un5AjfmxOseHcxrtmKyMx0XC8v9w2lkUNcFyByqe','employee','2021-07-02 08:07:37'),(79,'danielbryant@example.net','Rhonda','Ochoa','$2b$12$iI9icQcuZVOtdOw0SkI98Oa2aPBNombh.Z2L9k0ZCdjbvyFbJUbTy','client','2023-08-10 21:02:14'),(80,'robertstone@example.net','Paul','Hogan','$2b$12$Ub1Fj/d3h8E5y0TG6.OO2uGC57L7wvS30sLBi4WRaKeAH0fb48Jgq','employee','2022-08-06 07:11:47'),(88,'emp2@gmail.com','emp','emp2','$2b$12$1YwAtVHUv9eb8oJhM5HrVe88rLWMAgNqTd4GIFE.7NlDvmYsRySFa','employee','2024-06-11 22:03:41'),(89,'qady@gmail.com','qady','qady','$2b$12$k3KeBRNi/jxlt.maEpIt7OYDFe8cUkCFQ/C/S4slRwIte00xi0rny','employee','2024-06-11 22:03:41'),(90,'ahmad3@gmail.com','ahmad','qady','$2b$12$N4rgGTzPJMuCd1Gl3Di08erP2gElmbQDLo59tSZZQ/jVLkVW8fu.y','employee','2024-06-11 22:03:41'),(91,'qq@gmail.com','hamad','qa','$2b$12$.OVTdnI/zYFTr8obFqUEUeMICW7DkMIpDi3ymhjYkv/ucwpS2sSRG','employee','2024-06-11 22:03:41'),(92,'123@gmail.com','312','321','$2b$12$41D6jJR5SwvrxC9hv6K/zuETg1tmInukovKL5By1wmBt62dRhA34i','employee','2024-06-11 22:03:41'),(93,'kjf@gmail.com','kasdjf','lkj','$2b$12$fqWbXdAHAMhZobjGLruUU.pVf0SaHjssOUZU6anuZa6zzLw.XkVGm','employee','2024-06-11 22:03:41'),(94,'jubran@gmail.com','jubran','khalel','$2b$12$8H5xZB6dTiaDjJtVr9xxH.KHAt4sABBXt.LE.8O8J3wPqsT3g06ua','client','2024-06-12 20:46:23'),(95,'mohmmad@gmail.com','asdfasdf','sadfasdfas','$2b$12$pkRU5dWIyLpgjiuafcbzHefZlfR1/siTup15dM2nAQrb7MxGkT4GW','client','2024-06-18 18:05:24'),(96,'asdfasf@gmail.com','adfadf','adfasdf','$2b$12$Wdr1R/.jnxpkhsgFopVMmuhspMbF7IYHh.dxAawyyhWECDvkSCMW6','client','2024-06-24 18:35:47');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-24 21:17:56
