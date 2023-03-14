import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const customTheme: ThemeConfig = extendTheme(
  {
    initialColorMode: 'light',
    useSystemColorMode: false,
    colors: {
      brand: {
        500: 'linear-gradient(273.1deg, #153FFF 1.57%, #4790FF 118.62%)',
        600: '#153FFF',
      },
      black: {
        500: '#141414',
      },
      gray: {
        100: '#F7F7F7',
        300: '#FFFFFF78',
        400: '#C0C0C0',
        600: '#686868',
        700: '#ECECEC',
      },
    },
    styles: {
      global: {
        a: {
          color: '#3166DD',
        },
        'ul, ol': {
          margin: '0 0 1rem',
          paddingLeft: '2rem',
        },
        h1: {
          fontSize: ['1.875rem', '2.5rem'],
          fontWeight: '700',
        },
        h2: {
          fontSize: ['1.5rem', '2rem'],
          fontWeight: '700',
        },
        h3: {
          fontSize: ['1.25rem', '1.5rem'],
          fontWeight: '700',
        },
        'h4, h5, h6': {
          fontWeight: '700',
        },
        'img, svg, video, canvas, audio, iframe, embed, object': {
          display: 'initial'
        },
        'pre, code, kbd, samp': {
          fontSize: '90%',
        },
        '.olvy-tab-launcher-right': {
          zIndex: '100!important',
          display: ['none!important', 'flex!important'],
        }
      },
    },
  },
);

export default customTheme;
