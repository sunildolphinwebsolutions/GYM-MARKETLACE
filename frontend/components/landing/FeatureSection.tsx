import Image from 'next/image';

export default function FeatureSection() {
    return (
        <section className="py-24 bg-brand-black w-full">
            <div className="w-full px-6 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase tracking-tight">
                        Why Choose <span className="text-brand-yellow">Gym Access</span>?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We connect you with the best fitness facilities without the hassle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">

                    {/* Card 1: Large - Premium Equipment */}
                    <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-gray-800">
                        <Image
                            src="/img/feature-workout.png"
                            alt="Premium Equipment"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-10">
                            <h3 className="text-3xl font-bold text-white mb-3">Premium Equipment</h3>
                            <p className="text-gray-300 text-lg max-w-md">Train with state-of-the-art machinery and Olympic-grade weights.</p>
                        </div>
                    </div>

                    {/* Card 2: Tall - Expert Guidance */}
                    <div className="md:col-span-1 relative group overflow-hidden rounded-2xl border border-gray-800">
                        <Image
                            src="/img/charles-gaudreault-xXofYCc3hqc-unsplash.jpg"
                            alt="Expert Guidance"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="bg-brand-yellow text-black text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">PRO TRAINERS</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Expert Guidance</h3>
                            <p className="text-gray-300 text-sm">Access top-tier coaches.</p>
                        </div>
                    </div>

                    {/* Card 3: Tall - Vibrant Community */}
                    <div className="md:col-span-1 relative group overflow-hidden rounded-2xl border border-gray-800">
                        <Image
                            src="/img/feature-community.png"
                            alt="Vibrant Community"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <div className="bg-brand-yellow text-black text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">COMMUNITY</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Vibrant Community</h3>
                            <p className="text-gray-300 text-sm">Join like-minded athletes.</p>
                        </div>
                    </div>

                    {/* Card 4: Large - Results Driven */}
                    <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-gray-800">
                        <Image
                            src="/img/luke-witter-k47w6BeapCs-unsplash.jpg"
                            alt="Results Driven"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-10">
                            <h3 className="text-3xl font-bold text-white mb-3">Results Driven</h3>
                            <p className="text-gray-300 text-lg max-w-md">Environment designed for your success, whether building muscle or endurance.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
