import { Icon } from './components';
import type { CommonIconName } from './components';
import './App.css';

const commonIcons: CommonIconName[] = [
  'home',
  'cart',
  'package',
  'user',
  'settings',
  'search',
  'plus',
  'minus',
  'close',
  'check',
];

function App() {
  return (
    <main className="app-shell">
      <header>
        <h1>Icon Library</h1>
        <p>10 icones communes partagees entre web et mobile.</p>
      </header>
      <section className="icon-grid" aria-label="Common icons">
        {commonIcons.map((name) => (
          <article className="icon-card" key={name}>
            <Icon name={name} size={28} color="#0F1724" ariaLabel={name} />
            <span>{name}</span>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
