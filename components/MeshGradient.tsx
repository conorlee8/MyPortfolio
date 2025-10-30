interface MeshGradientProps {
  variant?: 'hero' | 'section' | 'footer';
}

export default function MeshGradient({ variant = 'section' }: MeshGradientProps) {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Large pink orb - top right */}
        <div
          className="mesh-orb mesh-orb-1 bg-gradient-to-br from-hot-pink to-electric-purple"
          style={{
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-100px',
          }}
        />

        {/* Purple orb - bottom left */}
        <div
          className="mesh-orb mesh-orb-2 bg-gradient-to-tr from-electric-purple to-cyan-bright"
          style={{
            width: '500px',
            height: '500px',
            bottom: '-150px',
            left: '-100px',
          }}
        />

        {/* Cyan accent - center */}
        <div
          className="mesh-orb mesh-orb-3 bg-gradient-to-br from-cyan-bright to-hot-pink"
          style={{
            width: '400px',
            height: '400px',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle orb - left */}
        <div
          className="mesh-orb mesh-orb-1 bg-gradient-to-br from-hot-pink/40 to-electric-purple/40"
          style={{
            width: '400px',
            height: '400px',
            top: '20%',
            left: '-150px',
          }}
        />

        {/* Subtle orb - right */}
        <div
          className="mesh-orb mesh-orb-2 bg-gradient-to-tl from-cyan-bright/30 to-electric-purple/40"
          style={{
            width: '450px',
            height: '450px',
            bottom: '10%',
            right: '-150px',
          }}
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Bottom glow */}
        <div
          className="mesh-orb mesh-orb-1 bg-gradient-to-t from-hot-pink/40 to-electric-purple/40"
          style={{
            width: '800px',
            height: '400px',
            bottom: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
    );
  }

  return null;
}
