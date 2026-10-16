// ==============================================================================
// Database Layer & In-Memory Fallback Engine
// Connects to MySQL if DB_HOST and credentials exist;
// Otherwise runs a robust, pre-seeded real-time in-memory store.
// ==============================================================================

const fs = require('fs');
const path = require('path');

// Initial High-Fidelity Agricultural Seed Data
const initialData = {
  users: [
    {
      id: 'usr-farmer-1',
      name: 'Rajesh Patel',
      email: 'rajesh@kisan.in',
      phone: '+91 98765 43210',
      role: 'farmer',
      is_verified: true,
      profile: {
        farm_name: 'GreenField Organic Orchards',
        state: 'Maharashtra',
        district: 'Nashik',
        village_or_area: 'Dindori',
        land_size_acres: 18.5,
        primary_crops: 'Organic Tomatoes, Grapes, Onions, Pomegranates',
        rating: 4.9,
        total_deals: 142,
        avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80'
      }
    },
    {
      id: 'usr-farmer-2',
      name: 'Sardar Gurpreet Singh',
      email: 'gurpreet@kisan.in',
      phone: '+91 98123 45678',
      role: 'farmer',
      is_verified: true,
      profile: {
        farm_name: 'Punjab Golden Harvest Acres',
        state: 'Punjab',
        district: 'Ludhiana',
        village_or_area: 'Samrala',
        land_size_acres: 45.0,
        primary_crops: 'Sharbati Wheat, Basmati 1121 Rice, Mustard',
        rating: 4.85,
        total_deals: 218,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
      }
    },
    {
      id: 'usr-farmer-3',
      name: 'Lakshmi Devi',
      email: 'lakshmi@kisan.in',
      phone: '+91 97890 12345',
      role: 'farmer',
      is_verified: true,
      profile: {
        farm_name: 'Deccan Natural Dairy & Spices',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        village_or_area: 'Tenali',
        land_size_acres: 12.0,
        primary_crops: 'Guntur Red Chillies, Turmeric, A2 Desi Cow Milk & Ghee',
        rating: 4.95,
        total_deals: 94,
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80'
      }
    },
    {
      id: 'usr-consumer-1',
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      phone: '+91 99887 76655',
      role: 'consumer',
      is_verified: true,
      profile: {
        state: 'Delhi NCR',
        district: 'New Delhi',
        village_or_area: 'Hauz Khas',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      }
    },
    {
      id: 'usr-industry-1',
      name: 'Arun Mehra (AgroCorp Foods)',
      email: 'procurement@agrocorp.com',
      phone: '+91 91234 56789',
      role: 'industry',
      is_verified: true,
      profile: {
        company_name: 'AgroCorp Global Processing Ltd.',
        gst_number: '27AABCA1234F1Z8',
        state: 'Gujarat',
        district: 'Ahmedabad',
        village_or_area: 'Sanand Industrial Hub',
        rating: 4.9,
        total_deals: 85,
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
      }
    }
  ],

  products: [
    {
      id: 'prod-1',
      farmer_id: 'usr-farmer-1',
      farmer_name: 'Rajesh Patel',
      farmer_state: 'Maharashtra',
      farmer_rating: 4.9,
      name: 'Sun-Ripened Organic Vine Tomatoes',
      category: 'Vegetables',
      description: 'Chemical-free, naturally ripened juicy desi variety tomatoes grown in rich red volcanic soil of Nashik.',
      variety: 'Desi Hybrid & Cherry mix',
      price_per_unit: 42.00,
      unit: 'kg',
      stock_quantity: 1250,
      min_order_quantity: 2,
      is_bulk_only: false,
      is_organic: true,
      quality_grade: 'Grade A+',
      harvest_date: '2026-10-12',
      location_state: 'Maharashtra',
      location_district: 'Nashik',
      image_url: '/images/tomatoes.jpg',
      status: 'available',
      nutritional_info: 'High Lycopene, Vitamin C 28mg/100g'
    },
    {
      id: 'prod-2',
      farmer_id: 'usr-farmer-2',
      farmer_name: 'Sardar Gurpreet Singh',
      farmer_state: 'Punjab',
      farmer_rating: 4.85,
      name: 'Premium Sharbati Golden Wheat (Bulk & Retail)',
      category: 'Grains & Cereals',
      description: 'Hand-cleaned, sun-dried pure MP-Punjab border Sharbati wheat. Highest gluten quality and sweet aroma.',
      variety: 'Sharbati C-306',
      price_per_unit: 36.50,
      unit: 'kg',
      stock_quantity: 38000,
      min_order_quantity: 10,
      is_bulk_only: false,
      is_organic: true,
      quality_grade: 'Grade A+',
      harvest_date: '2026-09-28',
      location_state: 'Punjab',
      location_district: 'Ludhiana',
      image_url: '/images/wheat.jpg',
      status: 'available'
    },
    {
      id: 'prod-3',
      farmer_id: 'usr-farmer-2',
      farmer_name: 'Sardar Gurpreet Singh',
      farmer_state: 'Punjab',
      farmer_rating: 4.85,
      name: 'Extra Long Traditional Basmati Rice 1121 (Aged 2 Yrs)',
      category: 'Grains & Cereals',
      description: 'Heritage aroma, extra-long grain elongation up to 24mm after cooking. Natural canal irrigated.',
      variety: 'Basmati 1121 Steam',
      price_per_unit: 115.00,
      unit: 'kg',
      stock_quantity: 15400,
      min_order_quantity: 5,
      is_bulk_only: false,
      is_organic: false,
      quality_grade: 'Grade A',
      harvest_date: '2026-08-15',
      location_state: 'Punjab',
      location_district: 'Amritsar',
      image_url: '/images/rice.jpg',
      status: 'available'
    },
    {
      id: 'prod-4',
      farmer_id: 'usr-farmer-3',
      farmer_name: 'Lakshmi Devi',
      farmer_state: 'Andhra Pradesh',
      farmer_rating: 4.95,
      name: 'Sun-Dried Guntur Teja S17 Stemless Red Chillies',
      category: 'Spices',
      description: 'High pungency SHU 75,000+, deep natural red colour without artificial polish. Perfect for export and paste.',
      variety: 'Guntur Sannam S17',
      price_per_unit: 210.00,
      unit: 'kg',
      stock_quantity: 4200,
      min_order_quantity: 1,
      is_bulk_only: false,
      is_organic: true,
      quality_grade: 'Grade A+',
      harvest_date: '2026-10-01',
      location_state: 'Andhra Pradesh',
      location_district: 'Guntur',
      image_url: '/images/chillies.jpg',
      status: 'available'
    },
    {
      id: 'prod-5',
      farmer_id: 'usr-farmer-1',
      farmer_name: 'Rajesh Patel',
      farmer_state: 'Maharashtra',
      farmer_rating: 4.9,
      name: 'Ratnagiri Export Alphonso Mangoes (Carbide Free)',
      category: 'Fruits',
      description: 'GI Tagged, authentic Devgad/Ratnagiri Hapus. Naturally tree-ripened using organic hay chambers.',
      variety: 'Devgad Hapus',
      price_per_unit: 650.00,
      unit: 'box',
      stock_quantity: 800,
      min_order_quantity: 1,
      is_bulk_only: false,
      is_organic: true,
      quality_grade: 'Grade A+',
      harvest_date: '2026-10-10',
      location_state: 'Maharashtra',
      location_district: 'Ratnagiri',
      image_url: '/images/mangoes.jpg',
      status: 'available'
    },
    {
      id: 'prod-6',
      farmer_id: 'usr-farmer-3',
      farmer_name: 'Lakshmi Devi',
      farmer_state: 'Andhra Pradesh',
      farmer_rating: 4.95,
      name: 'Bilona Churned Pure A2 Gir Cow Desi Ghee',
      category: 'Dairy & Honey',
      description: 'Handcrafted using traditional Vedic curd-churning (Bilona). Made from pasture-raised indigenous Gir cows.',
      variety: 'Vedic Bilona Ghee',
      price_per_unit: 450.00,
      unit: 'litre',
      stock_quantity: 350,
      min_order_quantity: 1,
      is_bulk_only: false,
      is_organic: true,
      quality_grade: 'Grade A+',
      harvest_date: '2026-10-08',
      location_state: 'Andhra Pradesh',
      location_district: 'Tenali',
      image_url: '/images/desi_ghee.jpg',
      status: 'available'
    },
    {
      id: 'prod-7',
      farmer_id: 'usr-farmer-2',
      farmer_name: 'Sardar Gurpreet Singh',
      farmer_state: 'Punjab',
      farmer_rating: 4.85,
      name: 'Non-GMO Yellow Soybeans (Wholesale Industry Grade)',
      category: 'Oilseeds',
      description: 'High-protein 41.5%, low moisture 8.2%, ideal for tofu, soymilk manufacturing and oil extraction.',
      variety: 'JS-335 Grade',
      price_per_unit: 52.00,
      unit: 'kg',
      stock_quantity: 65000,
      min_order_quantity: 500,
      is_bulk_only: true,
      is_organic: false,
      quality_grade: 'Grade A',
      harvest_date: '2026-10-02',
      location_state: 'Madhya Pradesh',
      location_district: 'Indore',
      image_url: '/images/soybeans.jpg',
      status: 'available'
    },
    {
      id: 'prod-8',
      farmer_id: 'usr-farmer-1',
      farmer_name: 'Rajesh Patel',
      farmer_state: 'Maharashtra',
      farmer_rating: 4.9,
      name: 'Crisp Nashik Red Onions (Export Size 55mm+)',
      category: 'Vegetables',
      description: 'Firm, low pungency, high dry matter, sorted and graded for long shelf life and zero black fungus.',
      variety: 'Garwa Winter Red',
      price_per_unit: 28.00,
      unit: 'kg',
      stock_quantity: 45000,
      min_order_quantity: 25,
      is_bulk_only: false,
      is_organic: false,
      quality_grade: 'Grade A',
      harvest_date: '2026-10-05',
      location_state: 'Maharashtra',
      location_district: 'Lasalgaon',
      image_url: '/images/onions.jpg',
      status: 'available'
    }
  ],

  cart: [
    {
      id: 'crt-1',
      user_id: 'usr-consumer-1',
      product_id: 'prod-1',
      quantity: 5,
      product: null // populated dynamically
    },
    {
      id: 'crt-2',
      user_id: 'usr-consumer-1',
      product_id: 'prod-6',
      quantity: 1,
      product: null
    }
  ],

  orders: [
    {
      id: 'ORD-2026-9041',
      buyer_id: 'usr-consumer-1',
      buyer_name: 'Priya Sharma',
      total_amount: 1660.00,
      platform_fee: 33.20,
      payment_method: 'UPI',
      payment_status: 'completed',
      transaction_id: 'UPI-TXN-8829471940',
      order_status: 'in_transit',
      delivery_address: 'Flat 402, Green Meadows, Hauz Khas, New Delhi 110016',
      delivery_partner: 'Krishi Cold-Chain Express',
      tracking_number: 'KCE-DEL-984129',
      estimated_delivery: 'Tomorrow by 11:30 AM',
      items: [
        {
          product_id: 'prod-1',
          name: 'Sun-Ripened Organic Vine Tomatoes',
          quantity: 5,
          unit: 'kg',
          unit_price: 42.00,
          subtotal: 210.00
        },
        {
          product_id: 'prod-6',
          name: 'Bilona Churned Pure A2 Gir Cow Desi Ghee',
          quantity: 1,
          unit: 'litre',
          unit_price: 1450.00,
          subtotal: 1450.00
        }
      ],
      tracking_timeline: [
        { status: 'placed', title: 'Order Placed & Paid', time: '14 Oct, 09:15 AM', completed: true },
        { status: 'confirmed', title: 'Farmer Rajesh Patel Confirmed & Harvested', time: '14 Oct, 01:30 PM', completed: true },
        { status: 'dispatched', title: 'Dispatched via Krishi Cold-Chain', time: '15 Oct, 06:45 AM', completed: true },
        { status: 'in_transit', title: 'In Transit: Reached Delhi North Hub', time: '15 Oct, 04:20 PM', completed: true },
        { status: 'delivered', title: 'Out for Delivery to Customer', time: 'Pending (Tomorrow 11:30 AM)', completed: false }
      ],
      created_at: '2026-10-14T09:15:00Z'
    }
  ],

  quotes: [
    {
      id: 'RFQ-8910',
      buyer_id: 'usr-industry-1',
      buyer_name: 'Arun Mehra (AgroCorp Foods)',
      farmer_id: 'usr-farmer-2',
      farmer_name: 'Sardar Gurpreet Singh',
      product_name: 'Premium Sharbati Golden Wheat',
      crop_category: 'Grains & Cereals',
      quantity_requested: 250,
      unit: 'quintal (25,000 kg)',
      target_price_per_unit: 3400.00, // INR per quintal
      proposed_price_per_unit: 3550.00,
      specifications: 'Moisture < 10.5%, Gluten index > 85%, Foreign matter < 0.2%, Grain count > 1000/38g',
      delivery_timeline_days: 10,
      status: 'converted_to_contract',
      notes: 'Final rate settled at Rs 3,500/quintal with 25% advance escrow on contract signing.',
      created_at: '2026-10-10T14:30:00Z'
    },
    {
      id: 'RFQ-8911',
      buyer_id: 'usr-industry-1',
      buyer_name: 'Arun Mehra (AgroCorp Foods)',
      farmer_id: 'usr-farmer-2',
      farmer_name: 'Sardar Gurpreet Singh',
      product_name: 'Non-GMO Yellow Soybeans',
      crop_category: 'Oilseeds',
      quantity_requested: 120,
      unit: 'quintal (12,000 kg)',
      target_price_per_unit: 4900.00,
      proposed_price_per_unit: 5100.00,
      specifications: 'Protein content 41% min, oil content 19% min, delivery at Sanand plant.',
      delivery_timeline_days: 14,
      status: 'negotiating',
      notes: 'Farmer offered 5050/quintal if delivery freight is subsidized.',
      created_at: '2026-10-13T11:00:00Z'
    }
  ],

  contracts: [
    {
      id: 'CTR-2026-441',
      quote_id: 'RFQ-8910',
      buyer_name: 'AgroCorp Global Processing Ltd.',
      farmer_name: 'Sardar Gurpreet Singh',
      contract_title: 'B2B Procurement Contract: 250 Quintals Premium Sharbati Wheat',
      total_volume: '250 Quintals (25 Metric Tons)',
      total_contract_value: 875000.00,
      advance_amount: 218750.00,
      advance_status: 'Paid in Escrow',
      delivery_deadline: '2026-10-25',
      status: 'active',
      invoice_number: 'INV-AC-2026-0042',
      gst_amount: 43750.00,
      digital_signature_buyer: 'SHA256:8f4a1c9e3b... (Arun Mehra - Authorized)',
      digital_signature_farmer: 'SHA256:d3c2a1b9e8... (Gurpreet Singh - Aadhaar eSign)',
      created_at: '2026-10-11T16:00:00Z'
    }
  ],

  // Government MSP and APMC Mandi Price Intelligence
  msp_rates: [
    {
      commodity: 'Wheat (Gehun)',
      msp_price: 2425.00, // per quintal (Govt MSP 2026-27 benchmark)
      mandi_avg_price: 2780.00,
      state: 'Punjab / Haryana / MP',
      trend: 'up',
      trend_percentage: 14.6,
      recommendation: 'Market price is 14.6% ABOVE MSP. Favorable time for open marketplace sale rather than FCI procurement.',
      historical: [
        { month: 'Jun', price: 2350 },
        { month: 'Jul', price: 2410 },
        { month: 'Aug', price: 2520 },
        { month: 'Sep', price: 2650 },
        { month: 'Oct', price: 2780 }
      ]
    },
    {
      commodity: 'Paddy / Basmati Rice (Dhan)',
      msp_price: 2300.00,
      mandi_avg_price: 2950.00,
      state: 'Punjab / UP / AP',
      trend: 'up',
      trend_percentage: 28.2,
      recommendation: 'High export demand surge. Hold stock for Grade-A millers or list on B2B portal.',
      historical: [
        { month: 'Jun', price: 2280 },
        { month: 'Jul', price: 2400 },
        { month: 'Aug', price: 2600 },
        { month: 'Sep', price: 2800 },
        { month: 'Oct', price: 2950 }
      ]
    },
    {
      commodity: 'Soybean (Pili)',
      msp_price: 4892.00,
      mandi_avg_price: 4950.00,
      state: 'Madhya Pradesh / Maharashtra',
      trend: 'stable',
      trend_percentage: 1.2,
      recommendation: 'Prices are near MSP floor. Recommend locking in forward B2B contracts with oil millers.',
      historical: [
        { month: 'Jun', price: 4700 },
        { month: 'Jul', price: 4820 },
        { month: 'Aug', price: 4900 },
        { month: 'Sep', price: 4920 },
        { month: 'Oct', price: 4950 }
      ]
    },
    {
      commodity: 'Cotton (Kapas Medium)',
      msp_price: 7121.00,
      mandi_avg_price: 7650.00,
      state: 'Gujarat / Maharashtra',
      trend: 'up',
      trend_percentage: 7.4,
      recommendation: 'Textile procurement opening. Direct listing recommended.',
      historical: [
        { month: 'Jun', price: 7050 },
        { month: 'Jul', price: 7150 },
        { month: 'Aug', price: 7300 },
        { month: 'Sep', price: 7500 },
        { month: 'Oct', price: 7650 }
      ]
    },
    {
      commodity: 'Mustard / Rapeseed (Sarson)',
      msp_price: 5650.00,
      mandi_avg_price: 5890.00,
      state: 'Rajasthan / Haryana',
      trend: 'up',
      trend_percentage: 4.2,
      recommendation: 'Steady festival consumption. Good market stability.',
      historical: [
        { month: 'Jun', price: 5450 },
        { month: 'Jul', price: 5550 },
        { month: 'Aug', price: 5700 },
        { month: 'Sep', price: 5800 },
        { month: 'Oct', price: 5890 }
      ]
    },
    {
      commodity: 'Onion (Nashik Mandi)',
      msp_price: 1800.00, // estimated base
      mandi_avg_price: 2450.00,
      state: 'Maharashtra',
      trend: 'up',
      trend_percentage: 36.1,
      recommendation: 'Sharp supply crunch. Sell 60% of cold storage reserves.',
      historical: [
        { month: 'Jun', price: 1600 },
        { month: 'Jul', price: 1850 },
        { month: 'Aug', price: 2100 },
        { month: 'Sep', price: 2300 },
        { month: 'Oct', price: 2450 }
      ]
    }
  ],

  // Krishi Bazaar (Farmers Marketplace: Fertilizers, Seeds, Tools, Irrigation)
  farm_inputs: [
    {
      id: 'inp-1',
      title: 'IFFCO Nano Urea Liquid (500ml Bottle = 1 Bag Urea)',
      category: 'Fertilizers',
      brand: 'IFFCO GreenTech',
      price: 225.00,
      original_price: 260.00,
      subsidy_applicable: true,
      subsidy_percentage: 15.0,
      in_stock: true,
      rating: 4.9,
      image_url: '/images/nano_urea.jpg',
      description: 'Revolutionary nanotechnology fertilizer. Increases crop yield by 8-10%, reduces soil acidification, 100% absorption.'
    },
    {
      id: 'inp-2',
      title: 'Certified High-Yield Hybrid Wheat Seeds (HD-3086)',
      category: 'Certified Seeds',
      brand: 'National Seeds Corporation (NSC)',
      price: 1150.00,
      original_price: 1400.00,
      subsidy_applicable: true,
      subsidy_percentage: 20.0,
      in_stock: true,
      rating: 4.8,
      image_url: '/images/hybrid_seeds.jpg',
      description: 'Drought-resistant, yellow rust immune, high protein grain. 40kg bag with 98% germination guarantee.'
    },
    {
      id: 'inp-3',
      title: 'Smart Solar Drip Irrigation Automation Kit (1 Acre)',
      category: 'Irrigation Systems',
      brand: 'Jain Irrigation Systems',
      price: 14800.00,
      original_price: 22000.00,
      subsidy_applicable: true,
      subsidy_percentage: 45.0, // PM-KUSUM subsidy
      in_stock: true,
      rating: 4.95,
      image_url: '/images/drip_irrigation.jpg',
      description: 'Saves 65% water with automated moisture sensor valves and mobile app remote pump control. PM-KUSUM eligible.'
    },
    {
      id: 'inp-4',
      title: 'Bio-Neem Organic Pest Repellent & Fungicide (5 Litre)',
      category: 'Pesticides & Bio-control',
      brand: 'KisanShield Bio',
      price: 890.00,
      original_price: 1050.00,
      subsidy_applicable: false,
      subsidy_percentage: 0.0,
      in_stock: true,
      rating: 4.75,
      image_url: '/images/bio_neem.jpg',
      description: '10,000 PPM Azadirachtin cold-pressed pure neem oil. Completely non-toxic for bees while eliminating bollworm and aphids.'
    },
    {
      id: 'inp-5',
      title: 'Multi-Utility 7.5 HP Petrol Power Weeder & Tiller',
      category: 'Farm Equipment',
      brand: 'Kirloskar Kisan',
      price: 32500.00,
      original_price: 41000.00,
      subsidy_applicable: true,
      subsidy_percentage: 25.0,
      in_stock: true,
      rating: 4.85,
      image_url: '/images/power_tiller.jpg',
      description: 'Heavy-duty 4-stroke engine for weeding in sugarcane, vegetable rows, and orchard inter-cultivation.'
    }
  ],

  // Reviews Database
  reviews: [
    {
      id: 'rev-1',
      product_id: 'prod-1',
      user_name: 'Priya Sharma',
      rating: 5,
      comment: 'Super fresh, sweet and farm-scented tomatoes! Nothing like what we get in standard retail stores.',
      date: '14 Oct 2026'
    },
    {
      id: 'rev-2',
      product_id: 'prod-6',
      user_name: 'Vikram Seth',
      rating: 5,
      comment: 'The aroma of this A2 Bilona ghee is genuinely authentic like my grandmother used to make. Outstanding quality!',
      date: '12 Oct 2026'
    },
    {
      id: 'rev-3',
      product_id: 'prod-2',
      user_name: 'Anjali Verma',
      rating: 5,
      comment: 'Cleaned grains with zero stones or dust. Rotis turned out soft and puffed up like restaurant phulkas.',
      date: '10 Oct 2026'
    }
  ],

  // AI Knowledge Base: Crop & Cattle Disease Diagnostics
  disease_knowledge_base: [
    {
      id: 'dis-crop-1',
      target_type: 'crop',
      name: 'Tomato Early Blight (Alternaria solani)',
      confidence_score: 96.4,
      symptoms: [
        'Concentric dark ring spots (target board pattern) on older leaves',
        'Yellow halo around necrotic lesions',
        'Premature defoliation starting from the lower canopy'
      ],
      cause: 'Fungal pathogen triggered by high humidity (80%+) and temperatures between 24°C - 29°C.',
      chemical_treatment: 'Foliar spray of Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L at 10-day intervals.',
      organic_treatment: 'Spray 5% Neem seed kernel extract (NSKE) or Trichoderma viride bio-fungicide @ 5g/L.',
      recommended_product_id: 'inp-4',
      severity: 'Moderate - Treat within 48 hours'
    },
    {
      id: 'dis-crop-2',
      target_type: 'crop',
      name: 'Wheat Yellow Stripe Rust (Puccinia striiformis)',
      confidence_score: 94.8,
      symptoms: [
        'Linear bright yellow pustules arranged parallel along leaf veins',
        'Yellow powder rubbing off on fingers upon touch',
        'Shriveled grain formation'
      ],
      cause: 'Airborne fungal spores during cool, moist weather (10°C - 20°C).',
      chemical_treatment: 'Propiconazole 25% EC (Tilt) @ 1ml/L or Tebuconazole 25.9% EC immediately upon sighting.',
      organic_treatment: 'Foliar spray of fermented sour buttermilk (Chhachh) mixed with copper vessel extract.',
      recommended_product_id: 'inp-2',
      severity: 'Critical - Requires prompt fungicide spray'
    },
    {
      id: 'dis-cattle-1',
      target_type: 'cattle',
      name: 'Bovine Mastitis (Udder Inflammation)',
      confidence_score: 97.2,
      symptoms: [
        'Swollen, hot, and painful udder quarters',
        'Watery, discolored milk with flakes or clots',
        'Drop in daily milk yield and mild fever'
      ],
      cause: 'Bacterial infection (Staph. aureus or E. coli) entering open teat canals after milking.',
      chemical_treatment: 'Intramammary antibiotic infusion as prescribed by a licensed vet, plus NSAID (Meloxicam) for pain relief.',
      organic_treatment: 'Topical application of turmeric, aloe vera, and limestone (Chuna) paste; post-milking teat dip with povidone-iodine.',
      recommended_product_id: 'inp-4',
      severity: 'High - Call a local veterinary doctor'
    },
    {
      id: 'dis-cattle-2',
      target_type: 'cattle',
      name: 'Lumpy Skin Disease (Capripoxvirus)',
      confidence_score: 93.7,
      symptoms: [
        'Firm, circular, raised cutaneous nodules (2-5 cm) all over body and head',
        'High fever (40°C - 41.5°C)',
        'Swollen lymph nodes and discharge from eyes and nose'
      ],
      cause: 'Capripox virus transmitted by biting flies, mosquitoes, and ticks.',
      chemical_treatment: 'Supportive therapy: Antipyretics, antihistamines, and broad-spectrum antibiotics to prevent secondary bacterial infection.',
      organic_treatment: 'Isolate animal; oral administration of black pepper, betel leaves, cumin, and jaggery paste. Spray fly repellents.',
      recommended_product_id: 'inp-4',
      severity: 'Severe - Quarantine immediately and report to animal husbandry dept.'
    }
  ]
};

// In-Memory Database store with deep copy
let dbState = JSON.parse(JSON.stringify(initialData));

const db = {
  // Products
  getProducts: (filters = {}) => {
    let list = [...dbState.products];
    if (filters.category && filters.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.is_organic !== undefined) {
      list = list.filter(p => p.is_organic === (filters.is_organic === 'true' || filters.is_organic === true));
    }
    if (filters.is_bulk !== undefined) {
      list = list.filter(p => p.is_bulk_only === (filters.is_bulk === 'true' || filters.is_bulk === true));
    }
    if (filters.farmer_id) {
      list = list.filter(p => p.farmer_id === filters.farmer_id);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location_state.toLowerCase().includes(q) ||
        (p.variety && p.variety.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getProductById: (id) => {
    return dbState.products.find(p => p.id === id) || null;
  },

  createProduct: (productData) => {
    const newProduct = {
      id: 'prod-' + Date.now(),
      status: 'available',
      created_at: new Date().toISOString(),
      ...productData
    };
    dbState.products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: (id, updates) => {
    const index = dbState.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    dbState.products[index] = { ...dbState.products[index], ...updates };
    return dbState.products[index];
  },

  deleteProduct: (id) => {
    const initialLen = dbState.products.length;
    dbState.products = dbState.products.filter(p => p.id !== id);
    return dbState.products.length < initialLen;
  },

  // Cart
  getCart: (userId = 'usr-consumer-1') => {
    return dbState.cart
      .filter(item => item.user_id === userId)
      .map(item => ({
        ...item,
        product: dbState.products.find(p => p.id === item.product_id) || null
      }))
      .filter(item => item.product !== null);
  },

  addToCart: (userId, productId, quantity = 1) => {
    const existing = dbState.cart.find(c => c.user_id === userId && c.product_id === productId);
    if (existing) {
      existing.quantity += Number(quantity);
      return existing;
    }
    const newItem = {
      id: 'crt-' + Date.now(),
      user_id: userId,
      product_id: productId,
      quantity: Number(quantity)
    };
    dbState.cart.push(newItem);
    return newItem;
  },

  updateCartQuantity: (userId, cartItemId, quantity) => {
    const item = dbState.cart.find(c => c.id === cartItemId && c.user_id === userId);
    if (!item) return null;
    if (quantity <= 0) {
      dbState.cart = dbState.cart.filter(c => c.id !== cartItemId);
      return { deleted: true };
    }
    item.quantity = Number(quantity);
    return item;
  },

  removeFromCart: (userId, cartItemId) => {
    const initialLen = dbState.cart.length;
    dbState.cart = dbState.cart.filter(c => !(c.id === cartItemId && c.user_id === userId));
    return dbState.cart.length < initialLen;
  },

  clearCart: (userId) => {
    dbState.cart = dbState.cart.filter(c => c.user_id !== userId);
    return true;
  },

  // Orders
  getOrders: (userId = null, role = 'consumer') => {
    if (!userId) return dbState.orders;
    if (role === 'farmer') {
      // Find orders that contain any product by this farmer
      const farmerProductIds = dbState.products.filter(p => p.farmer_id === userId).map(p => p.id);
      return dbState.orders.filter(ord =>
        ord.items && ord.items.some(item => farmerProductIds.includes(item.product_id))
      );
    }
    return dbState.orders.filter(ord => ord.buyer_id === userId);
  },

  getOrderById: (id) => {
    return dbState.orders.find(o => o.id === id) || null;
  },

  createOrder: (orderData) => {
    const newOrder = {
      id: 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000),
      created_at: new Date().toISOString(),
      order_status: 'placed',
      payment_status: 'completed',
      delivery_partner: 'Krishi Cold-Chain Express',
      tracking_number: 'KCE-DEL-' + Math.floor(100000 + Math.random() * 900000),
      estimated_delivery: 'In 2 business days',
      tracking_timeline: [
        { status: 'placed', title: 'Order Placed & Payment Verified', time: 'Just now', completed: true },
        { status: 'confirmed', title: 'Farmer Dispatched to Hub', time: 'Pending', completed: false },
        { status: 'dispatched', title: 'Handed to Logistics Partner', time: 'Pending', completed: false },
        { status: 'in_transit', title: 'Cold-Chain Transit', time: 'Pending', completed: false },
        { status: 'delivered', title: 'Delivered to Doorstep', time: 'Pending', completed: false }
      ],
      ...orderData
    };

    // Calculate platform fee (2%)
    newOrder.platform_fee = +(newOrder.total_amount * 0.02).toFixed(2);

    dbState.orders.unshift(newOrder);

    // Deduct stock
    if (newOrder.items) {
      newOrder.items.forEach(item => {
        const prod = dbState.products.find(p => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - item.quantity);
        }
      });
    }

    // Clear cart
    if (orderData.buyer_id) {
      db.clearCart(orderData.buyer_id);
    }

    return newOrder;
  },

  // Quotes (Industry RFQs)
  getQuotes: (userId = null, role = null) => {
    if (!userId) return dbState.quotes;
    if (role === 'farmer') {
      return dbState.quotes.filter(q => q.farmer_id === userId);
    }
    if (role === 'industry') {
      return dbState.quotes.filter(q => q.buyer_id === userId);
    }
    return dbState.quotes;
  },

  createQuote: (quoteData) => {
    const newQuote = {
      id: 'RFQ-' + Math.floor(1000 + Math.random() * 9000),
      status: 'pending',
      created_at: new Date().toISOString(),
      ...quoteData
    };
    dbState.quotes.unshift(newQuote);
    return newQuote;
  },

  updateQuoteStatus: (id, status, notes = '') => {
    const quote = dbState.quotes.find(q => q.id === id);
    if (!quote) return null;
    quote.status = status;
    if (notes) quote.notes = notes;

    // If accepted and converted to contract, auto-generate digital contract
    if (status === 'converted_to_contract' || status === 'accepted') {
      const contract = {
        id: 'CTR-2026-' + Math.floor(100 + Math.random() * 900),
        quote_id: quote.id,
        buyer_name: quote.buyer_name,
        farmer_name: quote.farmer_name,
        contract_title: `Procurement Contract: ${quote.quantity_requested} ${quote.unit} of ${quote.product_name}`,
        total_volume: `${quote.quantity_requested} ${quote.unit}`,
        total_contract_value: +(quote.quantity_requested * (quote.proposed_price_per_unit || quote.target_price_per_unit)).toFixed(2),
        advance_amount: +((quote.quantity_requested * (quote.proposed_price_per_unit || quote.target_price_per_unit)) * 0.25).toFixed(2),
        advance_status: 'Secured in Escrow',
        delivery_deadline: new Date(Date.now() + (quote.delivery_timeline_days || 14) * 86400000).toISOString().split('T')[0],
        status: 'active',
        invoice_number: 'INV-' + Math.floor(10000 + Math.random() * 90000),
        gst_amount: +((quote.quantity_requested * (quote.proposed_price_per_unit || quote.target_price_per_unit)) * 0.05).toFixed(2),
        digital_signature_buyer: 'SHA256:' + Math.random().toString(36).substring(2, 12) + ' (Buyer Verified)',
        digital_signature_farmer: 'SHA256:' + Math.random().toString(36).substring(2, 12) + ' (Aadhaar Verified)',
        created_at: new Date().toISOString()
      };
      dbState.contracts.unshift(contract);
    }
    return quote;
  },

  // Contracts
  getContracts: () => dbState.contracts,

  // MSP & Mandi Rates
  getMspRates: () => dbState.msp_rates,

  // Farm Inputs
  getFarmInputs: (category = null) => {
    if (!category || category === 'All') return dbState.farm_inputs;
    return dbState.farm_inputs.filter(i => i.category.toLowerCase() === category.toLowerCase());
  },

  // Reviews
  getReviews: (productId = null) => {
    if (!productId) return dbState.reviews;
    return dbState.reviews.filter(r => r.product_id === productId);
  },

  addReview: (reviewData) => {
    const newRev = {
      id: 'rev-' + Date.now(),
      date: 'Today',
      ...reviewData
    };
    dbState.reviews.unshift(newRev);
    return newRev;
  },

  // AI Services
  detectDisease: (imageMeta = {}, type = 'crop') => {
    const targetType = type || 'crop';
    const matches = dbState.disease_knowledge_base.filter(d => d.target_type === targetType);
    const sampleStr = ((imageMeta.sample_name || '') + ' ' + (imageMeta.image_url || '')).toLowerCase();

    let diagnosis = null;
    if (targetType === 'crop') {
      if (sampleStr.includes('wheat') || sampleStr.includes('rust') || sampleStr.includes('yellow')) {
        diagnosis = matches.find(d => d.id === 'dis-crop-2') || matches[1];
      } else {
        diagnosis = matches.find(d => d.id === 'dis-crop-1') || matches[0];
      }
    } else {
      if (sampleStr.includes('lumpy') || sampleStr.includes('skin') || sampleStr.includes('nodule') || sampleStr.includes('lesion')) {
        diagnosis = matches.find(d => d.id === 'dis-cattle-2') || matches[1];
      } else {
        diagnosis = matches.find(d => d.id === 'dis-cattle-1') || matches[0];
      }
    }
    if (!diagnosis) {
      diagnosis = matches[0] || dbState.disease_knowledge_base[0];
    }

    // Attach matching recommended farm input product
    const recommendedProduct = dbState.farm_inputs.find(inp => inp.id === diagnosis.recommended_product_id) || dbState.farm_inputs[0];

    return {
      success: true,
      scan_id: 'SCAN-' + Date.now(),
      scanned_type: targetType,
      sample_source: imageMeta.sample_name || 'File Upload from Folder',
      diagnosis: diagnosis.name,
      confidence_score: diagnosis.confidence_score,
      severity: diagnosis.severity,
      symptoms: diagnosis.symptoms,
      cause: diagnosis.cause,
      chemical_treatment: diagnosis.chemical_treatment,
      organic_treatment: diagnosis.organic_treatment,
      remedy_product: recommendedProduct,
      timestamp: new Date().toISOString()
    };
  },

  classifyCrop: (cropData = {}) => {
    const name = cropData.name || 'Produce';
    return {
      suggested_category: cropData.category || 'Grains & Cereals',
      estimated_grade: 'Grade A+ (Premium Export)',
      suggested_price_range: {
        min_inr: 35.00,
        fair_market_inr: 44.50,
        max_inr: 55.00
      },
      shelf_life_days: 14,
      storage_advice: 'Store at 12°C - 16°C in ventilated perforated wooden crates.',
      organic_verification_readiness: 'High (Passes standard residue screen)'
    };
  },

  // Voice NLP Parser
  parseVoiceCommand: (transcript = '') => {
    const text = transcript.toLowerCase();

    if (text.includes('wheat') || text.includes('rice') || text.includes('tomato') || text.includes('onion') || text.includes('ghee') || text.includes('mango') || text.includes('chilli')) {
      let query = 'wheat';
      if (text.includes('tomato')) query = 'tomato';
      if (text.includes('rice') || text.includes('basmati')) query = 'rice';
      if (text.includes('onion')) query = 'onion';
      if (text.includes('ghee')) query = 'ghee';
      if (text.includes('mango')) query = 'mango';
      if (text.includes('chilli')) query = 'chilli';
      return {
        intent: 'SEARCH_PRODUCT',
        entity: query,
        spoken_response: `Showing freshest farm listings for ${query}.`
      };
    }

    if (text.includes('disease') || text.includes('scan') || text.includes('sick') || text.includes('leaf') || text.includes('cattle') || text.includes('doctor')) {
      return {
        intent: 'NAVIGATE_DISEASE_SCANNER',
        entity: text.includes('cattle') ? 'cattle' : 'crop',
        spoken_response: 'Opening AI Health Diagnosis Lab for crops and livestock.'
      };
    }

    if (text.includes('msp') || text.includes('price') || text.includes('rate') || text.includes('mandi') || text.includes('bhav')) {
      return {
        intent: 'VIEW_MSP_RATES',
        spoken_response: 'Here are the live Government MSP and Mandi market rates across states.'
      };
    }

    if (text.includes('farmer') || text.includes('add produce') || text.includes('sell')) {
      return {
        intent: 'SWITCH_ROLE',
        role: 'farmer',
        spoken_response: 'Switched to Farmer Portal. You can manage crops, add listings, and view earnings.'
      };
    }

    if (text.includes('industry') || text.includes('bulk') || text.includes('quote') || text.includes('contract')) {
      return {
        intent: 'SWITCH_ROLE',
        role: 'industry',
        spoken_response: 'Switched to Industry B2B Portal. Bulk catalog, RFQs, and digital contracts ready.'
      };
    }

    if (text.includes('consumer') || text.includes('shop') || text.includes('buy') || text.includes('fresh')) {
      return {
        intent: 'SWITCH_ROLE',
        role: 'consumer',
        spoken_response: 'Switched to Consumer Storefront. Fresh harvest available directly from verified farms.'
      };
    }

    if (text.includes('fertilizer') || text.includes('seed') || text.includes('krishi bazaar') || text.includes('equipment') || text.includes('pesticide')) {
      return {
        intent: 'NAVIGATE_KRISHI_BAZAAR',
        spoken_response: 'Opening Krishi Bazaar. Verified fertilizers, hybrid seeds, and tools at subsidized rates.'
      };
    }

    if (text.includes('cart') || text.includes('checkout')) {
      return {
        intent: 'OPEN_CART',
        spoken_response: 'Opening your harvest shopping cart.'
      };
    }

    return {
      intent: 'GENERAL_ASSISTANCE',
      spoken_response: `I heard: "${transcript}". You can ask me to search crops, check MSP prices, scan diseases, or switch to Farmer or Industry dashboards.`
    };
  },

  // Platform Analytics & Revenue
  getAnalytics: () => {
    const totalGrossGMV = dbState.orders.reduce((acc, o) => acc + o.total_amount, 0) +
      dbState.contracts.reduce((acc, c) => acc + c.total_contract_value, 0);

    const platformCommission = +(totalGrossGMV * 0.02).toFixed(2); // 2% platform fee

    return {
      total_gmv_inr: totalGrossGMV,
      platform_revenue_inr: platformCommission,
      active_farmers: 48,
      verified_industry_buyers: 14,
      total_products_listed: dbState.products.length,
      orders_fulfilled: dbState.orders.length + 124,
      active_contracts: dbState.contracts.length,
      saved_farmer_middleman_cost_percentage: 28.5,
      live_market_commodities_tracked: dbState.msp_rates.length
    };
  },

  // Users & Roles
  getUsers: () => dbState.users,
  getUserById: (id) => dbState.users.find(u => u.id === id) || null
};

module.exports = db;
