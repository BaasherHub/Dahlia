import './Skeleton.css';

export default function Skeleton({ 
  width = '100%', 
  height = '100px', 
  count = 1,
  circle = false 
}) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`skeleton ${circle ? 'skeleton--circle' : ''}`}
          style={{ 
            width, 
            height,
            borderRadius: circle ? '50%' : '8px'
          }}
        />
      ))}
    </>
  );
}
