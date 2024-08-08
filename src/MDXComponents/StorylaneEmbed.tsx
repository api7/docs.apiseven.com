import React from 'react';
import { useEffect } from 'react';

type Props = {
  src: string;
}

const StorylaneEmbed: React.FC<Props> = ({ src }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.storylane.io/js/v1/storylane.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(56.25% + 27px)', width: '100%', height: 0, transform: 'scale(1)' }}>
      <iframe
        className="sl-demo"
        src={src}
        name="sl-embed"
        allow="fullscreen"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: '1px solid rgba(63,95,172,0.35)',
          boxShadow: '0px 0px 18px rgba(26, 19, 72, 0.15)',
          borderRadius: '10px',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
};

export default StorylaneEmbed;
