export const CATEGORIES = [
    { id: "all",       name: "All Products",     icon: "🏪", count: 240 },
  { id: "beverages", name: "Beverages",         icon: "🥤", count: 48  },
  { id: "grains",    name: "Grains & Cereals",  icon: "🌾", count: 36  },
  { id: "dairy",     name: "Dairy & Eggs",      icon: "🥛", count: 29  },
  { id: "snacks",    name: "Snacks & Confec",   icon: "🍫", count: 42  },
  { id: "household", name: "Household",         icon: "🧴", count: 55  },
  { id: "personal",  name: "Personal Care",     icon: "🧼", count: 31  },
  { id: "cooking",   name: "Cooking Essentials",icon: "🫙", count: 27  },
  { id: "bakery",    name: "Bakery Goods",      icon: "🍞", count: 18  },
  { id: "produce",   name: "Fresh Produce",     icon: "🥦", count: 22  },
]

export const PRODUCTS = [
    { id:1, name:"Coca-Cola 500ml (24-pack)", cat:"beverages", price:2400, unit:"crate", moq:2, icon:"🥤", badge:"Best Seller", sku:"BEV-001" },
  { id:2, name:"Unga Dola Maize Flour 2kg", cat:"grains", price:185, unit:"bag", moq:10, icon:"🌾", badge:"Popular", sku:"GRN-012" },
  { id:3, name:"Brookside Whole Milk 500ml", cat:"dairy", price:68, unit:"piece", moq:24, icon:"🥛", badge:null, sku:"DAI-003" },
  { id:4, name:"Digestive Biscuits 250g", cat:"snacks", price:95, unit:"pack", moq:12, icon:"🍪", badge:null, sku:"SNK-007" },
  { id:5, name:"Ariel Washing Powder 2kg", cat:"household", price:420, unit:"pack", moq:6, icon:"🧴", badge:"New", sku:"HSH-019" },
  { id:6, name:"Safeguard Soap 175g (3-pack)", cat:"personal", price:220, unit:"pack", moq:12, icon:"🧼", badge:null, sku:"PER-004" },
  { id:7, name:"Kimbo Cooking Fat 2kg", cat:"cooking", price:550, unit:"tin", moq:6, icon:"🫙", badge:"Top Pick", sku:"COK-008" },
  { id:8, name:"Waridi White Bread 400g", cat:"bakery", price:65, unit:"loaf", moq:24, icon:"🍞", badge:null, sku:"BAK-002" },
  { id:9, name:"Kericho Gold Tea 100 bags", cat:"beverages", price:290, unit:"box", moq:12, icon:"🍵", badge:null, sku:"BEV-016" },
  { id:10, name:"Golden Bell Wheat Flour 2kg", cat:"grains", price:175, unit:"bag", moq:10, icon:"🌾", badge:null, sku:"GRN-021" },
  { id:11, name:"Tomatoes (1kg pack)", cat:"produce", price:80, unit:"kg", moq:5, icon:"🍅", badge:"Fresh", sku:"PRO-001" },
  { id:12, name:"Cadbury Drinking Choc 500g", cat:"snacks", price:480, unit:"tin", moq:6, icon:"🍫", badge:null, sku:"SNK-015" },
]

export const SAMPLE_ORDERS =[ 
    { id:"ORD-0041", date:"12 Jun 2025", items:6, total:"KES 14,240", status:"Delivered" },
  { id:"ORD-0040", date:"08 Jun 2025", items:3, total:"KES 6,810",  status:"Processing" },
  { id:"ORD-0039", date:"01 Jun 2025", items:9, total:"KES 22,500", status:"Delivered" },
  { id:"ORD-0038", date:"24 May 2025", items:4, total:"KES 9,100",  status:"Delivered" },
]