import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCollections } from '../api.js';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollections()
      .then((data) => { setCollections(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="collection-page collection-page--loading">
        <div className="container"><p>Loading collections…</p></div>
      </main>
    );
  }

  return (
    <main className="collection-page">
      <div className="collection-page__header">
        <div className="container">
          <p className="label">Browse</p>
          <h1 className="collection-page__title">Collections</h1>
          <p className="collection-page__desc">
            Explore Dahlia&rsquo;s curated series of original oil paintings.
          </p>
        </div>
      </div>

      <div className="container">
        {collections.length === 0 ? (
          <p className="collection-page__empty">No collections yet. Check back soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px', paddingBottom: '80px' }}>
            {collections.map((col) => {
              const coverImg = col.coverImage || col.paintings?.[0]?.images?.[0];
              return (
                <Link
                  key={col.id}
                  to={`/collection/${col.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <article style={{ overflow: 'hidden' }}>
                    <div style={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      overflow: 'hidden',
                      background: 'var(--color-surface)',
                    }}>
                      {coverImg ? (
                        <img
                          src={coverImg}
                          alt={col.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'var(--color-surface2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-tertiary)',
                          fontSize: '14px',
                        }}>
                          No image
                        </div>
                      )}
                    </div>
                    <div style={{ paddingTop: '16px' }}>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(20px, 2vw, 26px)',
                        fontWeight: 400,
                        marginBottom: '8px',
                        letterSpacing: '-0.01em',
                      }}>
                        {col.name}
                      </h2>
                      {col.description && (
                        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                          {col.description}
                        </p>
                      )}
                      <p style={{ fontSize: '13px', color: 'var(--color-accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {col._count?.paintings ?? col.paintings?.length ?? 0} works →
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
