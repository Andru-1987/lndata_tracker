export const cssVariables = `
:root {
  /* --- LIGHT MODE --- */
  --bg-body: #f8f9fa;
  --bg-surface: #ffffff;
  --text-primary: #202124;
  --text-secondary: #5f6368;
  --primary: #1a73e8;
  --primary-hover: #1557b0;
  --accent: #e8f0fe;
  --border: #dadce0;
  --radius-md: 12px;
  --radius-pill: 50px;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.12);
  
  --color-success: #137333;
  --color-warning: #ea4335;
  --color-info: #fbbc04;
}

[data-theme='dark'] {
  --bg-body: #000000;
  --bg-surface: rgba(20, 20, 20, 0.7);
  --text-primary: #e8eaed;
  --text-secondary: #9aa0a6;
  --primary: #8ab4f8;
  --primary-hover: #aecbfa;
  --accent: rgba(138, 180, 248, 0.15);
  --border: #3c4043;
  --border-glass: 1px solid rgba(255, 255, 255, 0.15);
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
}

* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Roboto', sans-serif; }
body { background-color: var(--bg-body); color: var(--text-primary); transition: background 0.3s ease; }

.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 20px; }
.grid-cols-3 { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
@media(min-width: 768px) { .grid-cols-3 { grid-template-columns: repeat(3, 1fr); } }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
`;
