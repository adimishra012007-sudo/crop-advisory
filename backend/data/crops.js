// In-memory array acting as our temporary crop database.
// Storing 10 realistic crop records tailored to Uttarakhand's geographic zones.

export let crops = [
  {
    id: "1",
    cropName: "Finger Millet (Mandua)",
    soilType: "Sandy loam to shallow gravelly soils",
    season: "Kharif",
    waterRequirement: "Low (Drought-resistant, mostly rainfed)",
    fertilizer: "Traditional Jivamrit or well-rotted farmyard manure (FYM)",
    description: "A highly nutritious staple crop of Uttarakhand hills, rich in calcium and iron, grown extensively on sloped terrace fields."
  },
  {
    id: "2",
    cropName: "Uttarkashi Apple",
    soilType: "Well-drained deep loamy soil",
    season: "Winter/Spring",
    waterRequirement: "Medium (Requires snow melt moisture and targeted drip irrigation)",
    fertilizer: "Organic compost mixed with wood ash and minor zinc supplements",
    description: "High-quality temperate fruit grown in high-altitude zones like Harsil (Uttarkashi), known for its crisp texture and long shelf life."
  },
  {
    id: "3",
    cropName: "Hill Potato",
    soilType: "Loose, well-aerated sandy loam",
    season: "Kharif/Rabi",
    waterRequirement: "Moderate (Sensitive to waterlogging, requires good slope drainage)",
    fertilizer: "Well-rotted sheep manure, bone meal, and neem cake",
    description: "Major cash crop in hill districts like Munsiyari and Joshimath, celebrated for its unique taste due to pesticide-free soil."
  },
  {
    id: "4",
    cropName: "Munsiyari Rajma (Kidney Beans)",
    soilType: "Light sandy loam with rich organic matter",
    season: "Kharif",
    waterRequirement: "Moderate (Needs consistent moisture during flowering and pod development)",
    fertilizer: "Vermicompost, bio-fertilizers (Rhizobium culture), and Jivamrit",
    description: "Premium high-altitude legume variety famous for its rapid cooking time, smooth texture, and rich protein profile."
  },
  {
    id: "5",
    cropName: "Hill Soybean (Bhatt)",
    soilType: "Clay loam to loamy soil",
    season: "Kharif",
    waterRequirement: "Moderate (Mainly rainfed, requires drainage on flat lands)",
    fertilizer: "Composted organic waste, rock phosphate, and bio-inoculants",
    description: "Traditional black soybean variety native to Kumaon regions, used to prepare the classic nutritious dish 'Bhatt ki Churkani'."
  },
  {
    id: "6",
    cropName: "Himalayan Red Rice",
    soilType: "Clayey loam with high water retention capacity",
    season: "Kharif",
    waterRequirement: "High (Flooded conditions or frequent rainfed watering)",
    fertilizer: "Green manure (Dhaincha) and liquid bio-fertilizers",
    description: "Grown in the river valleys of Purola and Uttarkashi, this nutty-flavored red grain is rich in antioxidants."
  },
  {
    id: "7",
    cropName: "Amaranthus (Chua/Ramdana)",
    soilType: "Sandy loam to poor gravelly soils",
    season: "Kharif",
    waterRequirement: "Low (Requires minimal rainfall to thrive)",
    fertilizer: "Compost or composted cow manure",
    description: "A vibrant, colorful pseudo-cereal grown across Uttarakhand valleys, gluten-free and consumed during fasts."
  },
  {
    id: "8",
    cropName: "Himalayan Barley (Jau)",
    soilType: "Well-drained sandy loam to loamy soils",
    season: "Rabi",
    waterRequirement: "Low to Moderate (Highly resistant to cold mountain winds)",
    fertilizer: "Traditional compost and vermicompost",
    description: "Cold-tolerant grain cultivated in upper reaches, utilized for traditional foods, medicinal uses, and cattle fodder."
  },
  {
    id: "9",
    cropName: "Hill Ginger",
    soilType: "Rich sandy loam with high humus content",
    season: "Kharif",
    waterRequirement: "High (Requires regular moisture but zero water stagnation)",
    fertilizer: "Leaf mold compost, neem cake, and bio-manures",
    description: "A high-value spice cash crop grown in lower altitude slopes, known for its strong aroma and sharp heat."
  },
  {
    id: "10",
    cropName: "Hill Garlic",
    soilType: "Loose, well-drained loamy soil",
    season: "Rabi",
    waterRequirement: "Moderate (Grown under systematic moisture cycles)",
    fertilizer: "Decomposed poultry manure, wood ash, and cow dung slurry",
    description: "Winter hill garlic cultivar known for small cloves with intense pungent flavor and medicinal properties."
  }
];
