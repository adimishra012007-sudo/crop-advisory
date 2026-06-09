import FeatureCard from "./FeatureCard";

// Features section to group 4 distinct advisory services
export default function Features() {
  const services = [
    {
      title: "Crop Disease Guidance",
      description:
        "Instantly detect and manage diseases affecting regional hill crops, including Apple Scab, Potato Blight, and Finger Millet (Mandua) leaf spots.",
      icon: "🍂",
    },
    {
      title: "Pest Management",
      description:
        "Get natural and chemical control solutions for pests like whiteflies, stem borers, and aphids commonly attacking high-altitude crops.",
      icon: "🐛",
    },
    {
      title: "Irrigation Advice",
      description:
        "Watering tips adapted for terrace farming and sloped fields in Uttarakhand to preserve soil health and prevent runoff.",
      icon: "💧",
    },
    {
      title: "Organic Farming Tips",
      description:
        "Incorporate traditional, organic compost systems (Bijamrit and Jivamrit) and crop rotation rules optimized for mountain soils.",
      icon: "🌾",
    },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Solutions for{" "}
            <span className="text-emerald-600">Mountain Farming</span>
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Interact with our AI chatbot to receive customized solutions for the unique challenges of Uttarakhand's agricultural ecosystems.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <FeatureCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
