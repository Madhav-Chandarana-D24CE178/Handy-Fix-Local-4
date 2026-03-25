import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

export const services = [
  { id: 1, name: "AC Repair", pros: "48", price: "₹299", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80" },
  { id: 2, name: "Plumber", pros: "62", price: "₹199", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
  { id: 3, name: "Electrician", pros: "55", price: "₹249", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80" },
  { id: 4, name: "Carpenter", pros: "38", price: "₹349", img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&q=80" },
  { id: 5, name: "Painter", pros: "29", price: "₹499", img: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80" },
  { id: 6, name: "Deep Clean", pros: "34", price: "₹799", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80" },
  { id: 7, name: "Appliance Repair", pros: "41", price: "₹249", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" },
  { id: 8, name: "Pest Control", pros: "22", price: "₹399", img: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=300&q=80" },
];

const ServicesGrid = () => {
  const { isLoggedIn, setSelectedService } = useApp();
  const navigate = useNavigate();

  const handleServiceClick = (service: any) => {
    if (isLoggedIn) {
      setSelectedService(service);
      navigate(`/service/${service.id}`);
    } else {
      window.dispatchEvent(new CustomEvent('open-auth-modal'));
    }
  };

  return (
    <section className="py-24 bg-card" id="services">
      <div className="container">
        <span className="text-primary text-[11px] font-extrabold tracking-[2px] uppercase block mb-3">OUR SERVICES</span>
        <h2 className="font-heading text-3xl lg:text-[34px] font-extrabold mb-4">Every home service, one tap away</h2>
        <p className="text-muted-foreground text-lg mb-12">Trusted professionals for every corner of your home</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.name}
              onClick={() => handleServiceClick(s)}
              className="reveal group bg-card rounded-xl overflow-hidden shadow-md border-b-[3px] border-transparent hover:border-primary hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="h-40 overflow-hidden">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400" loading="lazy" />
              </div>
              <div className="p-5 flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-[15px] font-bold mb-1">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{s.pros} pros available</p>
                  <span className="font-bold text-primary text-[13px]">From {s.price}</span>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-lg mt-1">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#" className="text-primary font-heading font-bold hover:underline">View all 24 services →</a>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
