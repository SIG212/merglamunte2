import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mlm-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'mlm-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
