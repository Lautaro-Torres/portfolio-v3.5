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
    				'PP Neue Montreal',
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
    				'PP Neue Montreal',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			figtree: [
    				'PP Neue Montreal',
    				'system-ui',
    				'-apple-system',
    				'Segoe UI',
    				'Roboto',
    				'Helvetica',
    				'Arial',
    				'sans-serif'
    			],
    			ppneue: [
    				'PP Neue Montreal',
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
            // Make large headings shrink earlier on smaller screens
            display: 'clamp(2.75rem,7.5vw,6rem)',
            headline: 'clamp(1.75rem,3.8vw,3rem)'
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
    				DEFAULT: '#53CA1E',
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
  