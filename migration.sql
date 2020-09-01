CREATE DATABASE IF NOT EXISTS `wix-bookings-list` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `wix-bookings-list`;

CREATE TABLE `appInstances` (
  `id` int(11) NOT NULL,
  `instanceId` varchar(200) NOT NULL,
  `refreshToken` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `appInstances`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `appInstances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;