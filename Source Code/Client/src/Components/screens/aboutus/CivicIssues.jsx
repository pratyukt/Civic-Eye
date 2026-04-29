import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useEffect, useState } from "react";
import {
    backgroundGradients,
    headerContent,
    problemCategories
} from "../../../data/aboutUsData";

export default function CivicIssues() {
    const [scrollY, setScrollY] = useState(0);
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);

            const scrollProgress = currentScrollY / (document.body.scrollHeight - window.innerHeight);
            const newBgIndex = Math.floor(scrollProgress * backgroundGradients.length) % backgroundGradients.length;
            setBgIndex(newBgIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`relative overflow-hidden  transition-all duration-1000 ease-in-out ${backgroundGradients[bgIndex]}`}>
            <div className="absolute  bg-black/40 pointer-events-none"></div>

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2text-center px-2 gap-3">
                <h1 className="text-2xl md:text-4xl  lg:text-5xl font-bold text-black drop-shadow-2xl text-shadow-lg leading-tight mt-6">
                    {headerContent.title2}
                </h1>
                <p className="text-black text-center text-sm md:text-lg  max-w-2xl mx-auto drop-shadow-xl">
                    {headerContent.subtitle}
                </p>
            </div>

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center px-4">
                <h1 className="text-2xl md:text-4xl  lg:text-5xl font-bold text-black drop-shadow-2xl text-shadow-lg leading-tight">
                    {headerContent.title1}
                </h1>
            </div>


            <ParallaxProvider>
                <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 px-2 md:px-0 relative mb-24 md:mb-36 lg:mb-48">
                    <ResponsiveImageColumn
                        problemData={problemCategories[0]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[1]}
                        speed={-40}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                        extraClasses="sm:pt-12 md:pt-24"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[2]}
                        speed={-50}
                        marginTop="mt-10 md:mt-20 lg:mt-0"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[3]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 px-2 md:px-0 relative mb-24 md:mb-36 lg:mb-48">
                    <ResponsiveImageColumn
                        problemData={problemCategories[4]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[5]}
                        speed={-40}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                        extraClasses="sm:pt-12 md:pt-24"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[0]}
                        speed={-150}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[1]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 px-2 md:px-0 relative mb-24 md:mb-36 lg:mb-48">
                    <ResponsiveImageColumn
                        problemData={problemCategories[2]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[3]}
                        speed={-40}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                        extraClasses="sm:pt-12 md:pt-24"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[4]}
                        speed={-150}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                    <ResponsiveImageColumn
                        problemData={problemCategories[5]}
                        speed={-250}
                        marginTop="mt-20 md:mt-40 lg:mt-60"
                    />
                </div>

                <div className="pb-20 md:pb-32 lg:pb-40"></div>
            </ParallaxProvider>
        </div>
    );
}

function ResponsiveImageColumn({ problemData, speed, marginTop = "", extraClasses = "" }) {
    return (
        <div className={`min-h-[200vh] sm:min-h-[300vh] lg:min-h-[400vh] w-full sm:w-auto ${extraClasses}`}>
            <div className={marginTop}>
                <Parallax speed={speed}>
                    <div className="h-[250px] w-full sm:h-[300px] sm:w-[200px] md:h-[350px] md:w-[250px] lg:h-[400px] lg:w-[300px] group relative mx-auto z-10">
                        <img
                            src={problemData.image}
                            alt={problemData.name}
                            className="h-full w-full rounded-md object-cover"
                        />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-3 md:p-6">
                            <h3 className="text-white text-lg md:text-xl font-bold">{problemData.name}</h3>
                            <p className="text-white/90 text-xs md:text-sm">{problemData.category}</p>
                        </div>
                    </div>
                </Parallax>
            </div>
        </div>
    );
}
