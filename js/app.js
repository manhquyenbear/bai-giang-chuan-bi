/* ============================================
   App JavaScript — Navigation, Mermaid Init, 
   Syntax Highlighting, Sidebar, Progress
   ============================================ */

// --- Sidebar Toggle (Mobile) ---
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close on clicking outside
    document.querySelector('.main')?.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith('/' + currentPage))) {
      link.classList.add('active');
    }
  });

  // --- Initialize Mermaid (if loaded) ---
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#21242f',
        primaryColor: '#6c5ce7',
        primaryTextColor: '#e4e6f0',
        primaryBorderColor: '#6c5ce7',
        lineColor: '#9ca3b8',
        secondaryColor: '#1a1d27',
        tertiaryColor: '#2d3041',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        nodeBorder: '#6c5ce7',
        nodeTextColor: '#e4e6f0',
        mainBkg: '#2d3041',
        clusterBkg: '#1a1d27',
        clusterBorder: '#2d3041',
        edgeLabelBackground: '#1a1d27',
        actorLineColor: '#6c5ce7',
        signalColor: '#e4e6f0',
        signalTextColor: '#e4e6f0',
      }
    });
  }

  // --- Simple Syntax Highlighting ---
  document.querySelectorAll('pre code').forEach(block => {
    if (block.classList.contains('no-highlight')) return;
    // Skip blocks that already have manual <span> highlighting
    if (block.querySelector('span') || block.innerHTML.includes('&lt;span')) return;

    let text = block.textContent;
    // Escape HTML entities first
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Tokenize to avoid highlighting inside strings/comments
    const tokens = [];
    let remaining = text;

    while (remaining.length > 0) {
      let match;
      // Line comments (// or #)
      if ((match = remaining.match(/^(\/\/.*$|#.*$)/m))) {
        const idx = remaining.indexOf(match[0]);
        if (idx > 0) { tokens.push({ type: 'plain', value: remaining.slice(0, idx) }); }
        tokens.push({ type: 'comment', value: match[0] });
        remaining = remaining.slice(idx + match[0].length);
      }
      // Double-quoted string
      else if ((match = remaining.match(/^"[^"]*"/))) {
        tokens.push({ type: 'string', value: match[0] });
        remaining = remaining.slice(match[0].length);
      }
      // Single-quoted string
      else if ((match = remaining.match(/^'[^']*'/))) {
        tokens.push({ type: 'string', value: match[0] });
        remaining = remaining.slice(match[0].length);
      }
      // Backtick string
      else if ((match = remaining.match(/^`[^`]*`/))) {
        tokens.push({ type: 'string', value: match[0] });
        remaining = remaining.slice(match[0].length);
      }
      // Plain text (advance one character at a time until a token start)
      else {
        // Find the next potential token start
        const next = remaining.search(/[\/\/#"'`]/);
        if (next > 0) {
          tokens.push({ type: 'plain', value: remaining.slice(0, next) });
          remaining = remaining.slice(next);
        } else if (next === 0) {
          // Not a recognized token start, push one char
          tokens.push({ type: 'plain', value: remaining[0] });
          remaining = remaining.slice(1);
        } else {
          tokens.push({ type: 'plain', value: remaining });
          remaining = '';
        }
      }
    }

    // Keywords and numbers only applied to plain tokens
    const keywords = ['const','let','var','function','return','if','else','for','while',
      'import','export','from','async','await','try','catch','class','new','this',
      'true','false','null','undefined','of','in','do','switch','case','break',
      'default','throw','typeof','instanceof','echo','fi','then','done','exit',
      'mkdir','chmod','cd','ls','git','npm','npx','node','claude'];
    const kwRegex = new RegExp('\\b(' + keywords.join('|') + ')\\b', 'g');
    const numRegex = /\b(\d+\.?\d*)\b/g;

    let html = tokens.map(t => {
      if (t.type === 'comment') return `<span class="comment">${t.value}</span>`;
      if (t.type === 'string') return `<span class="string">${t.value}</span>`;
      // Plain: highlight keywords and numbers
      let v = t.value;
      v = v.replace(kwRegex, '<span class="keyword">$1</span>');
      v = v.replace(numRegex, '<span class="number">$1</span>');
      return v;
    }).join('');

    block.innerHTML = html;
  });

  // --- Smooth scroll to anchor ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// --- Generate sidebar HTML (reusable) ---
function getSidebarHTML(activePage) {
  const lessons = [
    { file: 'index.html', icon: '🏠', title: 'Trang Chủ' },
    { section: 'BẮT BUỘC' },
    { file: '01-terminal.html', icon: '💻', title: 'Terminal / CLI', badge: 'required' },
    { file: '02-git.html', icon: '🔀', title: 'Git Cơ Bản', badge: 'required' },
    { file: '03-programming.html', icon: '🧩', title: 'Lập Trình Cơ Bản', badge: 'required' },
    { file: '04-json-yaml.html', icon: '📋', title: 'JSON & YAML', badge: 'required' },
    { section: 'CẦN CHO MODULE NÂNG CAO' },
    { file: '05-shell.html', icon: '📜', title: 'Shell Scripting', badge: 'later' },
    { file: '06-nodejs.html', icon: '🟢', title: 'Node.js / npm', badge: 'later' },
    { section: 'NÊN BIẾT' },
    { file: '07-ai-llm.html', icon: '🤖', title: 'AI / LLM', badge: 'optional' },
    { file: '08-markdown.html', icon: '📝', title: 'Markdown', badge: 'optional' },
    { file: '09-cicd.html', icon: '🔄', title: 'CI/CD', badge: 'optional' },
  ];

  let html = `
    <div class="sidebar-header">
      <h2>📘 Claude Code Prep</h2>
      <p>Kiến thức chuẩn bị cho claude-howto</p>
    </div>
    <nav class="sidebar-nav">`;
  
  for (const item of lessons) {
    if (item.section) {
      html += `<div class="nav-section">${item.section}</div>`;
    } else {
      const cls = activePage === item.file ? ' active' : '';
      const badgeCls = item.badge === 'required' ? 'badge-required' :
                       item.badge === 'later' ? 'badge-later' : 'badge-optional';
      const badgeText = item.badge === 'required' ? 'Bắt buộc' :
                        item.badge === 'later' ? 'Sau' : 'Nên biết';
      const badge = item.badge ? `<span class="badge ${badgeCls}">${badgeText}</span>` : '';
      html += `<a class="nav-link${cls}" href="${item.file}">${item.icon} ${item.title}${badge}</a>`;
    }
  }
  
  html += `</nav>`;
  return html;
}
