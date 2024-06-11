-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: high-street-gym-db
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(45) NOT NULL,
  `activity_description` varchar(400) NOT NULL,
  `activity_duration` varchar(50) NOT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,'yoga','an ancient practice that incorporates gentle exercise, breath control and meditation','90 minutes'),(2,'pilate','Focuses on core strength, flexibility, and overall body conditioning. .','90 minutes'),(3,'intense training','High-Intensity Interval Training combines short bursts of intense exercise..','75 minutes'),(4,'kickboxing',' Combines elements of boxing, martial arts, and aerobics.','60 minutes'),(5,'boxing',' Focuses on boxing techniques, strength training, and cardio. Provides a full-body workout while improving coordination and endurance.','60 minutes'),(6,'Cycling',' High-intensity cardio workout performed on stationary bikes.','60 minutes');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog` (
  `blog_id` int unsigned NOT NULL AUTO_INCREMENT,
  `blog_post` varchar(800) NOT NULL,
  `user_id` int NOT NULL,
  `blog_title` varchar(45) NOT NULL,
  `blog_date` date NOT NULL,
  `blog_removed` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`blog_id`),
  KEY `fk_blog_user_idx` (`user_id`),
  CONSTRAINT `fk_blog_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (23,'Hello man man man',1,'Hello','2006-03-17',1),(27,'test',23,'test','2024-05-24',1),(34,'Top 5 yoga tips and tricks',27,'Yoga tips and trick','2024-06-07',1),(35,'i believe that pilate is very helpful towards the comunity ',27,'Pilates way to victory','2024-06-03',0),(36,'dadsaddsadsad',25,'hello','2024-06-05',0),(37,'Thingy',27,'Gay','2024-06-06',1),(38,'djasjadjsdiasodjisadksmlamndsknadjkasjdsajkdasjkdhasjkdhasjkhdksahdkjsahdksahdksahdhsakjdhasjkdhadhasjkdhasjkdhasjkdhasjkdhasjkdhaskjdhasjkdhasjkdhasjkdhasjkdhkasjhdajkdhasjkdhasjkhdjaskhas',27,'chunnnn','2024-06-07',0),(39,'testing yoga pilya ashgrove etc aaaahhhhh',27,'hello','2024-06-07',0);
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `booking_datetime` datetime NOT NULL,
  `user_id` int NOT NULL,
  `class_id` int NOT NULL,
  `booking_removed` tinyint NOT NULL DEFAULT '0',
  `booking_status` enum('pending','cancelled','successful') NOT NULL,
  PRIMARY KEY (`booking_id`),
  KEY `fk_booking_user_id_idx` (`user_id`),
  KEY `fk_booking_class_idx` (`class_id`),
  CONSTRAINT `fk_booking_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,'2024-06-06 14:22:58',27,3,1,'successful'),(2,'2024-06-06 14:29:06',27,1,1,'pending'),(3,'2024-06-07 09:47:22',27,7,0,'successful'),(4,'2024-06-07 19:08:52',27,3,0,'cancelled'),(5,'2024-06-08 12:19:42',33,12,1,'pending'),(6,'2024-06-08 14:24:45',25,1,0,'pending'),(7,'2024-06-08 17:29:18',27,1,0,'pending'),(8,'2024-06-09 01:16:46',33,12,0,'pending');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `location_id` int NOT NULL,
  `class_trainer_user_id` int NOT NULL,
  `class_removed` tinyint NOT NULL DEFAULT '0',
  `class_date` date NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `fk_activity_class_idx` (`activity_id`),
  KEY `fk_location_class_idx` (`location_id`),
  KEY `fk_user_class_idx` (`class_trainer_user_id`),
  CONSTRAINT `fk_activity_class` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`activity_id`),
  CONSTRAINT `fk_location_class` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`),
  CONSTRAINT `fk_user_class` FOREIGN KEY (`class_trainer_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES (1,1,2,1,0,'2024-06-16'),(2,3,4,1,1,'2024-06-26'),(3,2,2,25,0,'2024-06-27'),(4,1,1,1,0,'2024-06-27'),(5,4,5,25,1,'2024-06-29'),(6,5,5,1,0,'2024-06-09'),(7,6,5,32,0,'2024-06-09'),(8,5,4,29,0,'2024-06-12'),(9,6,2,25,0,'2024-06-13'),(10,2,2,25,0,'2024-06-14'),(11,1,5,29,0,'2024-06-16'),(12,5,1,32,0,'2024-06-17'),(13,1,2,32,0,'2024-06-17');
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(65) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Ashgrove'),(2,'Brisbane City'),(3,'Chermside'),(4,'Graceville'),(5,'Westlake');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_first_name` varchar(45) NOT NULL,
  `user_last_name` varchar(45) NOT NULL,
  `user_phone` varchar(45) NOT NULL,
  `user_username` varchar(45) NOT NULL,
  `user_roles` enum('member','trainer','admin') NOT NULL,
  `user_removed` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_username_UNIQUE` (`user_username`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johndoe@example.com','$2a$10$Pl.U2MYF/6kBDennGJD/WuoYf6IC6enBi.YrSACtm9ynF6Q.1Qg/i','John','doe','1234567890','Johns','trainer',0),(23,'john@gmail.com','$2a$10$TpjAI/v5/vfPuL/0FZQ15OoEhhOomjdhq6baTZBqAFtBLSApVNgxG','john','willam','3198319190','john','member',0),(24,'fedrigo@rela.com','$2a$10$TaTFvcsryBOijunFHHCoyeUi1/AOLCTAgd9kX/aMSExkuePL5ZS3q','Fedrigo','Wijaya','0404504931','figo','admin',1),(25,'sien@email.com','$2a$10$ljOSoDf/BihPpmzdFmS/IO9p0aFmpNvOWtWMUJiigL1YMAhkhIh7m','Sien','Thai','3818318931','Sien','trainer',0),(27,'figokk@gmail.com','$2a$10$exdFwWzwk9twTKEsuRJo9.AjTWeqTDXbnhTfyEnSLp8Bn4NTjmjVy','Fedrigo','Wijaya','0199193131','figoS','admin',1),(28,'sitipol123@gmail.com','$2a$10$SaJkY9Pjkgxs7GTwC22/L.uwMuSQNlMmdBaXVKpfjOncWiQzDk5Ka','tk','klancy','1313891831','sitipol','member',1),(29,'pocoyonub.id@gmail.com','$2a$10$1zJb4q6IXTp1HUjpXfZ4ZO89M.NC1uViFe4AqQs50hcQZActU2oCm','Emerald','Drive','0404504931','FIgoooo','trainer',1),(31,'pocoyonub.id@gmail.com','$2a$10$GGZerNB/CEABF0h89PiXf.r64PH.b4SwCu5m/Y1LfwVJxEjC1KcIW','Emerald','Drive','0404504931','figu','admin',0),(32,'willam@edu.au','$2a$10$7MOXXxMzVj4s9elUjFahTuLee5tA8aXYjxcTJrnbdJ10lb9g9OlkW','Willam','Doe','0412345678','Willam','trainer',0),(33,'jasper@tafe.edu.au','$2a$10$ftKOqQWj/nY/sKs4HSGVIubsgSONdwuGwr9xE6076RN0DvOuY4cAG','jasper','rutherford','0404040404','jasper','member',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-09 14:29:21
