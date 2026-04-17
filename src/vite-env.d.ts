/// <reference types="vite/client" />

import * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'mlm-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'mlm-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
