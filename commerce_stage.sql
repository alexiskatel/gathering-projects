-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 23 sep. 2023 à 12:15
-- Version du serveur : 10.4.24-MariaDB
-- Version de PHP : 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `commerce_stage`
--

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

CREATE TABLE `panier` (
  `idPanier` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `date` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`idPanier`, `idUser`, `date`) VALUES
(42, 2, '30/06/2023 à 18:11:04'),
(43, 2, '30/06/2023 à 18:12:51'),
(44, 3, '03/07/2023 à 09:32:05'),
(45, 3, '03/07/2023 à 09:38:14');

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `idProduit` int(11) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `prix` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`idProduit`, `nom`, `prix`) VALUES
(1, 'Caméra', '12.99'),
(2, 'Ecran 25 pouces', '10.99'),
(3, 'Manette', '15.99'),
(4, 'Ecran 16 pouces', '12'),
(5, 'Bocal', '9'),
(6, 'Casque', '15'),
(7, 'Micro', '16.45'),
(8, 'HUAWEI', '110\r\n'),
(9, 'IPHONE ', '120.34'),
(10, 'SAMSUNG', '130'),
(11, 'Montre', '20'),
(12, 'SAMSUNG S9', '135'),
(13, 'Pack informatique', '200');

-- --------------------------------------------------------

--
-- Structure de la table `produit_panier`
--

CREATE TABLE `produit_panier` (
  `idProPan` int(11) NOT NULL,
  `idPanier` int(11) NOT NULL,
  `idProduit` int(11) NOT NULL,
  `quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `produit_panier`
--

INSERT INTO `produit_panier` (`idProPan`, `idPanier`, `idProduit`, `quantite`) VALUES
(87, 42, 13, 2),
(88, 42, 5, 2),
(89, 42, 6, 2),
(90, 43, 3, 2),
(91, 43, 4, 1),
(92, 43, 1, 1),
(93, 44, 1, 4),
(94, 44, 2, 1),
(95, 45, 3, 4),
(96, 45, 2, 2),
(97, 45, 1, 2),
(98, 45, 4, 3);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `idUser` int(11) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `prenom` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `secretCode` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`idUser`, `nom`, `prenom`, `email`, `secretCode`) VALUES
(1, 'admin', 'admin', 'admin@admin.com', 'admin'),
(2, 'AKODJENOU ', 'Carlos', 'herve@gmail.com', 'carlos'),
(3, 'hervé', 'carlos', 'her@gmail.com', 'carlos');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`idPanier`),
  ADD KEY `idUser` (`idUser`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`idProduit`);

--
-- Index pour la table `produit_panier`
--
ALTER TABLE `produit_panier`
  ADD PRIMARY KEY (`idProPan`),
  ADD KEY `idPanier` (`idPanier`),
  ADD KEY `idProduit` (`idProduit`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `panier`
--
ALTER TABLE `panier`
  MODIFY `idPanier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `idProduit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `produit_panier`
--
ALTER TABLE `produit_panier`
  MODIFY `idProPan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`) ON DELETE CASCADE;

--
-- Contraintes pour la table `produit_panier`
--
ALTER TABLE `produit_panier`
  ADD CONSTRAINT `produit_panier_ibfk_1` FOREIGN KEY (`idPanier`) REFERENCES `panier` (`idPanier`) ON DELETE CASCADE,
  ADD CONSTRAINT `produit_panier_ibfk_2` FOREIGN KEY (`idProduit`) REFERENCES `produit` (`idProduit`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
