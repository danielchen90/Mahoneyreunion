"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

// Enhanced animated mesh gradient background with dynamic color orbs
const EnhancedShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Color orbs configuration
    const orbs = [
      { x: 0.2, y: 0.3, vx: 0.0003, vy: 0.0002, color: [0, 191, 255], size: 0.4 }, // Deep Sky Blue
      { x: 0.8, y: 0.2, vx: -0.0002, vy: 0.0003, color: [255, 140, 0], size: 0.45 }, // Dark Orange
      { x: 0.5, y: 0.7, vx: 0.0002, vy: -0.0002, color: [138, 43, 226], size: 0.35 }, // Blue Violet
      { x: 0.1, y: 0.8, vx: 0.0004, vy: -0.0001, color: [255, 20, 147], size: 0.3 }, // Deep Pink
      { x: 0.9, y: 0.6, vx: -0.0003, vy: -0.0003, color: [0, 255, 255], size: 0.38 }, // Cyan
      { x: 0.6, y: 0.4, vx: -0.0001, vy: 0.0004, color: [255, 215, 0], size: 0.32 }, // Gold
    ]

    let animationFrameId: number

    const animate = () => {
      // Clear canvas with dark base
      ctx.fillStyle = 'rgb(15, 23, 42)' // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw orbs
      orbs.forEach(orb => {
        // Update position
        orb.x += orb.vx
        orb.y += orb.vy

        // Bounce off edges with smooth transition
        if (orb.x < 0 || orb.x > 1) orb.vx *= -1
        if (orb.y < 0 || orb.y > 1) orb.vy *= -1

        // Keep within bounds
        orb.x = Math.max(0, Math.min(1, orb.x))
        orb.y = Math.max(0, Math.min(1, orb.y))

        // Draw gradient orb
        const x = orb.x * canvas.width
        const y = orb.y * canvas.height
        const radius = Math.max(canvas.width, canvas.height) * orb.size

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0.4)`)
        gradient.addColorStop(0.5, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0.2)`)
        gradient.addColorStop(1, `rgba(${orb.color[0]}, ${orb.color[1]}, ${orb.color[2]}, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Canvas-based animated mesh gradient */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(80px)' }}
      />

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40" />

      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 3 + 1
          const duration = 5 + Math.random() * 8
          const delay = Math.random() * 5
          const startX = Math.random() * 100
          const startY = Math.random() * 100
          const endY = startY - (30 + Math.random() * 40)
          const drift = (Math.random() - 0.5) * 40

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: `${startY}%`,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              }}
              animate={{
                y: [`0%`, `${endY - startY}%`, `0%`],
                x: [`0%`, `${drift}%`, `0%`],
                opacity: [0, 0.6, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </div>

      {/* Subtle grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-white to-transparent"
            style={{
              left: `${20 + i * 30}%`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Pure CSS-based shader background (fallback for better compatibility)
const ShaderBackground = () => {
  return <EnhancedShaderBackground />
}

export default ShaderBackground
