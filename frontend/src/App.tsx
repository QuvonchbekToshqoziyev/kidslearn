import { FormEvent, useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';
type User = { id: string; name: string; email: string; role: string };
type Child = { id: string; name: string; birthDate: string };
type Activity = { id: string; title: string; description?: string; type: string; subject: string; ageMin: number; ageMax: number; content: { options?: string[]; answer?: string } };

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kidslearn-token');
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers ?? {}) } });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'So‘rov bajarilmadi');
  return response.json();
}

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [register, setRegister] = useState(false); const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); const data = Object.fromEntries(new FormData(event.currentTarget)); try { const result = await api<{ user: User; accessToken: string }>(register ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(data) }); localStorage.setItem('kidslearn-token', result.accessToken); onLogin(result.user); } catch (err) { setError(err instanceof Error ? err.message : 'Xatolik'); } }
  return <main className="auth"><section className="auth-card"><span className="logo">🧩 KidsLearn</span><h1>{register ? 'Ota-ona hisobini yarating' : 'Xush kelibsiz!'}</h1><p className="muted">Farzandingiz bilan birga o‘rganing.</p><form onSubmit={submit}>{register && <label>Ism<input name="name" required minLength={2} /></label>}<label>Email<input name="email" type="email" required /></label><label>Parol<input name="password" type="password" minLength={8} required /></label>{error && <p className="error">{error}</p>}<button type="submit">{register ? 'Ro‘yxatdan o‘tish' : 'Kirish'}</button></form><button className="link" onClick={() => setRegister(!register)}>{register ? 'Hisobim bor' : 'Yangi hisob yaratish'}</button></section></main>;
}

function Dashboard({ user, logout }: { user: User; logout: () => void }) {
  const [children, setChildren] = useState<Child[]>([]); const [activities, setActivities] = useState<Activity[]>([]); const [selected, setSelected] = useState<Child>(); const [message, setMessage] = useState('');
  useEffect(() => { Promise.all([api<Child[]>('/parent/children'), api<Activity[]>('/activities')]).then(([kids, acts]) => { setChildren(kids); setSelected(kids[0]); setActivities(acts); }).catch((err) => setMessage(err.message)); }, []);
  async function complete(activity: Activity) { if (!selected) return; await api(`/activities/${activity.id}/complete`, { method: 'POST', body: JSON.stringify({ childId: selected.id, score: 100 }) }); setMessage(`Ajoyib! ${selected.name} Bronze/Silver/Gold mukofot oldi ⭐`); }
  async function addChild(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); const child = await api<Child>('/parent/children', { method: 'POST', body: JSON.stringify(data) }); setChildren([...children, child]); setSelected(child); event.currentTarget.reset(); }
  return <div className="app"><header><span className="logo">🧩 KidsLearn</span><span className="user">{user.name} <button className="outline" onClick={logout}>Chiqish</button></span></header><main className="content"><section className="hero"><div><p className="eyebrow">BUGUNGI O‘QISH</p><h1>Salom, {selected?.name ?? 'kichkintoy'}! 👋</h1><p className="muted">Qiziqarli faoliyatni tanlang va yulduzchalar to‘plang.</p></div><div className="streak">🔥 0 kunlik streak</div></section><section className="switcher"><strong>Profilni tanlang:</strong>{children.map((child) => <button key={child.id} className={selected?.id === child.id ? 'selected' : ''} onClick={() => setSelected(child)}>{child.name}</button>)}<form onSubmit={addChild} className="add-child"><input name="name" placeholder="Bola ismi" required /><input name="birthDate" type="date" required /><button type="submit">+ Bola qo‘shish</button></form></section>{message && <p className="notice">{message}</p>}<section className="activity-grid">{activities.map((activity) => <article className="activity" key={activity.id}><span className="activity-icon">{activity.type === 'PUZZLE' ? '🧩' : activity.type === 'MEMORY' ? '🃏' : '🎯'}</span><p className="eyebrow">{activity.subject} · {activity.ageMin}–{activity.ageMax} yosh</p><h2>{activity.title}</h2><p className="muted">{activity.description ?? 'Yangi bilim va quvonchli o‘yin.'}</p><button onClick={() => complete(activity)}>Boshlash →</button></article>)}{activities.length === 0 && <div className="empty">Hozircha faoliyatlar mavjud emas.</div>}</section></main></div>;
}

export default function App() { const [user, setUser] = useState<User>(); useEffect(() => { if (localStorage.getItem('kidslearn-token')) { /* session restoration is completed by the next API call */ } }, []); return user ? <Dashboard user={user} logout={() => { localStorage.removeItem('kidslearn-token'); setUser(undefined); }} /> : <Login onLogin={setUser} />; }
