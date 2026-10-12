// Curated high-aesthetic Unsplash environmental & health photography with high resilience
export const ENVIRONMENTAL_IMAGES = {
  // Karhutla / Peatland wildfire & smoke
  wildfirePeatland: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  smokeSettlement: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1200&q=80',
  
  // Haze / Smog city vs clean sky
  hazyCity: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80',
  cleanLandscape: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  
  // Human context & protection
  personMaskOutdoor: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1000&q=80',
  vulnerableChildren: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=80',
  elderlyOutdoor: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1000&q=80',
  outdoorWorker: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
  
  // Protection & Indoor Clean Air
  cleanIndoorRoom: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  airPurifierFiltration: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1000&q=80',
};

// Fallback high-aesthetic SVG Data URIs to guarantee zero broken images offline or on CDN block
export const FALLBACK_SVGS: Record<string, string> = {
  wildfire: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%237c2d12"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="800" height="500" fill="url(%23g)"/><circle cx="400" cy="250" r="120" fill="%23ea580c" opacity="0.25"/><path d="M 0 450 Q 200 380 400 420 T 800 390 L 800 500 L 0 500 Z" fill="%23020617"/><text x="400" y="240" fill="%23fdba74" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">Ilustrasi Lanskap Asap Karhutla</text><text x="400" y="270" fill="%23fed7aa" font-size="14" font-family="sans-serif" text-anchor="middle">Dokumentasi Situasi Lingkungan</text></svg>`,
  clean: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230284c7"/><stop offset="60%" stop-color="%23059669"/><stop offset="100%" stop-color="%23064e3b"/></linearGradient></defs><rect width="800" height="500" fill="url(%23cg)"/><text x="400" y="240" fill="%23f0fdf4" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">Kondisi Udara Bersih (Baseline)</text><text x="400" y="270" fill="%23bbf7d0" font-size="14" font-family="sans-serif" text-anchor="middle">Jarak Pandang Optimal &gt; 10 km</text></svg>`,
  haze: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23475569"/><stop offset="50%" stop-color="%2394a3b8"/><stop offset="100%" stop-color="%23334155"/></linearGradient></defs><rect width="800" height="500" fill="url(%23hg)"/><circle cx="400" cy="200" r="80" fill="%23fdba74" opacity="0.3"/><text x="400" y="240" fill="%23f8fafc" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">Kondisi Kabut Asap Pekat</text><text x="400" y="270" fill="%23e2e8f0" font-size="14" font-family="sans-serif" text-anchor="middle">Jarak Pandang Terbatas &lt; 500 m</text></svg>`,
  mask: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23065f46"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="800" height="500" fill="url(%23mg)"/><text x="400" y="240" fill="%23a7f3d0" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">Proteksi Pernapasan &amp; Masker</text><text x="400" y="270" fill="%23d1fae5" font-size="14" font-family="sans-serif" text-anchor="middle">Respirator N95 / KF94 Efisiensi Tinggi</text></svg>`,
  room: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23047857"/><stop offset="100%" stop-color="%231e293b"/></linearGradient></defs><rect width="800" height="500" fill="url(%23rg)"/><text x="400" y="240" fill="%23ecfdf5" font-size="22" font-weight="bold" font-family="sans-serif" text-anchor="middle">Ruang Bersih &amp; Filtrasi Udara</text><text x="400" y="270" fill="%23a7f3d0" font-size="14" font-family="sans-serif" text-anchor="middle">Isolasi Ruang dan Pemurni Udara HEPA</text></svg>`,
};
