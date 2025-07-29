'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './Nav.css'

const Nav = () => {
  const pathname = usePathname()

  const menuLinks = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
  ]

  const menuContainer = useRef()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [shouldDelayClose, setShouldDelayClose] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const previousPathRef = useRef(pathname)
  const scrollPositionRef = useRef(0)
  const lastScrollY = useRef(0)

  const menuAnimation = useRef()
  const menuLinksAnimation = useRef()
  const menuBarAnimation = useRef()
  const menuBarRef = useRef()

  // Prevent scrolling when menu is open
  const toggleBodyScroll = (disableScroll) => {
    if (disableScroll) {
      scrollPositionRef.current = window.pageYOffset
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
    } else {
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('position')
      document.body.style.removeProperty('top')
      document.body.style.removeProperty('width')
      window.scrollTo(0, scrollPositionRef.current)
    }
  }

  const toggleMenu = () => {
    document.querySelector('.hamburger-icon')?.classList.toggle('active')
    const newMenuState = !isMenuOpen
    setIsMenuOpen(newMenuState)
    toggleBodyScroll(newMenuState)
  }

  const closeMenu = () => {
    if (isMenuOpen) {
      document.querySelector('.hamburger-icon')?.classList.toggle('active')
      setIsMenuOpen(false)
      toggleBodyScroll(false)
    }
  }

  const handleLinkClick = (path) => {
    if (path !== pathname) {
      setShouldDelayClose(true)
    }
  }

  // Watch route changes
  useEffect(() => {
    if (pathname !== previousPathRef.current && shouldDelayClose) {
      const timer = setTimeout(() => {
        closeMenu()
        setShouldDelayClose(false)
      }, 700)

      previousPathRef.current = pathname
      return () => clearTimeout(timer)
    }

    previousPathRef.current = pathname
  }, [pathname, shouldDelayClose])

  // Handle resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Animate scroll hide/show for menu bar
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return

      const currentScrollY = window.scrollY
      gsap.to('.menu-bar', {
        y: currentScrollY > lastScrollY.current ? -200 : 0,
        duration: 1,
        ease: 'power2.out',
      })

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMenuOpen])

  // Clean up fixed body on unmount
  useEffect(() => {
    return () => {
      if (document.body.style.position === 'fixed') {
        toggleBodyScroll(false)
      }
    }
  }, [])

  // GSAP animations using useGSAP
  useGSAP(() => {
    gsap.set('.menu-link-item-holder', { y: 125 })

    menuAnimation.current = gsap
      .timeline({ paused: true })
      .to('.menu', {
        duration: 1,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        ease: 'power4.inOut',
      })

    const heightValue =
      windowWidth < 1000 ? 'calc(100% - 2.5em)' : 'calc(100% - 4em)'

    menuBarAnimation.current = gsap
      .timeline({ paused: true })
      .to('.menu-bar', {
        duration: 1,
        height: heightValue,
        ease: 'power4.inOut',
      })

    menuLinksAnimation.current = gsap
      .timeline({ paused: true })
      .to('.menu-link-item-holder', {
        y: 0,
        duration: 1.25,
        stagger: 0.075,
        ease: 'power3.inOut',
        delay: 0.125,
      })
  }, [windowWidth])

  // Trigger animation on menu open/close
  useEffect(() => {
    if (isMenuOpen) {
      menuAnimation.current?.play()
      menuBarAnimation.current?.play()
      menuLinksAnimation.current?.play()
    } else {
      menuAnimation.current?.reverse()
      menuBarAnimation.current?.reverse()
      menuLinksAnimation.current?.reverse()
    }
  }, [isMenuOpen])

  return (
    <div className="menu-container" ref={menuContainer}>
      <div className="menu-bar" ref={menuBarRef}>
        <div className="menu-bar-container">
          <div className="menu-logo" onClick={closeMenu}>
            <Link href="/">
              <h4>Palmer</h4>
            </Link>
          </div>
          <div className="menu-actions">
            <div className="menu-toggle">
              <button className="hamburger-icon" onClick={toggleMenu}></button>
            </div>
          </div>
        </div>
      </div>
      <div className="menu">
        <div className="menu-col">
          <div className="menu-sub-col">
            <div className="menu-links">
              {menuLinks.map((link, index) => (
                <div key={index} className="menu-link-item">
                  <div className="menu-link-item-holder">
                    <Link
                      className="menu-link"
                      href={link.path}
                      onClick={() => handleLinkClick(link.path)}
                    >
                      {link.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nav