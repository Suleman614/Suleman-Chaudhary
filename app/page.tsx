"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Linkedin,
  Github,
  FileDown,
  ChevronDown,
  ExternalLink,
  TrendingUp,
  BarChart3,
  Code,
} from "lucide-react"

export default function Portfolio() {
  const heroRef = useRef(null)
  const skillsRef = useRef(null)
  const [activeSection, setActiveSection] = useState("about")
  const [typedText, setTypedText] = useState("")
  const [showSpaceship, setShowSpaceship] = useState(false)
  const [spaceshipAnimationComplete, setSpaceshipAnimationComplete] = useState(false)
  const [animatedName, setAnimatedName] = useState("")
  const fullText = "Data Scientist & Analyst"
  const fullName = "Suleman Chaudhary"
  const stars = useMemo(() => {
    let seed = 1337
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 2 ** 32
      return seed / 2 ** 32
    }

    return Array.from({ length: 150 }).map(() => ({
      left: `${random() * 100}%`,
      top: `${random() * 100}%`,
      animationDuration: `${random() * 3 + 2}s`,
      animationDelay: `${random() * 3}s`,
    }))
  }, [])

  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem("spaceshipAnimationPlayed")

    if (!hasAnimationPlayed) {
      setShowSpaceship(true)

      // Start animating name with lasers after spaceship arrives
      setTimeout(() => {
        let index = 0
        const nameInterval = setInterval(() => {
          if (index < fullName.length) {
            setAnimatedName(fullName.slice(0, index + 1))
            index++
          } else {
            clearInterval(nameInterval)
            // Exit spaceship after name is complete
            setTimeout(() => {
              const spaceship = document.querySelector(".spaceship")
              if (spaceship) {
                spaceship.classList.add("exiting")
              }
              setTimeout(() => {
                setShowSpaceship(false)
                setSpaceshipAnimationComplete(true)
                sessionStorage.setItem("spaceshipAnimationPlayed", "true")
              }, 1500)
            }, 500)
          }
        }, 150)
      }, 2000)
    } else {
      setSpaceshipAnimationComplete(true)
    }
  }, [])

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        heroRef.current.style.opacity = String(Math.max(0, 1 - scrolled / 500))
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const sections = ["about", "education", "experience", "projects", "professional-development", "contact"]

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -20% 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (sections.includes(sectionId)) {
            setActiveSection(sectionId)
          }
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    document.querySelectorAll(".fade-in-section").forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100 // Offset for fixed nav
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const AnimatedNumber = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0)
    const elementRef = useRef(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let startTime: number | null = null
            const animate = (currentTime: number) => {
              if (!startTime) startTime = currentTime
              const progress = Math.min((currentTime - startTime) / duration, 1)
              setCount(Math.floor(progress * end))
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            requestAnimationFrame(animate)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }, [end, duration])

    return <span ref={elementRef}>{count}</span>
  }

  const SkillBar = ({ skill, level, delay = 0 }: { skill: string; level: number; delay?: number }) => {
    const [width, setWidth] = useState(0)
    const elementRef = useRef(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setTimeout(() => {
              setWidth(level)
            }, delay)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      if (elementRef.current) {
        observer.observe(elementRef.current)
      }

      return () => observer.disconnect()
    }, [level, delay])

    return (
      <div ref={elementRef}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{skill}</span>
          <span className="text-xs text-muted-foreground">{level}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Pattern with animated gradient orbs */}
      <div className="stars">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Cosmic orbs */}
      <div className="cosmic-orb cosmic-orb-1" />
      <div className="cosmic-orb cosmic-orb-2" />
      <div className="cosmic-orb cosmic-orb-3" />

      {/* Orbiting planets */}
      <div className="planet planet-1" />
      <div className="planet planet-2" />
      <div className="planet planet-3" />
      <div className="planet planet-ring" />

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/10 shadow-2xl backdrop-blur-xl">
          {[
            { id: "about", label: "About" },
            { id: "education", label: "Education" },
            { id: "experience", label: "Experience" },
            { id: "projects", label: "Projects" },
            { id: "professional-development", label: "Professional Development" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 shadow-lg shadow-cyan-500/20"
                  : "text-white/70 hover:text-white hover:bg-white/10 border border-transparent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Spaceship Animation */}
      {showSpaceship && (
        <>
          <div className="spaceship">
            <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
              {/* Main disc body with metallic gradient */}
              <ellipse cx="60" cy="45" rx="50" ry="20" fill="url(#metalGradient)" opacity="0.95" />

              {/* Darker bottom layer for depth */}
              <ellipse cx="60" cy="48" rx="48" ry="18" fill="url(#darkMetal)" opacity="0.8" />

              {/* Top highlight layer */}
              <ellipse cx="60" cy="42" rx="45" ry="16" fill="url(#lightMetal)" opacity="0.7" />

              {/* Glass cockpit dome */}
              <ellipse cx="60" cy="35" rx="20" ry="18" fill="url(#glassGradient)" opacity="0.85" />

              {/* Inner cockpit glow */}
              <ellipse cx="60" cy="38" rx="15" ry="13" fill="url(#cockpitGlow)" opacity="0.6" />

              {/* Subtle rim lights */}
              <ellipse cx="60" cy="44" rx="50" ry="2" fill="#38bdf8" opacity="0.4" />
              <ellipse cx="60" cy="46" rx="48" ry="1.5" fill="#06b6d4" opacity="0.3" />

              {/* Bottom engine glow (subtle) */}
              <ellipse cx="60" cy="55" rx="30" ry="8" fill="url(#engineGlow)" opacity="0.5" />

              {/* Define gradients */}
              <defs>
                <linearGradient id="metalGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>

                <linearGradient id="darkMetal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                <linearGradient id="lightMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f1f5f9" opacity="0.8" />
                  <stop offset="100%" stopColor="#cbd5e1" opacity="0.3" />
                </linearGradient>

                <radialGradient id="glassGradient">
                  <stop offset="0%" stopColor="#e0f2fe" opacity="0.6" />
                  <stop offset="70%" stopColor="#7dd3fc" opacity="0.3" />
                  <stop offset="100%" stopColor="#0891b2" opacity="0.2" />
                </radialGradient>

                <radialGradient id="cockpitGlow">
                  <stop offset="0%" stopColor="#22d3ee" opacity="0.7" />
                  <stop offset="100%" stopColor="#06b6d4" opacity="0.2" />
                </radialGradient>

                <radialGradient id="engineGlow">
                  <stop offset="0%" stopColor="#38bdf8" opacity="0.6" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-slide-down">
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4 tracking-tight">
              {spaceshipAnimationComplete ? (
                fullName
              ) : animatedName ? (
                <>
                  {animatedName.split("").map((letter, i) => (
                    <span key={i} className="animated-letter" style={{ animationDelay: `${i * 0.05}s` }}>
                      {letter}
                    </span>
                  ))}
                </>
              ) : (
                <span style={{ opacity: 0 }}>{fullName}</span>
              )}
            </h1>
            <div className="h-8 flex items-center justify-center">
              <p className="text-xl md:text-2xl text-cyan-400 font-medium">
                {typedText}
                <span className="animate-blink">|</span>
              </p>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
            Transforming complex datasets into actionable insights that drive business decisions
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up delay-500">
            <Button
              size="lg"
              className="rounded-full gap-2 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 animate-pulse-subtle"
              asChild
            >
              <a href="mailto:Chaudhary.98@Buckeyemail.osu.edu">
                <Mail className="w-5 h-5" />
                Get In Touch
              </a>
            </Button>
            <Button
              size="lg"
              className="rounded-full gap-2 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 animate-pulse-subtle"
              asChild
            >
              <a href="/Suleman-Chaudhary-Resume.pdf" download="Suleman_Chaudhary_Resume.pdf">
                <FileDown className="w-5 h-5" />
                Download Resume
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 animate-fade-in-up delay-700">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full glass border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 bg-transparent transition-all duration-300 w-24 h-24 hover:scale-110"
              asChild
            >
              <a href="https://linkedin.com/in/suleman-chaudhary/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="size-[30px]" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full glass border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 bg-transparent transition-all duration-300 w-24 h-24 hover:scale-110"
              asChild
            >
              <a href="mailto:Chaudhary.98@Buckeyemail.osu.edu">
                <Mail className="size-[30px]" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full glass border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 bg-transparent transition-all duration-300 w-24 h-24 hover:scale-110"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="size-[30px]" />
              </a>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 scroll-indicator">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 space-y-32">
        {/* About Section */}
        <section id="about" className="fade-in-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-cyan-500/20">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                About
              </h2>
              <p className="text-sm text-muted-foreground">A bit about myself</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-8 md:p-12 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {"I'm an "}
              <span className="text-cyan-400 font-semibold">Information Systems undergraduate</span>
              {" at "}
              <span className="text-cyan-400 font-semibold">Ohio State University</span>
              {", pursuing my bachelor's degree with an expected graduation in "}
              {"December 2026"}
              {". My focus is on "}
              <span className="text-emerald-400 font-semibold">data analytics and data science</span>
              {
                ", with an emphasis on applying data to real world problems through analysis, experimentation, and clear communication."
              }
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {"I've built experience across the analytics workflow, from "}
              <span className="text-emerald-400 font-semibold">data wrangling and exploratory analysis</span>
              {" to "}
              <span className="text-emerald-400 font-semibold">modeling and visualization</span>
              {", through coursework, projects, and leadership. I'm actively involved in the "}
              <span className="text-blue-400 font-semibold">Big Data and Analytics Association</span>
              {", where I help lead the "}
              <span className="text-blue-400 font-semibold">Data Science track</span>
              {" by supporting hands on learning through workshops and collaborative projects. I've also competed in "}
              <span className="text-cyan-400 font-semibold">HackOHI/O</span>
              {", working in team based, time constrained environments to develop practical, impact driven solutions."}
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {"Outside of academics and analytics, I'm an "}
              <span className="text-purple-400 font-semibold">amateur competitive gamer</span>
              {
                ", which has shaped how I think about strategy, pattern recognition, and performance under pressure. I'm driven by curiosity, continuous learning, and environments where data meaningfully informs decisions."
              }
            </p>
            <p className="text-lg text-cyan-400 font-semibold mt-8 leading-relaxed">
              Actively seeking Data Analyst, Business Analyst, and Data Science internship opportunities for Summer
              2026.
            </p>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="fade-in-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-cyan-500/20">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Education
              </h2>
              <p className="text-sm text-muted-foreground">Academic background</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-8 md:p-12 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  The Ohio State University – Fisher College of Business
                </h3>
                <p className="text-lg text-cyan-400 font-semibold">B.S. Information Systems</p>
              </div>
              {/* CHANGE: Updated styling to match Relevant Coursework section */}
              <div className="flex flex-col gap-1 text-right shrink-0">
                <div className="text-xl font-bold text-foreground">Expected Graduation</div>
                <div className="text-xl font-bold text-foreground">December 2026</div>
                <div className="text-xl font-bold text-foreground mt-2">GPA: 3.97 • Dean&apos;s List</div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-foreground mb-4">Relevant Coursework</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">CSE 2123</span> — Data Structures Using Java
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">CSE 2111</span> — Modeling & Problem Solving with
                  Spreadsheets and Databases
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">BUSOBA 2320</span> — Statistical Techniques
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">BUSOBA 2321</span> — Business Analytics
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">BUSMGMT 3332</span> — Predictive Analytics
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">CSE 3241</span> — Introduction to Database Systems
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">BUSOBA 4331</span> — Data Management & Descriptive
                  Analytics
                </div>
                <div className="text-muted-foreground">
                  <span className="text-cyan-400 font-semibold">ACCTMIS 3620</span> — Foundations of Information Systems
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="fade-in-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-cyan-500/20">
              <Briefcase className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Work Experience
              </h2>
              <p className="text-sm text-muted-foreground">My career as a data professional</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500" />
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-semibold group-hover:text-cyan-400 transition-colors">
                      Data Analyst Intern
                    </h3>
                    <BarChart3 className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <p className="text-lg text-cyan-400 mb-2">Indiana Pacers</p>
                </div>
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  Jan 2026 - Apr 2026
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Working with the Pacers analytics team on player performance analysis, game strategy optimization, and
                data-driven insights for basketball operations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Python
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  SQL
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Tableau
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Predictive Modeling
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Feature Engineering
                </span>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                    E-Commerce Data Analyst
                  </h3>
                  <p className="text-lg text-cyan-400 mb-2">Aizen LLC</p>
                </div>
                <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  Mar 2022 - Dec 2025
                </span>
              </div>
              <ul className="space-y-3 text-muted-foreground leading-relaxed mb-4">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Applied <span className="text-cyan-400 font-semibold">data driven decision making</span> by building
                    KPI dashboards in Excel and Tableau to track sales trends, inventory turnover, and customer
                    retention, enabling timely adjustments to marketing and pricing strategies
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Designed and executed <span className="text-blue-400 font-semibold">A/B tests</span> on product
                    listing layouts, using statistical analysis to determine significance, leading to a{" "}
                    <span className="text-blue-400 font-semibold">9% increase in click through rate</span> on select
                    product listings and increased monthly revenue
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Wrote <span className="text-purple-400 font-semibold">SQL queries</span> to extract and segment
                    sales and customer data from multiple sources, using Excel pivot tables, XLOOKUP, and trend analysis
                    to identify patterns that improved repeat purchase rates by{" "}
                    <span className="text-purple-400 font-semibold">7%</span>
                  </span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  SQL
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  Google Analytics
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Shopify
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Excel
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Tableau
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="fade-in-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-cyan-500/20">
              <Code className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-sm text-muted-foreground">Data science and analytics work</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-8 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-2 group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                  United States Emissions Breakdown
                </h3>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <span className="text-sm font-semibold text-emerald-400">EPA Environmental Analytics</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Built an interactive analytics dashboard using EPA emissions data to examine greenhouse gas emissions
                across the continental United States. Cleaned and aggregated county level data in Databricks using SQL
                to analyze emissions by state and county, explore population based patterns, and identify regions that
                contribute disproportionately to total emissions.
              </p>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-emerald-500/20">
                <p className="text-xs text-muted-foreground mb-1">Technical Challenge:</p>
                <p className="text-sm">
                  Cleaning messy numeric fields, aggregating large geospatial datasets, and designing clear,
                  insight-driven visualizations from raw environmental data
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Databricks
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SQL
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Data Visualization
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Environmental Analytics
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Geospatial Analysis
                </span>
              </div>
            </div>

            <a
              href="https://portfolio-optimization.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                  Portfolio Optimization
                </h3>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                  <span className="text-sm font-semibold text-cyan-400">Modern Portfolio Theory</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Demonstrates Modern Portfolio Theory to optimize an investment portfolio by maximizing the Sharpe ratio.
                Historical price data retrieved using yfinance. Log returns and covariance matrices computed.
                Optimization performed using scipy.optimize.minimize with final portfolio weights visualized clearly.
              </p>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-cyan-500/20">
                <p className="text-xs text-muted-foreground mb-1">Technical Challenge:</p>
                <p className="text-sm">Mathematical optimization and financial modeling with real market data</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Python
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  SciPy
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  yfinance
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Federal Reserve API
                </span>
              </div>
            </a>

            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-2 group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                  Predictive Sales Forecasting
                </h3>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                  <span className="text-sm font-semibold text-cyan-400">$1.2M Revenue Opportunity</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Built an ETL pipeline integrating 850K+ game sales records from Steam API. Developed ARIMA forecasting
                models projecting 3.8% YoY growth and $1.2M potential revenue uplift. Designed a Tableau dashboard
                visualizing sales trends, player retention, and monetization opportunities for stakeholders.
              </p>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-cyan-500/20">
                <p className="text-xs text-muted-foreground mb-1">Technical Challenge:</p>
                <p className="text-sm">Handling massive dataset and creating accurate time-series forecasts</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  MySQL
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  R
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Tableau
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  ARIMA
                </span>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2 group relative">
              <div className="absolute top-3 right-3">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  In Progress
                </span>
              </div>
              <div className="flex items-start justify-between mb-4 pr-24">
                <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                  NBA Game Prediction
                </h3>
                <a
                  href="https://github.com/akhaliq0/NBA-Prediction-Model"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors cursor-pointer" />
                </a>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                  <span className="text-sm font-semibold text-blue-400">10,000+ Games Analyzed</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Led a team of four developing a machine learning web application to predict 2025–26 NBA game outcomes
                using data from 10,000+ historical games (project in progress). Built a data pipeline for cleaning,
                feature engineering, and training linear regression models to identify factors influencing team points
                scored and matchup results.
              </p>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-blue-500/20">
                <p className="text-xs text-muted-foreground mb-1">Technical Challenge:</p>
                <p className="text-sm">Feature engineering from complex game stats for optimal prediction accuracy</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Python
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  scikit-learn
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  pandas
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Linear Regression
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Machine Learning
                </span>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-2 group">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors">SeeWithYou</h3>
                <a
                  href="https://github.com/SsjRaz/SeeWithYou"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors cursor-pointer" />
                </a>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30">
                  <span className="text-sm font-semibold text-pink-400">4th Place HackOHI/O</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Navigation app for visually impaired users leveraging AWS Rekognition and Apple LiDAR with real-time
                text-to-speech feedback and obstacle detection.
              </p>
              <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-pink-500/20">
                <p className="text-xs text-muted-foreground mb-1">Technical Challenge:</p>
                <p className="text-sm">Real-time object recognition and spatial mapping for accessibility</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  AWS
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Rekognition
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  LiDAR
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Computer Vision
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Data Science
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  ML Engineering
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills & Certifications */}
        <section id="professional-development" className="fade-in-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center border border-cyan-500/20">
              <Award className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Skills & Certifications
              </h2>
              <p className="text-sm text-muted-foreground">Tools and technologies I work with</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <h3 className="text-lg font-semibold mb-6 text-cyan-400">Programming</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">SQL</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
                      Proficient
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 pl-2 border-l-2 border-cyan-500/30">
                    MySQL, BigQuery, Snowflake
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Python</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
                      Proficient
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 pl-2 border-l-2 border-cyan-500/30">
                    PyTorch, Pandas, NumPy, scikit-learn, matplotlib, SciPy
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">R</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                      Intermediate
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 pl-2 border-l-2 border-blue-500/30">Tidyverse, ggplot2</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Java</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
                      Intermediate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <h3 className="text-lg font-semibold mb-6 text-blue-400">Analytics & BI Tools</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium">
                  Tableau
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                  Power BI
                </div>
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm font-medium">
                  Excel
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium">
                  Google Analytics
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-8 mb-4 text-purple-400">Data Science</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-sm font-medium">
                  Machine Learning
                </div>
                <div className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm font-medium">
                  Statistical Analysis
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium">
                  A/B Testing
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                  ARIMA Forecasting
                </div>
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm font-medium">
                  Linear Regression
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500">
              <h3 className="text-lg font-semibold mb-6 text-pink-400">Cloud & Platforms</h3>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium">
                  Git/GitHub
                </div>
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm font-medium">
                  BigQuery
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                  Snowflake
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm font-medium">
                  MySQL
                </div>
                <div className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm font-medium">
                  AWS
                </div>
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-medium">
                  Databricks
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-sm font-medium">
                  Shopify
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <a
              href="/certificates/Databricks-AI-BI.png"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-purple-400 transition-colors">
                    Databricks AI/BI for Data Analysts
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Databricks • October 2025</p>
                  <p className="text-xs text-muted-foreground">
                    Advanced certification in AI-powered business intelligence and analytics
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-purple-400 group-hover:text-purple-300">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Certificate</span>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/certificates/Databricks-SQL-Analytics.png"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                    Databricks SQL Analytics
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Databricks • October 2025</p>
                  <p className="text-xs text-muted-foreground">
                    Expertise in SQL-based analytics and data warehousing on Databricks
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-400 group-hover:text-blue-300">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Certificate</span>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="/certificates/Google-Data-Analytics.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-indigo-400 transition-colors">
                    Google Data Analytics Professional
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Google</p>
                  <p className="text-xs text-muted-foreground">
                    Professional certification in data analysis and visualization
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-indigo-400 group-hover:text-indigo-300">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Certificate</span>
                  </div>
                </div>
              </div>
            </a>

            <div className="glass rounded-2xl p-8 border-violet-500/20 hover:border-violet-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-1 group relative">
              <div className="absolute top-3 right-3">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">
                  In Progress
                </span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-violet-400 transition-colors">
                    AWS Certified Cloud Practitioner
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Amazon Web Services</p>
                  <p className="text-xs text-muted-foreground">
                    Foundational cloud computing and AWS services knowledge
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.credly.com/badges/your-microsoft-certification"
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-2xl p-8 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                    Microsoft 365 Certified
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">Microsoft</p>
                  <p className="text-xs text-muted-foreground">
                    Proficiency in Microsoft productivity and collaboration tools
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-400 group-hover:text-blue-300">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Certificate</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Leadership & Professional Development */}
        <section className="fade-in-section">
          <div className="glass rounded-2xl p-8 md:p-12 border-cyan-500/20">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Leadership & Professional Development
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Big Data & Analytics Association – Data Science Track Lead</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Led 100+ students in the Data Science & Analytics Track, teaching Python and using Kaggle for
                    workshops on data cleaning, exploratory analysis, statistical techniques, visualization, and
                    storytelling, with team projects showcased at the end of semester Research Gala.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">HackOHI/O 2025 – SeeWithYou (4th Place out of 100+ Teams)</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Developed a navigation app for visually impaired users leveraging AWS Rekognition, Apple LiDAR, and
                    AWS S3 to analyze images and deliver text-to-speech feedback describing objects, distance, and
                    direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="fade-in-section">
          <div className="glass rounded-2xl p-12 text-center border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              I’m always open to conversations about data, analytics, and problem solving. Feel free to reach out if
              you'd like to connect, collaborate, or learn more about my work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full gap-2 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/20 animate-pulse-subtle"
                asChild
              >
                <a href="mailto:Chaudhary.98@Buckeyemail.osu.edu">
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2 px-8 glass bg-transparent border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
                asChild
              >
                <a href="https://linkedin.com/in/suleman-chaudhary/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              </Button>
            </div>
            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Chaudhary.98@Buckeyemail.osu.edu • (614) 377-6182</p>
              <p className="text-sm text-muted-foreground mt-2">B.S. Information Systems • Ohio State University</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-12 text-muted-foreground text-sm">
        <p>© 2025 Suleman Chaudhary. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  )
}
