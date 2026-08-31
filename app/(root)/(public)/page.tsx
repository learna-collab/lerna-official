import ServicesShowcase from "@/components/Service-Switcher";
import Hero from "@/components/section/Heroes";
import FeaturedPosts from "@/components/section/blog-preview";
import ServicesSwitcher from "@/components/services-switcher";

export default function Home() {
  return (
    <main>
      <Hero />

      <ServicesShowcase />
      <FeaturedPosts />
    </main>
  );
}
