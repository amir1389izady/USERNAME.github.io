export function renderEconomyPage(container) {
  container.innerHTML = `
    <div class="economy-container theme-dark">
      <div class="settings-bar">
        <div class="setting-item">
          <label>Country</label>
          <select id="eco-country" disabled><option value="IR" selected>Iran</option></select>
        </div>
        <div class="setting-item">
          <label>Currency</label>
          <select id="eco-currency" disabled><option value="TOMAN" selected>Toman</option></select>
        </div>
      </div>

      <h2>Gold • 18K per gram (Iran)</h2>
      <div class="economy-grid">
        <div class="economy-card price-summary">
          <h3>Real-time Price</h3>
          <div id="eco-price" class="price-large">—</div>
          <div id="eco-range" class="price-range">Min — • Max — • Avg —</div>
          <p class="last-updated" id="eco-updated">Last update: —</p>
          <button class="view-sources-btn" id="view-sources-btn">View sources</button>
          <div id="eco-warning" class="source-warning" style="display:none;"></div>
        </div>

        <div class="economy-card chart-card">
          <h3>Price History</h3>
          <div class="chart-controls">
            <button class="chart-interval-btn active" data-int="daily">30D</button>
            <button class="chart-interval-btn" data-int="weekly">26W</button>
            <button class="chart-interval-btn" data-int="monthly">12M</button>
          </div>
          <div class="chart-wrapper"><canvas id="eco-chart"></canvas></div>
        </div>
      </div>
    </div>
  `;

  (async () => {
    try {
      const data = await (await import('./iran-gold-fetcher.js')).then(m => m.fetchIranGold18k());
      if (data.error) throw new Error(data.error);
      const toToman = v => Math.round((v || 0) / 10);
      const fmt = n => n.toLocaleString('fa-IR');
      document.getElementById('eco-price').textContent = `${fmt(toToman(data.price))} تومان`;
      document.getElementById('eco-range').textContent = `Min ${fmt(toToman(data.min))} • Max ${fmt(toToman(data.max))} • Avg ${fmt(toToman(data.average))}`;
      document.getElementById('eco-updated').textContent = `Last update: ${new Date(data.fetched_at).toLocaleString()}`;
      // Chart
      const ctx = document.getElementById('eco-chart');
      let chart; const seq = data.history?.daily || [];
      const labels = seq.map(p => new Date(p.t).toLocaleDateString());
      const values = seq.map(p => toToman(p.v));
      if (chart) chart.destroy();
      chart = new Chart(ctx, { type:'line', data:{ labels, datasets:[{ label:'18K gram (Toman)', data: values, borderColor:getComputedStyle(document.body).getPropertyValue('--accent-color')||'#00bcd4', backgroundColor:'transparent', tension:0.25 }] }, options:{ responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'#333' } } } } });
      // Sources modal
      const sources = data.sources || [];
      const openBtn = document.getElementById('view-sources-btn');
      openBtn.addEventListener('click', () => {
        const overlay = document.getElementById('economy-source-modal-overlay');
        const body = document.getElementById('source-modal-body');
        body.innerHTML = sources.map(s => `
          <div class="source-detail-item">
            <p><span class="source-status ${s.value ? 'online' : 'offline'}"></span><strong>${s.name}</strong></p>
            <p class="source-meta">Link: <a href="${s.url}" target="_blank" rel="noopener">${s.url}</a></p>
            ${s.value ? `<p class="source-meta">Price: ${fmt(toToman(s.value))} تومان</p>` : `<p class="source-meta">No data</p>`}
            <p class="source-meta">Time: ${new Date(s.timestamp).toLocaleString()}</p>
          </div>
        `).join('') || '<p>No sources available.</p>';
        overlay.style.display = 'flex';
      });
    } catch (e) {
      const warnEl = document.getElementById('eco-warning');
      warnEl.style.display = 'block';
      warnEl.textContent = `Milli fetch error: ${e.message}`;
    }

    const spread = (data.max - data.min) / (data.avg || data.max || 1);
    const warnEl = document.getElementById('eco-warning');
    if (spread > 0.08) {
      warnEl.style.display = 'block';
      warnEl.textContent = 'Warning: Large discrepancy detected between sources.';
    }

    document.querySelectorAll('.chart-interval-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chart-interval-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderChart(btn.dataset.int);
      });
    });

    // Sources modal
    const closeBtn = document.getElementById('close-source-modal-btn');
    const overlay = document.getElementById('economy-source-modal-overlay');
    closeBtn.addEventListener('click', () => overlay.style.display = 'none');
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });
  })();
}