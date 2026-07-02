import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Particles from "@/components/ui/Particles";
import { GraduationCap, Activity, Calendar, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden hero-gradient">
          <Particles />
          <div className="absolute inset-0 z-0">
            <img 
              alt="Modern study environment with mathematical graphs" 
              className="w-full h-full object-cover opacity-40" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5_HOwdJODMA0-RBd8mfPpgF4Cb7Hxs_ecD-pRGU1F5mal8wHsQIn7GkBgkJPuDP7pzmlDV9UWIqxd2CShsLemRM98LDy1DZ4ez3cyzPxqxiydY516Tu6PL9Flq52gufGtCtLeB5-N2KUUEw3pbdz_U2H84h4Yct6DBvvqlPlEV9v--4rprtgWASaWdVMHLjfJzbVd56Hw35vIVYNEzfVqpNN2C_vEvoJJDagu5F74tF7HXIPtWqSwrSxHSwVgsqSeJVKSLT5WIjw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-transparent to-surface"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-margin-mobile py-stack-lg">
            <span className="inline-block px-4 py-1.5 mb-stack-sm bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps rounded-full animate-fade-in-up">
              ACADEMIC EXCELLENCE
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md leading-tight">
              Master Mathematics <br className="hidden md:block"/> with Precision.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-2xl mx-auto">
              Expert-led courses, interactive tutorials, and comprehensive academic notes for students who aim for excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses" className="w-full sm:w-auto">
                <button className="w-full px-10 py-4 bg-primary text-on-primary font-headline-h3 text-headline-h3 rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200">
                  Explore Courses
                </button>
              </Link>
              <Link to="/tutorials" className="w-full sm:w-auto">
                <button className="w-full px-10 py-4 bg-surface/80 backdrop-blur-md border border-outline-variant text-primary font-headline-h3 text-headline-h3 rounded-lg hover:bg-surface-container-low active:scale-95 transition-all duration-200">
                  View Tutorials
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stat Strip */}
        <section className="bg-primary-container py-12 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col gap-1">
              <span className="font-headline-h2 text-headline-h2 text-primary-fixed">50+</span>
              <span className="font-label-caps text-label-caps text-on-primary-container">Free Courses</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-h2 text-headline-h2 text-primary-fixed">10K+</span>
              <span className="font-label-caps text-label-caps text-on-primary-container">Students</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-h2 text-headline-h2 text-primary-fixed">200+</span>
              <span className="font-label-caps text-label-caps text-on-primary-container">Resources</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline-h2 text-headline-h2 text-primary-fixed">95%</span>
              <span className="font-label-caps text-label-caps text-on-primary-container">Success Rate</span>
            </div>
          </div>
        </section>

        {/* Why Choose Us Bento */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-stack-lg">
              <h2 className="font-headline-h1 text-headline-h1 text-primary mb-4">Why Choose JMC Academics?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                We combine traditional academic rigor with modern digital learning tools to provide an unparalleled educational experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-2 gap-6">
              {/* Large Card */}
              <div className="md:col-span-2 md:row-span-2 bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                <div>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-on-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline-h2 text-headline-h2 mb-4">Expert Instructors</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                    Learn from PhD holders and industry experts who specialize in breaking down complex mathematical concepts into digestible, applicable knowledge. Our pedagogy is rooted in clarity and deep understanding.
                  </p>
                </div>
                <div className="w-full h-48 bg-surface-container-high rounded-lg overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt="A professional instructor teaching complex calculus formulas" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASovT1DLwe7keVio4VwbdHbGQROmtH0fOhTNMa_9Ze_EgOftTHN8Z4SZgAvpkPxQ9CnoqapH86F2Nd7rR6zHJ-LxULuac330e6QXP1LUlbPtEOyQ4byYCdxrPZx0qsxEjVJHZLQftVvwssSt6NFzUROMluHaX1fnBIv-08_XaAduBGF3KQE51A261aPZtBSAC5HoA_cPyuyh3qgvDSZLhCoZXN-cfsAC_Yaye1Tx2amIdKy2VmmFiT_w3Vg3Ov3Z6JpUo_H5qrYOk"
                  />
                </div>
              </div>

              {/* Wide Card */}
              <div className="md:col-span-2 bg-example-amber border border-intermediate-yellow/30 rounded-xl p-8 flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
                <div className="flex-1">
                  <h3 className="font-headline-h3 text-headline-h3 text-on-surface mb-2">Interactive Learning</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Step-by-step visualizations and real-time feedback systems help you master proofs and equations effectively.
                  </p>
                </div>
                <Activity className="text-intermediate-yellow w-12 h-12 opacity-40 group-hover:scale-110 transition-transform" />
              </div>

              {/* Small Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col justify-center items-center text-center group hover:translate-y-[-4px] transition-all duration-300">
                <Calendar className="text-primary w-8 h-8 mb-4" />
                <h4 className="font-label-caps text-label-caps mb-2">Flexible Schedule</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Learn at your own pace with lifetime access.</p>
              </div>

              {/* Small Card 2 */}
              <div className="bg-primary-container rounded-xl p-8 flex flex-col justify-center items-center text-center group hover:translate-y-[-4px] transition-all duration-300">
                <Users className="text-primary-fixed w-8 h-8 mb-4" />
                <h4 className="font-label-caps text-label-caps mb-2 text-on-primary-container">Community Support</h4>
                <p className="font-body-sm text-body-sm text-on-primary-container/80">Connect with fellow students and mentors.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path Timeline */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-lowest overflow-hidden">
          <div className="max-w-container-max mx-auto">
            <div className="mb-stack-lg">
              <h2 className="font-headline-h1 text-headline-h1 text-primary text-center">Your Path to Mastery</h2>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 py-8">
              {/* Timeline Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
              
              {/* Beginner */}
              <div className="relative z-10 flex flex-col items-center max-w-[240px] text-center">
                <div className="w-12 h-12 bg-beginner-green text-on-primary rounded-full flex items-center justify-center mb-4 font-bold shadow-lg">1</div>
                <div className="bg-surface border border-outline-variant p-4 rounded-lg shadow-sm">
                  <span className="block font-label-caps text-label-caps text-beginner-green mb-1">BEGINNER</span>
                  <h4 className="font-headline-h3 text-headline-h3 mb-2">Foundations</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Master algebra, trigonometry, and the basics of logic.</p>
                </div>
              </div>
              
              {/* Intermediate */}
              <div className="relative z-10 flex flex-col items-center max-w-[240px] text-center">
                <div className="w-12 h-12 bg-intermediate-yellow text-on-primary rounded-full flex items-center justify-center mb-4 font-bold shadow-lg">2</div>
                <div className="bg-surface border border-outline-variant p-4 rounded-lg shadow-sm">
                  <span className="block font-label-caps text-label-caps text-intermediate-yellow mb-1">INTERMEDIATE</span>
                  <h4 className="font-headline-h3 text-headline-h3 mb-2">Application</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Apply calculus and linear algebra to real-world modeling.</p>
                </div>
              </div>
              
              {/* Advanced */}
              <div className="relative z-10 flex flex-col items-center max-w-[240px] text-center">
                <div className="w-12 h-12 bg-advanced-red text-on-primary rounded-full flex items-center justify-center mb-4 font-bold shadow-lg">3</div>
                <div className="bg-surface border border-outline-variant p-4 rounded-lg shadow-sm">
                  <span className="block font-label-caps text-label-caps text-advanced-red mb-1">ADVANCED</span>
                  <h4 className="font-headline-h3 text-headline-h3 mb-2">Mastery</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Deep dive into differential equations and analysis.</p>
                </div>
              </div>
              
              {/* Expert */}
              <div className="relative z-10 flex flex-col items-center max-w-[240px] text-center">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mb-4 font-bold shadow-lg">4</div>
                <div className="bg-surface border border-outline-variant p-4 rounded-lg shadow-sm">
                  <span className="block font-label-caps text-label-caps text-primary mb-1">EXPERT</span>
                  <h4 className="font-headline-h3 text-headline-h3 mb-2">Proofs</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Engage with abstract algebra and rigorous formal proofs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-h2 text-headline-h2 text-center mb-stack-lg">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-outline-variant shrink-0">
                    <img className="w-full h-full object-cover" alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIihTi_kn9LjXEWqhrZHnqjCETg7y0XTLh2x_DyaBgcQcabVz3W_ccgZzS0WRVarZzdm1rcFXdHsjJQr1f2n7hGG5GXSf8eSJnL7r9vDLHVMh2nIY2ts31Vs-HIs5hWW2ZCdnDAL2ncr-t2zQZ4aXeFWMe8kKu9-FHtvMTLNjGGnkCMleQAm0zuRUyjmec8Z4253fR7QLLV0KaS1rhu-PHX4tO5GbHVxy4Sd0Y76pWHNfSwWeobLFcTr9nrp-Z_6n0XZB3KRqIJ_c"/>
                  </div>
                  <div>
                    <h4 className="font-headline-h3 text-headline-h3 text-[16px]">Sarah Jenkins</h4>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">MIT Undergraduate</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md italic text-on-surface-variant leading-relaxed">
                  "The Calculus series on JMC Academics was the turning point for my engineering degree. The precision and clarity are unmatched compared to standard lectures."
                </p>
              </div>

              <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-outline-variant shrink-0">
                    <img className="w-full h-full object-cover" alt="David Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeNVr_XWuVM6exQ7dz7f4BNkpUk4iKDJddpm4fq0MoPc7g2TSP6kZniqIwkBcqAIt0M8hSOvmPZmtuEIS9v7ZfjDZV1lotGxR9HDncPr28f0YsXRCRmTvu_5G7Mws5hoTt9l5SKTqjCPoQdG19a0U4rNQeCjnM2vSKFttQuDEojxi7WuQfZb4ik3sUl6eMoiHAb8daNjIUH6Mp1oFU1UNyV8qeLqIyWsUCh_xsB6jb94rRpG5GcRbiAdHYFicxIYCnvEcHv-oOmT0"/>
                  </div>
                  <div>
                    <h4 className="font-headline-h3 text-headline-h3 text-[16px]">David Chen</h4>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Graduate Student</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md italic text-on-surface-variant leading-relaxed">
                  "Complex analysis felt like a mountain until I found these resources. The interactive visualizations make abstract concepts feel tangible and clear."
                </p>
              </div>

              <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-outline-variant shrink-0">
                    <img className="w-full h-full object-cover" alt="Elena Rodriguez" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0I5ikIxq_UkP4merIguJHt-1pJGdxyapDYoAkmcnXs5eprXyU74BPGKiKCkHFx9-HM5p3Bfx_BiILVKx2QrO35E2U3CYdJwfiVajIJ9o0RMfSoLtT4VBWCL80bX8KntvqF1RW0jdKrUq_vXlPLgNXdbosgXnPSvHB7xKPYQFEIxUzjUmMbSaVkX4ThTat6JU_skcpqBdN_o-vp7N_iR-oKaDBaBFAiNtpSp8lhBmqZrvddB4S1e5y8VUu0GUiUT0RKjnqzhXB6UA"/>
                  </div>
                  <div>
                    <h4 className="font-headline-h3 text-headline-h3 text-[16px]">Elena Rodriguez</h4>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Data Scientist</p>
                  </div>
                </div>
                <p className="font-body-md text-body-md italic text-on-surface-variant leading-relaxed">
                  "The transition from theoretical math to applied statistics was made seamless through JMC. I highly recommend their community support forums for deep learning."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop text-center bg-primary-container relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#dae2fd_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display-lg-mobile md:font-display-lg text-on-primary-fixed mb-4">Ready to Start Your Journey?</h2>
            <p className="font-body-lg text-on-primary-container mb-stack-md">
              Join over 10,000 students mastering mathematics today. Access premium resources and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses" className="w-full sm:w-auto">
                <button className="w-full px-10 py-4 bg-secondary text-on-secondary font-headline-h3 text-headline-h3 rounded-lg hover:brightness-110 active:scale-95 transition-all">
                  Enroll Now
                </button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full px-10 py-4 border border-on-primary-container text-on-primary-container font-headline-h3 text-headline-h3 rounded-lg hover:bg-white/5 active:scale-95 transition-all">
                  Schedule a Demo
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Index;
