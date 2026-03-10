import './GalleryFilters.css';

export default function GalleryFilters({ filters, onFilterChange, availableMediums, availableYears }) {
  return (
    <div className="gallery-filters">
      <div className="gallery-filters__header">
        <h3 className="gallery-filters__title">Filter Artworks</h3>
        <button
          className="gallery-filters__reset"
          onClick={() => onFilterChange({ medium: null, year: null, priceRange: null })}
        >
          Clear All
        </button>
      </div>

      {/* Medium Filter */}
      <div className="gallery-filters__group">
        <label className="gallery-filters__label">Medium</label>
        <div className="gallery-filters__options">
          <button
            className={`gallery-filters__option ${!filters.medium ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, medium: null })}
          >
            All
          </button>
          {availableMediums.map(medium => (
            <button
              key={medium}
              className={`gallery-filters__option ${filters.medium === medium ? 'active' : ''}`}
              onClick={() => onFilterChange({ ...filters, medium })}
            >
              {medium}
            </button>
          ))}
        </div>
      </div>

      {/* Year Filter */}
      <div className="gallery-filters__group">
        <label className="gallery-filters__label">Year</label>
        <select
          className="gallery-filters__select"
          value={filters.year || ''}
          onChange={(e) => onFilterChange({ ...filters, year: e.target.value || null })}
        >
          <option value="">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="gallery-filters__group">
        <label className="gallery-filters__label">Price Range</label>
        <div className="gallery-filters__price-options">
          <button
            className={`gallery-filters__price-btn ${!filters.priceRange ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, priceRange: null })}
          >
            All Prices
          </button>
          <button
            className={`gallery-filters__price-btn ${filters.priceRange === 'under-1000' ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, priceRange: 'under-1000' })}
          >
            Under $1,000
          </button>
          <button
            className={`gallery-filters__price-btn ${filters.priceRange === '1000-5000' ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, priceRange: '1000-5000' })}
          >
            $1,000 - $5,000
          </button>
          <button
            className={`gallery-filters__price-btn ${filters.priceRange === 'above-5000' ? 'active' : ''}`}
            onClick={() => onFilterChange({ ...filters, priceRange: 'above-5000' })}
          >
            $5,000+
          </button>
        </div>
      </div>
    </div>
  );
}
