export function StatGrid() {
  const stats = [
    {
      number: "15,420+",
      label: "Supporters"
    },
    {
      number: "£2.8M",
      label: "Annual Cost to Taxpayers"
    },
    {
      number: "47",
      label: "Articles Published"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
