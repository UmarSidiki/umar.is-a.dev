import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Get dynamic content from URL parameters
    const title = searchParams.get('title') || 'Umar Siddiqui - Full-Stack Developer'
    const subtitle = searchParams.get('subtitle') || 'React, Next.js, TypeScript Expert'
    const type = searchParams.get('type') || 'portfolio'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fbbf24',
            backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)',
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '4px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                U
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 20px 0',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255,255,255,0.9)',
                margin: '0 0 40px 0',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {subtitle}
            </p>

            {/* Tech Stack Badges */}
            {type === 'portfolio' && (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {['React', 'Next.js', 'TypeScript', 'Node.js'].map((tech) => (
                  <span
                    key={tech}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      padding: '8px 20px',
                      borderRadius: '25px',
                      fontSize: '20px',
                      fontWeight: '600',
                      border: '2px solid rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Website URL */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '24px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '500',
            }}
          >
            umarsiddiqui.dev
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    console.log(`${error}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
