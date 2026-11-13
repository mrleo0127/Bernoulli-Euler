/* ===== Menú móvil ===== */
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

/* Resalta el enlace de la sección visible */
const links = [...menu.querySelectorAll('a')];
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

/* ===== Línea de tiempo: filtro ===== */
document.querySelectorAll('.filters .chip').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filters .chip').forEach(b => b.classList.toggle('on', b === btn));
  const f = btn.dataset.f;
  document.querySelectorAll('.timeline li').forEach(li => li.classList.toggle('hide', f !== 'all' && li.dataset.w !== f));
}));

/* ===== Simulador: ley de los grandes números ===== */
(() => {
  let n = 0, heads = 0, pts = [];
  const line = document.getElementById('coinline'), out = document.getElementById('coinout');
  document.querySelectorAll('#coinlab [data-n]').forEach(b => b.addEventListener('click', () => {
    const k = +b.dataset.n;
    if (!k) { n = heads = 0; pts = []; }
    for (let i = 0; i < k; i++) {
      n++; if (Math.random() < 0.5) heads++;
      pts.push(heads / n);
    }
    // Reduce a máx. 300 puntos para dibujar
    const step = Math.max(1, Math.floor(pts.length / 300));
    const xs = pts.filter((_, i) => i % step === 0);
    line.setAttribute('points', xs.map((p, i) => `${(i / Math.max(1, xs.length - 1)) * 300},${100 - p * 100}`).join(' '));
    out.textContent = n ? `Lanzamientos: ${n} · Caras: ${heads} · Proporción: ${(heads / n).toFixed(4)}` : 'Lanzamientos: 0';
  }));
})();

/* ===== Quiz ===== */
const QUIZ = [
  { q: '¿En qué ciudad nacieron Jacob Bernoulli y Leonhard Euler?', o: ['París', 'Basilea', 'San Petersburgo', 'Ginebra'], a: 1, e: 'Ambos nacieron en Basilea, Suiza.' },
  { q: '¿Qué enuncia, a grandes rasgos, la ley de los grandes números?', o: ['Que todos los números son primos', 'Que la frecuencia relativa de un evento se acerca a su probabilidad al repetir muchas veces el experimento', 'Que los números grandes no existen', 'Que el azar no se puede medir'], a: 1, e: 'Es la interpretación matemática de la probabilidad como frecuencia relativa.' },
  { q: '¿Qué obra de Jacob Bernoulli se publicó en 1713, después de su muerte?', o: ['Introductio', 'Mechanica', 'Ars Conjectandi', 'Principia'], a: 2, e: 'Quedó incompleta a su muerte en 1705.' },
  { q: '¿Qué pidió Jacob grabar en su tumba?', o: ['Una espiral logarítmica', 'Una pirámide', 'Un círculo', 'Una parábola'], a: 0, e: 'Con la frase «Eadem mutata resurgo».' },
  { q: '¿Quién resolvió en 1735 el problema de Basilea (suma de 1/n²)?', o: ['Jacob Bernoulli', 'Johann Bernoulli', 'Leonhard Euler', 'Leibniz'], a: 2, e: 'Euler mostró que la suma es π²/6.' },
  { q: '¿Cuál es la identidad de Euler que sale al poner x = π en e^(ix) = cos x + i sen x?', o: ['e^(iπ) = 1', 'e^(iπ) = −1', 'e^(iπ) = 0', 'e^(iπ) = π'], a: 1, e: 'cos π = −1 y sen π = 0, así que e^(iπ) + 1 = 0.' },
  { q: '¿Qué le ocurrió a Euler con la vista?', o: ['Nunca tuvo problemas', 'Quedó totalmente ciego, pero siguió produciendo obra', 'Dejó de trabajar', 'Se curó con una operación'], a: 1, e: 'Una operación de cataratas en 1771 lo ayudó solo unos días; produjo casi la mitad de su obra tras volver a Rusia en 1766.' },
  { q: '¿Qué mostró Euler sobre 2³² + 1 = 4294967297?', o: ['Que es primo', 'Que es divisible entre 641', 'Que es un cuadrado', 'Que es negativo'], a: 1, e: 'Refutó así la conjetura de Fermat sobre números de la forma 2ⁿ+1.' }
];
(() => {
  const box = document.getElementById('quizbox');
  let i = 0, score = 0;
  function show() {
    if (i >= QUIZ.length) {
      const msg = score >= 7 ? '¡Excelente! Ya podrías dar la clase.' : score >= 4 ? 'Muy bien. Revisa la línea de tiempo y vuelve a intentarlo.' : 'Buen comienzo: relee las secciones y reintenta.';
      box.innerHTML = `<h3>Resultado: ${score} / ${QUIZ.length}</h3><p>${msg}</p><button class="btn" id="again">Jugar de nuevo</button>`;
      document.getElementById('again').onclick = () => { i = 0; score = 0; show(); };
      return;
    }
    const q = QUIZ[i];
    box.innerHTML = `<div class="bar"><i style="width:${(i / QUIZ.length) * 100}%"></i></div>
      <p>Pregunta ${i + 1} de ${QUIZ.length} · Puntos: ${score}</p><h3>${q.q}</h3>` +
      q.o.map((t, k) => `<button class="opt" data-k="${k}">${t}</button>`).join('') + '<div class="fb"></div>';
    box.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      const k = +b.dataset.k, good = k === q.a;
      if (good) score++;
      box.querySelectorAll('.opt').forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add('ok'); });
      if (!good) b.classList.add('bad');
      box.querySelector('.fb').innerHTML = `<p><b>${good ? '¡Correcto!' : 'No exactamente.'}</b> ${q.e}</p><button class="btn sm" id="nx">${i + 1 < QUIZ.length ? 'Siguiente' : 'Ver resultado'}</button>`;
      document.getElementById('nx').onclick = () => { i++; show(); };
    });
  }
  show();
})();

/* ===== Chatbot simulado ===== */
const BOTS = {
  euler: {
    hi: '¡Saludos! Soy Euler (versión simulada). Pregúntame sobre mi vida o mis ideas.',
    fallback: 'Eso no lo tengo en mis notas. Prueba con: Basilea, Johann Bernoulli, ceguera, Berlín, fórmula, familia o notación.',
    topics: [
      [['basilea', 'nac', 'infancia', 'riehen'], 'Nací en Basilea en 1707 y crecí en Riehen. Mi padre, pastor, me enseñó matemáticas elementales.'],
      [['johann', 'bernoulli', 'maestro', 'profesor'], 'Johann Bernoulli me dejó visitarlo los domingos por la tarde para resolver dudas, y convenció a mi padre de que dejara la teología.'],
      [['ciego', 'ceguera', 'vista', 'ojo'], 'Perdí la vista casi por completo tras volver a San Petersburgo en 1766. Mi memoria me permitió seguir trabajando.'],
      [['berlin', 'berlín', 'federico'], 'Estuve 25 años en la Academia de Berlín invitado por Federico el Grande. Escribí unos 380 artículos allí.'],
      [['formula', 'fórmula', 'identidad', 'e^'], 'Mi fórmula e^(ix) = cos x + i sen x une exponenciales y trigonometría. Con x = π resulta e^(iπ) = −1.'],
      [['familia', 'hijos', 'esposa', 'bebé', 'bebe'], 'Me casé con Katharina Gsell en 1734. Tuvimos 13 hijos, de los cuales cinco sobrevivieron. Y sí, hice descubrimientos con un bebé en brazos.'],
      [['notacion', 'notación', 'simbolo', 'símbolo', 'f(x)'], 'Se me atribuye f(x), la letra e para la base de los logaritmos naturales, i para √−1 y Σ para sumas.'],
      [['basilea', 'serie', 'pi', 'π'], 'En 1735 mostré que 1 + 1/4 + 1/9 + … vale π²/6.']
    ]
  },
  jacob: {
    hi: 'Saludos. Soy Jacob Bernoulli (versión simulada). Puedes preguntar por probabilidad, mi hermano o mi tumba.',
    fallback: 'No tengo ese dato. Prueba con: probabilidad, Johann, lemniscata, tumba, familia o cálculo.',
    topics: [
      [['probabilidad', 'grandes numeros', 'grandes números', 'ley', 'ars'], 'Mi <i>Ars Conjectandi</i>, publicado en 1713, trata la probabilidad como grado medible de certeza e incluye la ley de los grandes números.'],
      [['johann', 'hermano', 'pelea', 'rival'], 'Johann fue mi alumno y luego mi rival. Nuestra relación se rompió por completo en 1697. Hoy se ve que ambos fuimos igual de culpables.'],
      [['lemniscata', 'curva', 'ocho'], 'En 1694 describí una curva en forma de ocho y la llamé lemniscus, «cinta colgante». No sabía que era un caso especial del óvalo de Cassini.'],
      [['tumba', 'espiral', 'epitafio'], 'Pedí una espiral logarítmica y la frase «Eadem mutata resurgo»: «Resurgiré el mismo, aunque cambiado».'],
      [['familia', 'padre', 'teologia', 'teología', 'estudio', 'estudié'], 'Mis padres me obligaron a estudiar filosofía y teología. Estudié matemáticas y astronomía en contra de su voluntad.'],
      [['calculo', 'cálculo', 'leibniz', 'integral'], 'Con Johann estudié el cálculo de Leibniz cuando casi nadie lo entendía. En 1690 apareció por primera vez el término «integral».'],
      [['ecuacion', 'ecuación'], 'En 1696 resolví la ecuación hoy llamada de Bernoulli: y′ = p(x)y + q(x)yⁿ.']
    ]
  }
};
(() => {
  let who = 'euler';
  const log = document.getElementById('log'), msg = document.getElementById('msg'), sugg = document.getElementById('sugg');
  const SUG = { euler: ['¿Quién fue tu maestro?', '¿Qué pasó con tu vista?', '¿Cuál es tu fórmula famosa?', '¿Y tu familia?'],
                jacob: ['¿Qué es la probabilidad?', '¿Qué pasó con tu hermano?', '¿Qué hay en tu tumba?', '¿Qué es la lemniscata?'] };
  const norm = s => s.toLowerCase();
  function add(t, c) { const d = document.createElement('div'); d.className = 'm ' + c; d.innerHTML = t; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function reply(text) {
    const t = norm(text), b = BOTS[who];
    const hit = b.topics.find(([ks]) => ks.some(k => t.includes(k)));
    setTimeout(() => add(hit ? hit[1] : b.fallback, 'b'), 350);
  }
  function send(text) {
    if (!text.trim()) return;
    add(text.replace(/</g, '&lt;'), 'u'); reply(text); msg.value = '';
  }
  function start(w) {
    who = w; log.innerHTML = ''; add(BOTS[w].hi, 'b');
    sugg.innerHTML = SUG[w].map(s => `<button class="chip">${s}</button>`).join('');
    sugg.querySelectorAll('.chip').forEach(c => c.onclick = () => send(c.textContent));
  }
  document.querySelectorAll('.who .chip').forEach(b => b.onclick = () => {
    document.querySelectorAll('.who .chip').forEach(x => x.classList.toggle('on', x === b)); start(b.dataset.p);
  });
  document.getElementById('go').onclick = () => send(msg.value);
  msg.addEventListener('keydown', e => { if (e.key === 'Enter') send(msg.value); });
  start('euler');
})();
