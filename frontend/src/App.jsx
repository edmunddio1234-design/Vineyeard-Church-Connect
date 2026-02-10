import { useState, useEffect } from 'react';
import { T } from './theme';
import { MEMBERS } from './constants';
import { api } from './api';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';
import MyProfile from './pages/MyProfile';
import MessagesPage from './pages/MessagesPage';
import ConnectionsPage from './pages/ConnectionsPage';
import JobBoardPage from './pages/JobBoardPage';
import PrayerRequestPage from './pages/PrayerRequestPage';
import { GalleryPage } from './pages/GalleryPage';
import { SuggestionsPage } from './pages/SuggestionsPage';
import { ConnectionTree } from './pages/ConnectionTree';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selMember, setSelMember] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [members, setMembers] = useState(MEMBERS);

  // Fetch real members from API when user is logged in
  useEffect(() => {
    if (user) {
      api.getMembers()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setMembers(data);
          }
        })
        .catch(() => {
          // Fall back to mock data silently
        });
    }
  }, [user]);

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  const handleMsg = (m) => {
    setActiveChat(m.id);
    setPage('messages');
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: T.bg,
      minHeight: '100vh',
      color: T.text,
    }}>
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        notifications={2}
        onLogout={() => { setUser(null); setPage('home'); }}
      />
      {page === 'home' && (
        <HomePage user={user} members={members} setPage={setPage} setSelMember={setSelMember} />
      )}
      {page === 'directory' && (
        <DirectoryPage members={members} setPage={setPage} setSelMember={setSelMember} />
      )}
      {page === 'profile-view' && (
        <ProfileView member={selMember} setPage={setPage} onMessage={handleMsg} />
      )}
      {page === 'profile-me' && (
        <MyProfile user={user} setPage={setPage} />
      )}
      {page === 'profile-edit' && (
        <ProfileEdit user={user} setUser={setUser} setPage={setPage} />
      )}
      {page === 'messages' && (
        <MessagesPage members={members} activeChat={activeChat} setActiveChat={setActiveChat} />
      )}
      {page === 'connections' && (
        <ConnectionsPage members={members} />
      )}
      {page === 'jobs' && (
        <JobBoardPage members={members} />
      )}
      {page === 'prayer' && (
        <PrayerRequestPage members={members} />
      )}
      {page === 'gallery' && (
        <GalleryPage members={members} />
      )}
      {page === 'suggestions' && (
        <SuggestionsPage members={members} />
      )}
      {page === 'tree' && (
        <ConnectionTree members={members} />
      )}
    </div>
  );
}

export default App;
