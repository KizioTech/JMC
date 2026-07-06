import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { socialLinks } from "@/components/ui/social-icons";

const fieldClass =
  "rounded-none border-2 border-[#0A0A0F]/15 bg-white font-code text-[13px] text-[#0A0A0F] placeholder:text-[#0A0A0F]/35 focus-visible:border-[#4338FF] focus-visible:ring-0 focus-visible:ring-offset-0";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      code: "MAIL",
      title: "Email us",
      details: "info.jmcacademics@gmail.com",
      description: "We'll respond within 24 hours.",
    },
    {
      icon: Phone,
      code: "CALL",
      title: "Call us",
      details: "+265 999 978 828",
      description: "Mon–Fri, 9am–5pm CAT.",
    },
    {
      icon: MapPin,
      code: "SITE",
      title: "Location",
      details: "Malawi",
      description: "Available worldwide, online.",
    },
  ];

  return (
    <Layout>
      <main className="min-h-screen bg-[#F5F6FA]">
        <PageHeader
          index="002"
          eyebrow="Contact"
          title={
            <>
              Let's talk<br />math.
            </>
          }
          description="Questions about courses, resources, or JMC Plus? Reach out — we read every message and reply within a day."
        />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14">
          {/* Contact info cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-14">
            {contactInfo.map((info, i) => (
              <div
                key={info.title}
                className="group relative flex flex-col gap-3 rounded-2xl border border-[#0A0A0F]/10 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-[0_16px_32px_-12px_rgba(10,10,15,0.16)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-code text-[11px] font-bold tracking-wide text-[#4338FF]">
                    {info.code}·{String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4338FF]/10">
                    <info.icon className="w-4 h-4 text-[#4338FF]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-inter text-[17px] font-bold text-[#0A0A0F] mb-1">{info.title}</h3>
                  <p className="text-[14px] font-medium text-[#0A0A0F] mb-1">{info.details}</p>
                  <p className="text-[13px] text-[#0A0A0F]/55">{info.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border-2 border-[#0A0A0F] p-8">
              <div className="mb-8">
                <span className="font-code text-[10px] font-bold tracking-[0.25em] text-[#4338FF] uppercase">
                  Send a message
                </span>
                <h2 className="font-inter text-2xl font-bold text-[#0A0A0F] mt-2 mb-1">We'd love to hear from you.</h2>
                <p className="text-[14px] text-[#0A0A0F]/55">Fill out the form and we'll get back to you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-code text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F]/50 mb-2">
                      Your name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className={fieldClass}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-code text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F]/50 mb-2">
                      Your email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className={fieldClass}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-code text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F]/50 mb-2">
                    Subject
                  </label>
                  <Input
                    type="text"
                    placeholder="How can we help?"
                    className={fieldClass}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block font-code text-[11px] font-bold uppercase tracking-wider text-[#0A0A0F]/50 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Your message..."
                    className={fieldClass}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#4338FF] text-white py-3.5 font-code text-[11px] font-bold uppercase tracking-wider hover:bg-[#3730E8] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send message
                </button>
              </form>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-center">
              <Clock className="w-4 h-4 text-[#0A0A0F]/40" />
              <p className="font-code text-[11px] uppercase tracking-wider text-[#0A0A0F]/45">
                Typical response time: 24–48 hours
              </p>
            </div>

            {/* Social connect */}
            <div className="mt-8 border-t border-[#0A0A0F]/10 pt-8">
              <p className="font-code text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A0A0F]/45 text-center mb-4">
                Or connect on social
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map(({ name, href, Icon, color }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    title={name}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0A0A0F]/10 bg-white text-[#0A0A0F]/55 text-[13px] font-medium transition-all duration-200 hover:border-[#4338FF]/40 hover:shadow-sm ${color}`}
                  >
                    <Icon size={15} />
                    <span>{name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Contact;