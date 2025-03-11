
import type { Config } from "tailwindcss";
import { 
  getTailwindThemeColors, 
  getTailwindTypography, 
  getTailwindBorders, 
  getTailwindEffects, 
  getTailwindTransitions 
} from "./src/lib/theme-utils";

// Safely get theme values or fallback to empty objects
const safeGet = (fn: () => any, fallback: any = {}) => {
  try {
    return fn() || fallback;
  } catch (e) {
    console.error('Error getting theme values:', e);
    return fallback;
  }
};

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			fontSize: {
				'display-2xl': ['4.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '300' }],
				'display-xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '300' }],
				'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '400' }],
				'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '400' }],
				'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '400' }],
				'display-xs': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
				'title-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '500' }],
				'title-md': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '500' }],
				'title-sm': ['1.125rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '500' }],
				'body-lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
				'body-md': ['1rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
				'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
				'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				...safeGet(getTailwindThemeColors),
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				...safeGet(() => getTailwindEffects().boxShadow),
			},
			backdropBlur: {
				...safeGet(() => getTailwindEffects().backdropBlur),
			},
			transitionDuration: {
				...safeGet(() => getTailwindTransitions().transitionDuration),
			},
			transitionTimingFunction: {
				...safeGet(() => getTailwindTransitions().transitionTimingFunction),
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
						opacity: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					},
					to: {
						height: '0',
						opacity: '0'
					}
				},
				'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'rotate-diamond': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(139, 92, 246, 0.6)' }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'rotate-diamond': 'rotate-diamond 30s linear infinite',
				'float': 'float 4s ease-in-out infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
