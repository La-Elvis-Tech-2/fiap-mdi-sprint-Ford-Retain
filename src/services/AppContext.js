import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [points, setPoints]                   = useState(0);
  const [networkServices, setNetworkServices] = useState(0);
  const [totalServices, setTotalServices]     = useState(0);
  const [myVehicle, setMyVehicle]             = useState('');
  const [activities, setActivities]           = useState([]);
  const [pointsHistory, setPointsHistory]     = useState([0, 0, 0, 0, 0, 0, 0]);

  // ── Novo: lista de revisões agendadas ──────────────────────────────────────
  const [revisions, setRevisions]             = useState([]);

  const addPoints = useCallback((amount) => {
    setPoints(p => p + amount);
    setPointsHistory(h => {
      const next = [...h];
      next[next.length - 1] += amount;
      return next;
    });
  }, []);

  const addActivity = useCallback((activity) => {
    setActivities(a => [...a, { ...activity, time: 'agora mesmo', id: Date.now() }]);
  }, []);

  const registerNetworkService = useCallback(() => {
    setNetworkServices(n => n + 1);
    setTotalServices(t => t + 1);
  }, []);

  const registerOutsideService = useCallback(() => {
    setTotalServices(t => t + 1);
  }, []);

  // ── Novo: registrar revisão (usada por ScheduleScreen e HomeScreen) ────────
  const addRevision = useCallback((data) => {
    setRevisions(r => [...r, { id: Date.now(), ...data }]);
    setNetworkServices(n => n + 1);
    setTotalServices(t => t + 1);
  }, []);

  const vinShare = totalServices > 0
    ? Math.round((networkServices / totalServices) * 100)
    : 0;

  const getBadge = () => {
    if (points >= 200) return { name: 'Motor Expert',       short: 'Expert',   reward: '20% OFF + revisão grátis' };
    if (points >= 100) return { name: 'Mecânico Digital',   short: 'Mecânico', reward: '10% OFF na próxima revisão' };
    if (points >= 50)  return { name: 'Analista Iniciante', short: 'Analista', reward: 'Lavagem grátis na revisão' };
    return               { name: 'Piloto de Garagem',   short: 'Piloto',   reward: 'Continue pontuando para desbloquear' };
  };

  const getProgress = () => {
    if (points < 50)  return { pct: Math.round((points / 50) * 100),          next: `Faltam ${50 - points} pts para Analista` };
    if (points < 100) return { pct: Math.round(((points - 50) / 50) * 100),   next: `Faltam ${100 - points} pts para Mecânico Digital` };
    if (points < 200) return { pct: Math.round(((points - 100) / 100) * 100), next: `Faltam ${200 - points} pts para Motor Expert` };
    return                   { pct: 100,                                        next: 'Nível máximo atingido!' };
  };

  return (
    <AppContext.Provider value={{
      points, vinShare, networkServices, totalServices,
      myVehicle, setMyVehicle,
      activities, addActivity,
      pointsHistory,
      addPoints,
      registerNetworkService, registerOutsideService,
      revisions, addRevision,          // ← novo
      badge: getBadge(),
      progress: getProgress(),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};