/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'General Sans',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			mono: [
    				'PPSupplyMono',
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'monospace'
    			],
    			anton: [
    				'Anton',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			figtree: [
    				'General Sans',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			ppneue: [
    				'General Sans',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			montreal: [
    				'General Sans',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			general: [
    				'General Sans',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			ppmono: [
    				'PPSupplyMono',
    				'ui-monospace',
    				'SFMono-Regular',
    				'Menlo',
    				'Monaco',
    				'Consolas',
    				'Liberation Mono',
    				'monospace'
    			]
    		},
        fontSize: {
            // Fluid typography — scales with viewport
            display: 'clamp(2.75rem,7.5vw,6rem)',
            headline: 'clamp(1.75rem,3.8vw,3rem)',
            'fluid-xs': 'clamp(0.7rem,1.5vw,0.75rem)',
            'fluid-sm': 'clamp(0.8rem,1.8vw,0.9rem)',
            'fluid-base': 'clamp(0.9rem,2vw,1rem)',
            'fluid-lg': 'clamp(1rem,2.2vw,1.125rem)',
            'fluid-xl': 'clamp(1.1rem,2.5vw,1.25rem)',
            'fluid-2xl': 'clamp(1.25rem,3vw,1.5rem)',
            'fluid-title': 'clamp(2.2rem,10vw + 1rem,7rem)',
        },
        spacing: {
            // Viewport-based spacing for fluid layout
            'vw-xs': 'clamp(0.5rem,1vw,0.75rem)',
            'vw-sm': 'clamp(0.75rem,2vw,1.25rem)',
            'vw-md': 'clamp(1rem,3vw,1.5rem)',
            'vw-lg': 'clamp(1.5rem,4vw,2.5rem)',
            'vw-xl': 'clamp(2rem,5vw,3.5rem)',
            'vw-2xl': 'clamp(2.5rem,6vw,4rem)',
            'vw-hero': 'clamp(280px,50vh,650px)', // Hero height scales with viewport
        },
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: '#b8c0cb',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  }
  