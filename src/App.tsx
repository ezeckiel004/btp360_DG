/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  FileText,
  User,
  Bell,
  AlertTriangle,
  ArrowRight,
  Download,
  History,
  ShieldCheck,
  LogOut,
  Package,
  TrendingDown,
  Search,
  ChevronRight,
  Smartphone,
  Trash2,
  MoreVertical,
  Clock,
  PlayCircle,
  Activity,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, PaymentRequest, AuditLog, Report, StockInfo, Project, GlobalActivity, ActivityType } from './types';

// Mock Data
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Villa Riviera', location: 'Bingerville', progress: 55, status: 'on_track', budgetStatus: 'alert' },
  { id: 'p2', name: 'Immeuble Plateau', location: 'Plateau', progress: 78, status: 'ahead', budgetStatus: 'ok' },
  { id: 'p3', name: 'Cité Espoir', location: 'Angré', progress: 20, status: 'behind', budgetStatus: 'warning' },
];

const MOCK_GLOBAL_ACTIVITIES: GlobalActivity[] = [
  { id: 'ga1', type: 'task_end', title: 'Fondations Terminées', description: 'Le coulage des fondations du Bloc A est achevé.', user: 'CT-Marc', date: 'Il y a 10m', priority: 'medium' },
  { id: 'ga2', type: 'payment', title: 'Approbation Requise', description: 'Demande de 1,2M XOF pour Soro Bakary.', user: 'Système', date: 'Il y a 25m', priority: 'high' },
  { id: 'ga3', type: 'task_start', title: 'Élévation Murs R+1', description: 'Début de l\'élévation des murs au Site B.', user: 'DT-Jean', date: 'Il y a 1h', priority: 'low' },
  { id: 'ga4', type: 'report', title: 'Rapport Soirée Dispo', description: 'Le journal du site A est prêt pour consultation.', user: 'Système', date: '18:05', priority: 'medium' },
  { id: 'ga5', type: 'stock', title: 'Transfert Validé', description: '50 sacs de ciment déplacés vers Site C.', user: 'Mag-Paul', date: 'Hier', priority: 'low' },
];

const MOCK_PAYMENTS: PaymentRequest[] = [
  { id: '1', tacheron: 'Koné Alassane', chantier: 'Chantier A - Villa Riviera', montant: 450000, date: '2024-03-20', status: 'pending' },
  { id: '2', tacheron: 'Soro Bakary', chantier: 'Chantier B - Immeuble Plateau', montant: 1200000, date: '2024-03-19', status: 'pending' },
  { id: '3', tacheron: 'Yao Kouassi', chantier: 'Chantier A - Villa Riviera', montant: 300000, date: '2024-03-18', status: 'pending' },
];

const MOCK_AUDIT: AuditLog[] = [
  { id: 'a1', date: '14:30', user: 'DT-Jean', action: 'Modif. Contrat Tâcheron X', oldValue: '200k', newValue: '250k' },
  { id: 'a2', date: '12:15', user: 'Mag-Paul', action: 'Sortie Stock Critique', newValue: 'Ciment x50' },
  { id: 'a3', date: '10:00', user: 'CT-Marc', action: 'Validation Tech Paiement', newValue: 'Req #452' },
  { id: 'a4', date: 'Hier', user: 'DT-Jean', action: 'Création Chantier C', newValue: 'Site Bingerville' },
  { id: 'a5', date: 'Hier', user: 'Mag-Paul', action: 'Transfert Matériel', oldValue: 'Site A', newValue: 'Site B' },
];

const MOCK_REPORTS: Report[] = [
  { id: 'r1', title: 'Journal de chantier - Site A', date: '20/03/2024 18:00', type: 'PDF' },
  { id: 'r2', title: 'Journal de chantier - Site B', date: '20/03/2024 18:00', type: 'PDF' },
  { id: 'r3', title: 'Rapport Hebdomadaire Finance', date: '17/03/2024', type: 'PDF' },
];

const MOCK_STOCK: StockInfo[] = [
  { id: 's1', material: 'Ciment CPJ 45', category: 'Matériaux', quantity: 5, unit: 'sacs', site: 'Site A', status: 'critical' },
  { id: 's2', material: 'Fer 12', category: 'Ferraille', quantity: 10, unit: 'barres', site: 'Site B', status: 'critical' },
  { id: 's3', material: 'Sable Fin', category: 'Agrégats', quantity: 2, unit: 'm3', site: 'Site A', status: 'low' },
  { id: 's4', material: 'Gravier 15/25', category: 'Agrégats', quantity: 15, unit: 'm3', site: 'Site C', status: 'normal' },
  { id: 's5', material: 'Peinture Blanche', category: 'Finition', quantity: 45, unit: 'L', site: 'Site B', status: 'normal' },
  { id: 's6', material: 'Tuyau PVC 100', category: 'Plomberie', quantity: 12, unit: 'unités', site: 'Site A', status: 'normal' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [payments, setPayments] = useState<PaymentRequest[]>(MOCK_PAYMENTS);
  const [notifications, setNotifications] = useState(3);

  const pendingPaymentsCount = payments.filter(p => p.status === 'pending').length;

  const approvePayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white h-screen shadow-2xl relative flex flex-col overflow-hidden border-x border-slate-200">

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentPage === Page.Dashboard && (
              <DashboardPage
                pendingCount={pendingPaymentsCount}
                onGoToApprovals={() => setCurrentPage(Page.Approvals)}
                onGoToStock={() => setCurrentPage(Page.Stock)}
              />
            )}
            {currentPage === Page.Approvals && (
              <ApprovalsPage
                payments={payments}
                onApprove={approvePayment}
              />
            )}
            {currentPage === Page.Stock && <InventoryView onBack={() => setCurrentPage(Page.Dashboard)} isStandalone={true} />}
            {currentPage === Page.Reports && <ReportsPage onGoToInventory={() => setCurrentPage(Page.Stock)} />}
            {currentPage === Page.Profile && <ProfilePage />}
          </AnimatePresence>
          {/* Spacer for bottom padding inside scroll area if needed, though flex container handles it */}
          <div className="h-8" />
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="h-20 bg-white/90 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-50 shrink-0">
          <NavButton
            active={currentPage === Page.Dashboard}
            onClick={() => setCurrentPage(Page.Dashboard)}
            icon={<LayoutDashboard size={22} />}
            label="Accueil"
          />
          <NavButton
            active={currentPage === Page.Approvals}
            onClick={() => setCurrentPage(Page.Approvals)}
            icon={<CheckCircle2 size={22} />}
            label="Approbs"
            badge={pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined}
          />
          <NavButton
            active={currentPage === Page.Stock}
            onClick={() => setCurrentPage(Page.Stock)}
            icon={<Package size={22} />}
            label="Stocks"
          />
          <NavButton
            active={currentPage === Page.Reports}
            onClick={() => setCurrentPage(Page.Reports)}
            icon={<FileText size={22} />}
            label="Docs"
          />
          <NavButton
            active={currentPage === Page.Profile}
            onClick={() => setCurrentPage(Page.Profile)}
            icon={<User size={22} />}
            label="Compte"
          />
        </nav>
      </div>
    </div>
  );
}

// --- SUB-PAGES ---

function DashboardPage({
  pendingCount,
  onGoToApprovals,
  onGoToStock
}: {
  pendingCount: number,
  onGoToApprovals: () => void,
  onGoToStock: () => void
}) {
  const criticalStockCount = MOCK_STOCK.filter(s => s.status === 'critical').length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-5 space-y-6"
    >
      <header className="flex justify-between items-start pt-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 italic font-serif">BTP 360</h1>
          <p className="text-slate-500 text-sm">Dashboard DG • Pilote</p>
        </div>
        <button className="relative p-2 bg-slate-100 rounded-full text-slate-600">
          <Bell size={20} />
          {pendingCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </header>

      {/* Quick View Stats */}
      <section className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        <motion.div
          onClick={onGoToApprovals}
          whileTap={{ scale: 0.98 }}
          className="bg-indigo-600 p-5 rounded-[32px] text-white shadow-lg shadow-indigo-100 cursor-pointer min-w-[240px] shrink-0"
        >
          <div className="flex justify-between items-center mb-4">
            <CheckCircle2 size={24} className="opacity-80" />
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Urgent</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">{pendingCount}</h2>
          <p className="text-indigo-100 text-xs font-medium mb-3">Paiements en attente DG</p>
          <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
            VOIR TOUT <ArrowRight size={10} />
          </div>
        </motion.div>

        <div className="bg-white border border-slate-100 p-5 rounded-[32px] shadow-sm min-w-[200px] shrink-0">
          <div className="flex justify-between items-center mb-4">
            <Layers size={24} className="text-emerald-500" />
            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Global</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{MOCK_PROJECTS.length}</h2>
          <p className="text-slate-400 text-xs font-medium mb-3">Chantiers Actifs</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300">
            DÉTAILS <ArrowRight size={10} />
          </div>
        </div>
      </section>

      {/* Project Progress Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Activity size={18} className="text-indigo-500" />
            Suivi des Travaux
          </h3>
          <button className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Voir Projets</button>
        </div>
        <div className="space-y-4">
          {MOCK_PROJECTS.map(project => (
            <div key={project.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{project.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{project.location}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${project.status === 'ahead' ? 'bg-emerald-50 text-emerald-600' :
                  project.status === 'behind' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                  {project.status === 'ahead' ? '+ Avance' : project.status === 'behind' ? '- Retard' : 'Normal'}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                  <span>Progression</span>
                  <span className="text-slate-900">{project.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className={`h-full rounded-full ${project.budgetStatus === 'alert' ? 'bg-rose-500' :
                      project.budgetStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Critical Alerts Bar */}
      <div className="space-y-3">
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-3xl flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
            <TrendingDown size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-rose-900 text-xs uppercase tracking-wider">Alerte Rentabilité</h3>
            <p className="text-rose-700 text-[10px] leading-tight">Site A: Budget 80% / Travaux 55%</p>
          </div>
          <AlertTriangle size={18} className="text-rose-500" />
        </div>

        {criticalStockCount > 0 && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onGoToStock}
            className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex items-center gap-4 cursor-pointer"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200">
              <Package size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider">Stock Critique</h3>
              <p className="text-amber-700 text-[10px] leading-tight">{criticalStockCount} articles en rupture sur 2 chantiers</p>
            </div>
            <ArrowRight size={18} className="text-amber-500" />
          </motion.div>
        )}
      </div>

      {/* Activity Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <History size={18} className="text-indigo-500" />
            Flux d'Activité Global
          </h3>
          <button className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Filtrer</button>
        </div>
        <div className="space-y-3">
          {MOCK_GLOBAL_ACTIVITIES.map((ga) => (
            <React.Fragment key={ga.id}>
              <GlobalActivityCard activity={ga} />
            </React.Fragment>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function ApprovalsPage({ payments, onApprove }: { payments: PaymentRequest[], onApprove: (id: string) => void }) {
  const [selected, setSelected] = useState<PaymentRequest | null>(null);

  const pending = payments.filter(p => p.status === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 flex flex-col min-h-full"
    >
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-slate-900">Approbation Finale</h1>
        <p className="text-slate-500 text-sm">Validation finale DG des décaissements</p>
      </header>

      {selected ? (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          <button onClick={() => setSelected(null)} className="text-indigo-600 text-sm font-bold flex items-center gap-1">
            <ChevronRight size={18} className="rotate-180" /> Retour
          </button>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] space-y-4 shadow-xl">
            <div className="space-y-1">
              <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Montant à débloquer</p>
              <h2 className="text-4xl font-bold font-mono">{selected.montant.toLocaleString()} <span className="text-xl">XOF</span></h2>
            </div>

            <div className="h-px bg-white/10" />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Tâcheron</p>
                <p className="text-sm font-semibold">{selected.tacheron}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Chantier</p>
                <p className="text-sm font-semibold">{selected.chantier}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Validé Tech par</p>
                <p className="text-sm font-semibold">C.T. Marc-Antoine</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <ShieldCheck size={20} />
              <p className="text-sm font-medium">Validation Technique Complète</p>
            </div>
            <p className="text-xs text-slate-500 italic">
              En cliquant sur "Approuvé", vous certifiez avoir pris connaissance des détails de la réalisation technique liée à ce paiement.
            </p>
          </div>

          <button
            onClick={() => {
              onApprove(selected.id);
              setSelected(null);
            }}
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-lg shadow-lg shadow-emerald-100 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={24} />
            APPROUVÉ
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 italic">
              <CheckCircle2 size={48} className="mb-4 opacity-20" />
              <p>Aucune demande en attente</p>
            </div>
          ) : (
            pending.map(p => (
              <React.Fragment key={p.id}>
                <PaymentCard item={p} onClick={() => setSelected(p)} />
              </React.Fragment>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}

function ReportsPage({ onGoToInventory }: { onGoToInventory: () => void }) {
  const [showInventory, setShowInventory] = useState(false);

  if (showInventory) {
    return <InventoryView onBack={() => setShowInventory(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 space-y-8"
    >
      <header className="pt-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pilotage & Audit</h1>
        <p className="text-slate-500 text-sm">Transparence et traçabilité globale</p>
      </header>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un rapport..."
          className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      {/* Reports Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-900">Derniers Rapports (21h00)</h3>
        </div>
        <div className="space-y-3">
          {MOCK_REPORTS.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{r.title}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{r.date}</p>
                </div>
              </div>
              <Download size={18} className="text-slate-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Audit Log Access */}
      <section className="bg-slate-900 text-white p-6 rounded-[32px] space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <History size={20} />
          </div>
          <h3 className="font-bold">Mouchard (Journal)</h3>
        </div>
        <p className="text-xs text-slate-400">Consultez l'historique complet des modifications, suppressions et ajustements budgétaires effectues sur la plateforme.</p>
        <button className="w-full bg-white text-slate-900 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">
          Accéder à l'Audit (Lecture Seule)
        </button>
      </section>

      {/* Stock Summary */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-900">Aperçu des Stocks</h3>
          <button
            onClick={onGoToInventory}
            className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest"
          >
            Voir Tout
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_STOCK.slice(0, 2).map((s) => (
            <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${s.status === 'critical' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                  }`}>
                  {s.status === 'critical' ? 'Critique' : 'Faible'}
                </span>
                <Package size={14} className="text-slate-300" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">{s.material}</h4>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500">{s.site}</p>
                <p className="text-xs font-mono font-bold text-slate-900">{s.quantity} {s.unit}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onGoToInventory}
          className="w-full border-2 border-dashed border-slate-200 text-slate-400 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-400 transition-colors"
        >
          Consulter l'Inventaire Complet
        </button>
      </section>
    </motion.div>
  );
}

function InventoryView({ onBack, isStandalone }: { onBack: () => void, isStandalone?: boolean }) {
  const [selectedSite, setSelectedSite] = useState<string>('Tous');
  const sites = ['Tous', ...Array.from(new Set(MOCK_STOCK.map(s => s.site)))];

  const filteredStock = selectedSite === 'Tous'
    ? MOCK_STOCK
    : MOCK_STOCK.filter(s => s.site === selectedSite);

  return (
    <motion.div
      initial={{ x: isStandalone ? 10 : 300, opacity: isStandalone ? 0 : 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isStandalone ? -10 : 300, opacity: isStandalone ? 0 : 1 }}
      className="flex flex-col min-h-full bg-slate-50"
    >
      <header className="p-5 bg-white border-b border-slate-100 sticky top-0 z-40">
        {!isStandalone && (
          <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center gap-1 mb-4">
            <ChevronRight size={18} className="rotate-180" /> Pilotage
          </button>
        )}
        <div className={isStandalone ? "pt-4" : ""}>
          <h1 className="text-2xl font-bold text-slate-900">Inventaire Global</h1>
          <p className="text-slate-500 text-xs">Suivi en temps réel par article et chantier</p>
        </div>
      </header>

      {/* Site Filter Tabs */}
      <div className="flex gap-2 p-4 overflow-x-auto scrollbar-hide bg-white shadow-sm border-b border-slate-100">
        {sites.map(site => (
          <button
            key={site}
            onClick={() => setSelectedSite(site)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedSite === site
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-500'
              }`}
          >
            {site}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* Inventory Table/List */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_80px_80px] p-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Article / Chantier</span>
            <span className="text-right">Stock</span>
            <span className="text-right">Statut</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredStock.map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_80px] p-4 items-center">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800">{item.material}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase">{item.site} • {item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-slate-900">{item.quantity}</p>
                  <p className="text-[9px] text-slate-400 uppercase">{item.unit}</p>
                </div>
                <div className="flex justify-end">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'critical' ? 'bg-rose-500 shadow-rose-200 shadow-[0_0_8px]' :
                    item.status === 'low' ? 'bg-amber-500 shadow-amber-200 shadow-[0_0_8px]' :
                      'bg-emerald-500'
                    }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Button */}
        <button className="w-full bg-indigo-600 text-white p-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-transform flex items-center justify-center gap-2">
          <Package size={16} />
          Ordonner un transfert
        </button>
      </div>

      <div className="p-8 text-center text-[10px] text-slate-400 italic">
        Dernière mise à jour: Aujourd'hui à 15:30
      </div>
    </motion.div>
  );
}

function ProfilePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-5 space-y-8"
    >
      <header className="flex flex-col items-center text-center space-y-4 pt-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ezeckiel&backgroundColor=b6e3f4"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-white text-white">
            <Smartphone size={12} />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ezéckiel Kantchi</h1>
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest">Directeur Général (DG)</p>
        </div>
      </header>

      {/* Privileges */}
      <section className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-indigo-600" />
          <h3 className="font-bold text-indigo-900">Privilèges & Accès</h3>
        </div>
        <div className="space-y-2">
          <PrivilegeRow label="Accès Complet ERP" granted={true} />
          <PrivilegeRow label="Validation Financière Finale" granted={true} />
          <PrivilegeRow label="Suppression (DELETE) Exclusive" granted={true} />
          <PrivilegeRow label="Gestion Audit Trail" granted={true} />
        </div>
        <p className="text-[10px] text-indigo-400 italic pt-2">Sécurité: Droit de suppression réservé au DG uniquement.</p>
      </section>

      {/* Settings */}
      <section className="space-y-3">
        <h3 className="font-bold text-slate-900 px-1">Paramètres</h3>
        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
          <SettingRow icon={<TrendingDown size={18} />} label="Seuils d'Alerte de Rentabilité" value="80% budget / 50% réal." />
          <SettingRow icon={<Bell size={18} />} label="Fréquence des Notifications" value="Immédiat" />
          <SettingRow icon={<LayoutDashboard size={18} />} label="Préférences Dashboard" />
        </div>
      </section>

      {/* Final Action */}
      <button className="w-full flex items-center justify-center gap-3 py-5 text-rose-600 font-bold bg-rose-50 rounded-3xl active:scale-95 transition-transform border border-rose-100">
        <LogOut size={20} />
        Déconnexion / Logout
      </button>

      <p className="text-center text-[10px] text-slate-300 font-medium pb-4">
        BTP 360 v2.1.0 • Build ID #48291
      </p>
    </motion.div>
  );
}

function GlobalActivityCard({ activity }: { activity: GlobalActivity }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'task_end': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'task_start': return <PlayCircle className="text-indigo-500" size={16} />;
      case 'payment': return <ShieldCheck className="text-amber-500" size={16} />;
      case 'report': return <FileText className="text-slate-400" size={16} />;
      case 'stock': return <Package className="text-blue-500" size={16} />;
      default: return <History className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm active:bg-slate-50 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.priority === 'high' ? 'bg-rose-50' :
        activity.priority === 'medium' ? 'bg-indigo-50' : 'bg-slate-50'
        }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
          <span className="text-[10px] font-mono text-slate-400">{activity.date}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-2">{activity.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded uppercase">{activity.user}</span>
          {activity.priority === 'high' && (
            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded uppercase">CRITIQUE</span>
          )}
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavButton({ active, onClick, icon, label, badge }: {
  active: boolean,
  onClick: () => void,
  icon: React.ReactNode,
  label: string,
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-2 transition-all ${active ? 'text-indigo-600' : 'text-slate-400'}`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-tighter transition-all ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </span>
      {badge !== undefined && !active && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
          {badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"
        />
      )}
    </button>
  );
}

function PaymentCard({ item, onClick }: { item: PaymentRequest, onClick: () => void }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
    >
      <div className="space-y-1">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.tacheron}</p>
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.chantier}</h4>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold font-mono text-slate-900">{item.montant.toLocaleString()} <span className="text-[10px] text-slate-400">XOF</span></p>
        </div>
      </div>
      <ChevronRight size={20} className="text-slate-300" />
    </motion.div>
  );
}

function PrivilegeRow({ label, granted }: { label: string, granted: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-indigo-800 font-medium">{label}</span>
      <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm shadow-emerald-200" />
    </div>
  );
}

function SettingRow({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  return (
    <div className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="text-slate-400 group-active:text-indigo-500 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{label}</p>
          {value && <p className="text-xs text-slate-500 font-mono">{value}</p>}
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  );
}
