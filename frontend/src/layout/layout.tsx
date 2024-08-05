import Footer from "@/components/Footer";
import Headers from "@/components/Headers"
import Hero from "@/components/Hero";

type Props={
    children: React.ReactNode;
    showHero?: boolean;
}

const Layout = ({children, showHero=false}:Props) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Headers/>
        {showHero && <Hero/>}
        <div className="container mx-auto flex-1 py-10">
          {children}
        </div>
        <Footer/>
    </div>
  )
}

export default Layout

