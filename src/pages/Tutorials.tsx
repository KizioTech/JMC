import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import TutorialCard from "@/components/tutorials/TutorialCard";
import SubjectArt from "@/components/library/SubjectArt";
import { Clock, Star, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllTutorials } from "@/services/contentService";
import { TutorialCardSkeleton } from "@/components/ui/Skeletons";

const Tutorials = () => {
  const { data: tutorials = [], isLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: getAllTutorials,
  });

  const featuredTutorial = tutorials.length > 0 ? tutorials[0] : null;
  const restTutorials = tutorials.length > 0 ? tutorials.slice(1) : [];

  return (
    <Layout>
      <main className="min-h-screen bg-[#F5F6FA]">
        <PageHeader
          index="005"
          eyebrow="Tutorials"
          title={
            <>
              Step by step,<br />start to finish.
            </>
          }
          description="Guided walkthroughs that build understanding one step at a time — from first principles to worked proofs."
        />

        {/* Featured tutorial */}
        {(isLoading || featuredTutorial) && (
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-14">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="font-code text-[11px] font-bold tracking-wide text-white bg-[#0A0A0F] px-2 py-1">
                FEATURED
              </span>
              <span className="font-code text-[11px] font-bold tracking-[0.25em] text-[#0A0A0F]/50 uppercase">
                Start here
              </span>
            </div>

            {isLoading ? (
              <div className="animate-pulse bg-white rounded-2xl h-56 w-full border border-[#0A0A0F]/10" />
            ) : featuredTutorial ? (
              <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-[#0A0A0F]/10 bg-white shadow-sm">
                <div className="flex-1 p-8 md:p-10">
                  <span className="inline-block font-code text-[10px] font-bold uppercase tracking-wider text-[#4338FF] bg-[#4338FF]/10 px-2.5 py-1 mb-4">
                    Most popular
                  </span>
                  <h3 className="font-inter text-2xl md:text-3xl font-bold text-[#0A0A0F] mb-3">
                    {featuredTutorial.title}
                  </h3>
                  <p className="text-[14px] text-[#0A0A0F]/60 mb-6 max-w-lg leading-relaxed">
                    {featuredTutorial.description || "Learn this topic in depth."}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-7">
                    {featuredTutorial.duration_text && (
                      <div className="flex items-center gap-1.5 font-code text-[11px] uppercase tracking-wider text-[#0A0A0F]/50">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredTutorial.duration_text}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 font-code text-[11px] uppercase tracking-wider text-[#0A0A0F]/50">
                      {featuredTutorial.subjects?.name}
                    </div>
                    {featuredTutorial.rating && (
                      <div className="flex items-center gap-1.5 font-code text-[11px] uppercase tracking-wider text-[#0A0A0F]/50">
                        <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                        {featuredTutorial.rating}
                      </div>
                    )}
                  </div>
                  <Link to={`/tutorials/${featuredTutorial.subjects?.slug}/${featuredTutorial.slug}`}>
                    <button className="flex items-center gap-2 bg-[#4338FF] text-white px-6 py-3 font-code text-[11px] font-bold uppercase tracking-wider hover:bg-[#3730E8] transition-colors">
                      Start learning
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                <div className="hidden md:block w-72 shrink-0 relative">
                  <SubjectArt subject={featuredTutorial.subjects?.name} />
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* All tutorials */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-inter text-2xl font-bold text-[#0A0A0F]">All tutorials</h2>
            {!isLoading && (
              <span className="font-code text-[10px] text-[#0A0A0F]/35">
                {restTutorials.length} {restTutorials.length === 1 ? "tutorial" : "tutorials"}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <TutorialCardSkeleton key={i} />
              ))}
            </div>
          ) : tutorials.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-[#0A0A0F]/15">
              <p className="font-inter text-xl font-bold text-[#0A0A0F] mb-1">No tutorials yet.</p>
              <p className="font-code text-[12px] text-[#0A0A0F]/50">Check back soon.</p>
            </div>
          ) : restTutorials.length === 0 ? (
            <p className="text-center text-[#0A0A0F]/50 py-12 font-code text-[12px]">
              That's everything for now — check back for more tutorials soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restTutorials.map((tutorial, i) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} position={i + 1} />
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Tutorials;