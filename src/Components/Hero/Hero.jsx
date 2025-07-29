import React from 'react'
import './Hero.css'
function Hero() {
    return (
        <section className="hero">
            <div className="hero-img">
                <img src="/home/hero.jpg" alt="" />
            </div>

            <div className="hero-header">
                <AnimatedCopy tag="h1" animateOnScroll={false} delay={0.7}>
                    Nico
                </AnimatedCopy>
                <AnimatedCopy tag="h1" animateOnScroll={false} delay={0.8}>
                    Palmer
                </AnimatedCopy>
            </div>
        </section>
    )
}

export default Hero