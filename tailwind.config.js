/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './partials/**/*.html',
    './src/**/*.{js,css}',
  ],
  theme: {
    extend: {
      colors: {
        // Primitives (Fabricly Website library)
        roti: {
          DEFAULT: '#c9a84c',
          dark: '#a0863c',
          darker: '#7a6630',
          darkest: '#534522',
          light: '#dec380',
          lighter: '#ecd9a8',
          lightest: '#f9f6ed',
        },
        buttercup: '#e8b923',
        // Color Scheme 1
        scheme1: {
          bg:      '#f9f6ed',
          fg:      '#f4eddb',
          text:    '#24201a',
          border:  'rgba(12,8,1,0.30)',
          neutral: '#0c0801',
        },
      },
      fontFamily: {
        heading: ['Oswald', 'system-ui', 'sans-serif'],
        body:    ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Figma "Text Sizes"
        'tiny':   ['12px', { lineHeight: '1.5' }],
        'small':  ['14px', { lineHeight: '1.5' }],
        'regular':['16px', { lineHeight: '1.5' }],
        'medium': ['18px', { lineHeight: '1.5' }],
        'large':  ['20px', { lineHeight: '1.5' }],
        // Figma headings
        'h6':     ['22px', { lineHeight: '1.4', letterSpacing: '-0.22px' }],
        'h5':     ['28px', { lineHeight: '1.4', letterSpacing: '-0.28px' }],
        'h4':     ['36px', { lineHeight: '1.3', letterSpacing: '-0.36px' }],
        'h3':     ['44px', { lineHeight: '1.2', letterSpacing: '-0.44px' }],
        'h2':     ['52px', { lineHeight: '1.2', letterSpacing: '-0.52px' }],
        'h1':     ['72px', { lineHeight: '1.2', letterSpacing: '-0.72px' }],
      },
      spacing: {
        // Figma Spacing & Sizing
        'page':       '64px',
        'page-mobile':'20px',
        'sec-sm':     '48px',
        'sec-md':     '80px',
        'sec-lg':     '120px',
      },
      borderRadius: {
        'sm':  '4px',
        'md':  '8px',
        'lg':  '12px',
      },
      maxWidth: {
        'container': '1280px',
      },
      boxShadow: {
        'card':  '0 2px 4px -2px rgba(0,0,0,0.06), 0 4px 8px -2px rgba(0,0,0,0.10)',
        'soft':  '0 2px 2px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
