-- ==============================================================================
-- Digital Marketplace for Farmers (KisanSetu)
-- Production MySQL Schema
-- Tables: Users, Profiles, Products, Orders, OrderItems, Cart, Reviews, Quotes,
--         Contracts, PriceLogs, FarmInputs, Invoices, TransactionLogs
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `kisan_setu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kisan_setu`;

-- 1. Users Table (Core Auth & Roles)
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('farmer', 'consumer', 'industry', 'admin') NOT NULL DEFAULT 'consumer',
  `is_verified` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_email` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB;

-- 2. Profiles Table (Farmer & Industry Specific Details)
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `farm_name` VARCHAR(150),
  `company_name` VARCHAR(150),
  `gst_number` VARCHAR(30),
  `state` VARCHAR(80) NOT NULL,
  `district` VARCHAR(80) NOT NULL,
  `village_or_area` VARCHAR(150),
  `land_size_acres` DECIMAL(8, 2) DEFAULT 0.00,
  `primary_crops` TEXT,
  `avatar_url` TEXT,
  `rating` DECIMAL(3, 2) DEFAULT 5.00,
  `total_deals` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Products Table (Produce Listings: Individual & Bulk B2B)
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) PRIMARY KEY,
  `farmer_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM('Grains & Cereals', 'Pulses & Legumes', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds', 'Dairy & Honey') NOT NULL,
  `description` TEXT,
  `variety` VARCHAR(100),
  `price_per_unit` DECIMAL(10, 2) NOT NULL, -- price in INR
  `unit` ENUM('kg', 'quintal', 'ton', 'box', 'litre') NOT NULL DEFAULT 'kg',
  `stock_quantity` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `min_order_quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
  `is_bulk_only` BOOLEAN DEFAULT FALSE,
  `is_organic` BOOLEAN DEFAULT FALSE,
  `quality_grade` ENUM('Grade A+', 'Grade A', 'Grade B', 'Standard') DEFAULT 'Grade A',
  `harvest_date` DATE,
  `location_state` VARCHAR(80) NOT NULL,
  `location_district` VARCHAR(80) NOT NULL,
  `image_url` TEXT,
  `status` ENUM('available', 'sold_out', 'hidden') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_product_category` (`category`),
  INDEX `idx_product_farmer` (`farmer_id`),
  INDEX `idx_product_bulk` (`is_bulk_only`),
  CONSTRAINT `fk_product_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Cart Table
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) PRIMARY KEY,
  `buyer_id` VARCHAR(36) NOT NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL,
  `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
  `platform_fee` DECIMAL(10, 2) DEFAULT 0.00,
  `payment_method` ENUM('UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery') NOT NULL,
  `payment_status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
  `transaction_id` VARCHAR(100),
  `order_status` ENUM('placed', 'confirmed', 'dispatched', 'in_transit', 'delivered', 'cancelled') DEFAULT 'placed',
  `delivery_address` TEXT NOT NULL,
  `delivery_partner` VARCHAR(100) DEFAULT 'Krishi Express Logistics',
  `tracking_number` VARCHAR(100),
  `estimated_delivery` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_buyer` (`buyer_id`),
  INDEX `idx_order_status` (`order_status`),
  CONSTRAINT `fk_order_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `order_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `farmer_id` VARCHAR(36) NOT NULL,
  `quantity` DECIMAL(10, 2) NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB;

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Quotes Table (B2B RFQ - Industry & Farmers)
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` VARCHAR(36) PRIMARY KEY,
  `buyer_id` VARCHAR(36) NOT NULL,
  `farmer_id` VARCHAR(36) NOT NULL,
  `product_name` VARCHAR(150) NOT NULL,
  `crop_category` VARCHAR(100) NOT NULL,
  `quantity_requested` DECIMAL(10, 2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL DEFAULT 'quintal',
  `target_price_per_unit` DECIMAL(10, 2) NOT NULL,
  `proposed_price_per_unit` DECIMAL(10, 2),
  `specifications` TEXT,
  `delivery_timeline_days` INT DEFAULT 15,
  `status` ENUM('pending', 'negotiating', 'accepted', 'rejected', 'converted_to_contract') DEFAULT 'pending',
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_quote_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_quote_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- 9. Digital Contracts Table (B2B Legally Binding Purchase Contracts)
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` VARCHAR(36) PRIMARY KEY,
  `quote_id` VARCHAR(36) UNIQUE,
  `buyer_id` VARCHAR(36) NOT NULL,
  `farmer_id` VARCHAR(36) NOT NULL,
  `contract_title` VARCHAR(200) NOT NULL,
  `total_volume` DECIMAL(10, 2) NOT NULL,
  `total_contract_value` DECIMAL(14, 2) NOT NULL,
  `advance_percentage` DECIMAL(5, 2) DEFAULT 20.00,
  `status` ENUM('draft', 'active', 'fulfilled', 'disputed') DEFAULT 'active',
  `delivery_deadline` DATE NOT NULL,
  `penalty_clause` TEXT,
  `digital_signature_buyer` VARCHAR(255),
  `digital_signature_farmer` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Government MSP & Mandi Price Logs
CREATE TABLE IF NOT EXISTS `government_price_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `commodity` VARCHAR(100) NOT NULL,
  `variety` VARCHAR(100),
  `msp_price_per_quintal` DECIMAL(10, 2) NOT NULL,
  `mandi_avg_price_per_quintal` DECIMAL(10, 2) NOT NULL,
  `state` VARCHAR(80) NOT NULL,
  `district` VARCHAR(80) NOT NULL,
  `market_name` VARCHAR(120) NOT NULL,
  `trend` ENUM('up', 'down', 'stable') DEFAULT 'stable',
  `trend_percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `recorded_date` DATE NOT NULL,
  INDEX `idx_msp_commodity` (`commodity`, `state`)
) ENGINE=InnoDB;

-- 11. Farm Inputs Table (Krishi Bazaar for Farmers)
CREATE TABLE IF NOT EXISTS `farm_inputs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` ENUM('Fertilizers', 'Certified Seeds', 'Pesticides & Bio-control', 'Farm Equipment', 'Irrigation Systems') NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `subsidy_applicable` BOOLEAN DEFAULT FALSE,
  `subsidy_percentage` DECIMAL(5, 2) DEFAULT 0.00,
  `in_stock` BOOLEAN DEFAULT TRUE,
  `rating` DECIMAL(3, 2) DEFAULT 4.8,
  `image_url` TEXT,
  `description` TEXT
) ENGINE=InnoDB;

-- 12. Transaction & Revenue Logs
CREATE TABLE IF NOT EXISTS `transaction_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `order_id` VARCHAR(36),
  `contract_id` VARCHAR(36),
  `gross_amount` DECIMAL(14, 2) NOT NULL,
  `platform_commission` DECIMAL(10, 2) NOT NULL, -- 2% standard
  `farmer_payout` DECIMAL(14, 2) NOT NULL,
  `payment_gateway_ref` VARCHAR(100),
  `status` ENUM('escrow', 'released', 'disputed') DEFAULT 'escrow',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
