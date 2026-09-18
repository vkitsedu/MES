import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, Plus, Trash2, ArrowLeft, ArrowRight, Save, 
  Download, Upload, AlertTriangle, CheckCircle2, RefreshCw, 
  Search, Cpu, Printer, Flame, Eye, Zap, Layers, Settings, 
  Info, ExternalLink, X, ChevronRight, Activity, GripVertical
} from 'lucide-react';
import { 
  EquipmentCatalogItem, 
  LineTopologyConfig, 
  LineStationConfig, 
  EquipmentCategory, 
  ProtocolType 
} from '@mes/shared';
import { authService } from '../../services/auth.service';

export const LineLayoutStudio: React.FC = () => {
  // State: Lines & Selection
  const [lines, setLines] = useState<LineTopologyConfig[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<string>('line-smt-01');
  const [catalog, setCatalog] = useState<EquipmentCatalogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Line Working Copy (editable without committing immediately)
  const [activeLine, setActiveLine] = useState<LineTopologyConfig | null>(null);

  // Catalog Filter
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('ALL');

  // Selected Station for Property Inspector
  const [selectedStationIndex, setSelectedStationIndex] = useState<number | null>(null);

  // Drag-and-Drop Interaction State
  const [draggedStationIndex, setDraggedStationIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingFromCatalog, setIsDraggingFromCatalog] = useState<boolean>(false);

  // Modal: Register Custom Machine Model
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [newModelForm, setNewModelForm] = useState({
    manufacturer: '',
    modelName: '',
    category: 'PICK_AND_PLACE' as EquipmentCategory,
    defaultCycleTimeSec: 18.0,
    ratedCph: 90000,
    protocol: 'IPC_CFX' as ProtocolType
  });

  // Modal: Create New Production Line
  const [isNewLineModalOpen, setIsNewLineModalOpen] = useState<boolean>(false);
  const [newLineForm, setNewLineForm] = useState({
    name: '',
    code: '',
    taktTargetSec: 18.0
  });

  // Load lines and catalog from backend
  const loadStudioData = async () => {
    try {
      setLoading(true);
      const [linesRes, catRes] = await Promise.all([
        authService.authFetch('/api/v1/lines').catch(() => null),
        authService.authFetch('/api/v1/equipment/catalog').catch(() => null)
      ]);

      let linesData: LineTopologyConfig[] = [];
      if (linesRes?.ok) {
        linesData = await linesRes.json();
        setLines(linesData);
      }

      if (catRes?.ok) {
        const catData: EquipmentCatalogItem[] = await catRes.json();
        setCatalog(catData);
      }

      // Initialize active working copy
      if (linesData.length > 0) {
        const current = linesData.find(l => l.id === selectedLineId) || linesData[0];
        setSelectedLineId(current.id);
        setActiveLine(JSON.parse(JSON.stringify(current)));
      }
    } catch (err) {
      console.error('Failed to load studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudioData();
  }, []);

  // When selected line changes in dropdown, reset active working copy
  const handleSelectLine = (lineId: string) => {
    setSelectedLineId(lineId);
    const target = lines.find(l => l.id === lineId);
    if (target) {
      setActiveLine(JSON.parse(JSON.stringify(target)));
      setSelectedStationIndex(null);
    }
  };

  // Show auto-dismissing toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Unique manufacturers for filter chips
  const manufacturers = useMemo(() => {
    const list = Array.from(new Set(catalog.map(c => c.manufacturer))).sort();
    return ['ALL', ...list];
  }, [catalog]);

  // Filtered catalog list
  const filteredCatalog = useMemo(() => {
    return catalog.filter(item => {
      const matchesMfg = selectedManufacturer === 'ALL' || item.manufacturer === selectedManufacturer;
      const q = catalogSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        item.modelName.toLowerCase().includes(q) || 
        item.manufacturer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesMfg && matchesSearch;
    });
  }, [catalog, selectedManufacturer, catalogSearch]);

  // Bottleneck & Line Balance calculations
  const lineStats = useMemo(() => {
    if (!activeLine || !activeLine.stations || activeLine.stations.length === 0) {
      return { slowestStation: null, bottleneckCycle: 0, lineBalancePct: 100, totalCycle: 0 };
    }

    const stations = activeLine.stations;
    let maxCycle = 0;
    let slowest: LineStationConfig | null = null;
    let sumCycle = 0;

    for (const s of stations) {
      const c = Number(s.cycleTimeNominalSec || 15);
      sumCycle += c;
      if (c > maxCycle) {
        maxCycle = c;
        slowest = s;
      }
    }

    const takt = activeLine.taktTargetSec || 18.0;
    const balancePct = maxCycle > 0 
      ? Math.round((sumCycle / (stations.length * maxCycle)) * 100) 
      : 100;

    return {
      slowestStation: slowest,
      bottleneckCycle: maxCycle,
      lineBalancePct: balancePct,
      totalCycle: Number(sumCycle.toFixed(1)),
      isOverTakt: maxCycle > takt
    };
  }, [activeLine]);

  // Conveyor station manipulation
  const handleAddStationFromCatalog = (template: EquipmentCatalogItem, insertIndex?: number) => {
    if (!activeLine) return;

    const newStation: LineStationConfig = {
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: `${String(template.manufacturer || 'EQ').toUpperCase().slice(0, 3)}-${String(template.modelName || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)}`,
      name: `${template.manufacturer} ${template.modelName}`,
      customerCode: `${template.category.slice(0, 3)}-0${(activeLine.stations?.length || 0) + 1}`,
      type: template.category,
      sequenceOrder: 1,
      cycleTimeNominalSec: template.defaultCycleTimeSec || 15.0,
      manufacturer: template.manufacturer,
      modelName: template.modelName,
      protocolBinding: {
        protocol: template.supportedProtocols[0] || 'IPC_CFX'
      },
      towerLamp: 'RUN'
    };

    const updatedStations = [...(activeLine.stations || [])];
    if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= updatedStations.length) {
      updatedStations.splice(insertIndex, 0, newStation);
    } else {
      updatedStations.push(newStation);
    }

    // Re-index sequences
    updatedStations.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    setActiveLine({
      ...activeLine,
      stations: updatedStations
    });

    setSelectedStationIndex(typeof insertIndex === 'number' ? insertIndex : updatedStations.length - 1);
    showToast(`Added ${template.modelName} to conveyor line`);
  };

  const handleMoveStation = (index: number, direction: 'LEFT' | 'RIGHT') => {
    if (!activeLine || !activeLine.stations) return;
    const targetIdx = direction === 'LEFT' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= activeLine.stations.length) return;

    const updated = [...activeLine.stations];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updated.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    setActiveLine({ ...activeLine, stations: updated });
    setSelectedStationIndex(targetIdx);
  };

  const handleReorderStation = (fromIndex: number, toIndex: number) => {
    if (!activeLine || !activeLine.stations) return;
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= activeLine.stations.length || toIndex >= activeLine.stations.length) return;

    const updated = [...activeLine.stations];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    updated.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    setActiveLine({ ...activeLine, stations: updated });
    setSelectedStationIndex(toIndex);
    showToast(`Reordered ${moved.name} to position #${toIndex + 1}`);
  };

  const handleRemoveStation = (index: number) => {
    if (!activeLine || !activeLine.stations) return;
    const removedName = activeLine.stations[index]?.name || 'Station';
    const updated = activeLine.stations.filter((_, idx) => idx !== index);
    updated.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    setActiveLine({ ...activeLine, stations: updated });
    setSelectedStationIndex(null);
    showToast(`Removed ${removedName} from line`);
  };

  const handleDuplicateStation = (index: number) => {
    if (!activeLine || !activeLine.stations) return;
    const src = activeLine.stations[index];
    const copy: LineStationConfig = {
      ...JSON.parse(JSON.stringify(src)),
      id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${src.name} (Copy)`,
      customerCode: `${src.customerCode || src.code}-B`
    };

    const updated = [...activeLine.stations];
    updated.splice(index + 1, 0, copy);
    updated.forEach((s, idx) => {
      s.sequenceOrder = idx + 1;
    });

    setActiveLine({ ...activeLine, stations: updated });
    setSelectedStationIndex(index + 1);
    showToast(`Duplicated ${src.name}`);
  };

  // Commit and deploy to MES
  const handleDeployToMes = async () => {
    if (!activeLine) return;
    try {
      setSaving(true);
      const res = await authService.authFetch(`/api/v1/lines/${activeLine.id}/topology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineName: activeLine.name,
          lineCode: activeLine.code,
          taktTargetSec: activeLine.taktTargetSec,
          status: activeLine.status,
          stations: activeLine.stations
        })
      });

      if (!res.ok) {
        throw new Error(`Deployment failed: ${res.statusText}`);
      }

      const result = await res.json();
      showToast('Topology deployed to MES successfully');

      // Refresh master lines list
      await loadStudioData();
    } catch (err: any) {
      console.error('Failed to deploy topology:', err);
      showToast(`Error: ${err.message || 'Deployment failed'}`);
    } finally {
      setSaving(false);
    }
  };

  // Export blueprint JSON
  const handleExportBlueprint = () => {
    if (!activeLine) return;
    const jsonStr = JSON.stringify(activeLine, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeLine.code.toLowerCase()}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported line layout blueprint JSON');
  };

  // Import blueprint JSON
  const handleImportBlueprint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.stations)) {
          setActiveLine({
            ...activeLine!,
            name: parsed.name || activeLine!.name,
            code: parsed.code || activeLine!.code,
            taktTargetSec: parsed.taktTargetSec || activeLine!.taktTargetSec,
            stations: parsed.stations
          });
          showToast('Imported blueprint layout into studio');
        } else {
          showToast('Invalid blueprint JSON format');
        }
      } catch {
        showToast('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Register new machine model
  const handleRegisterNewModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelForm.manufacturer || !newModelForm.modelName) return;

    try {
      const res = await authService.authFetch('/api/v1/equipment/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturer: newModelForm.manufacturer,
          modelName: newModelForm.modelName,
          category: newModelForm.category,
          defaultCycleTimeSec: Number(newModelForm.defaultCycleTimeSec),
          ratedCph: Number(newModelForm.ratedCph),
          supportedProtocols: [newModelForm.protocol]
        })
      });

      if (res.ok) {
        const created = await res.json();
        setCatalog(prev => [created, ...prev]);
        setIsRegisterModalOpen(false);
        setNewModelForm({
          manufacturer: '',
          modelName: '',
          category: 'PICK_AND_PLACE',
          defaultCycleTimeSec: 18.0,
          ratedCph: 90000,
          protocol: 'IPC_CFX'
        });
        showToast(`Registered ${created.manufacturer} ${created.modelName} to catalog`);
      }
    } catch (err) {
      console.error('Failed to register model:', err);
    }
  };

  // Create new line
  const handleCreateNewLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineForm.code || !newLineForm.name) return;

    try {
      const res = await authService.authFetch('/api/v1/lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newLineForm.code,
          name: newLineForm.name,
          taktTargetSec: Number(newLineForm.taktTargetSec)
        })
      });

      if (res.ok) {
        const created = await res.json();
        setLines(prev => [...prev, created]);
        setSelectedLineId(created.id);
        setActiveLine(created);
        setIsNewLineModalOpen(false);
        setNewLineForm({ name: '', code: '', taktTargetSec: 18.0 });
        showToast(`Created new production line: ${created.name}`);
      }
    } catch (err) {
      console.error('Failed to create line:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PRINTER': return <Printer className="w-3.5 h-3.5 text-blue-400" />;
      case 'SPI': return <Search className="w-3.5 h-3.5 text-cyan-400" />;
      case 'PICK_AND_PLACE': return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case 'REFLOW': return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'AOI': return <Eye className="w-3.5 h-3.5 text-indigo-400" />;
      case 'XRAY': return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      case 'LASER': return <Zap className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const selectedStation = selectedStationIndex !== null && activeLine?.stations 
    ? activeLine.stations[selectedStationIndex] 
    : null;

  return (
    <div className="space-y-3 font-sans pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--mes-bg-surface)] border border-[var(--mes-accent-primary)] text-[var(--mes-text-primary)] px-4 py-2 rounded-[var(--mes-radius)] shadow-lg flex items-center gap-2 text-xs font-mono animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[var(--mes-status-pass)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Line Config Toolbar */}
      <div 
        className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3 space-y-3"
        style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--mes-border-hairline)] pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--mes-accent-primary)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--mes-text-primary)] font-mono">
                Visual SMT Line & Floor Layout Studio
              </span>
            </div>

            {/* Line Dropdown Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedLineId}
                onChange={(e) => {
                  if (e.target.value === '__NEW__') {
                    setIsNewLineModalOpen(true);
                  } else {
                    handleSelectLine(e.target.value);
                  }
                }}
                className="bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] text-xs text-[var(--mes-text-primary)] font-mono rounded-[var(--mes-radius)] px-2.5 py-1.5 focus:outline-none focus:border-[var(--mes-accent-primary)]"
              >
                {lines.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.code} — {l.name}
                  </option>
                ))}
                <option value="__NEW__">+ Create New Production Line...</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-text-primary)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-xs flex items-center gap-1.5 font-mono transition-colors"
              title="Register a new machine make/model into catalog"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
              <span>+ Custom Machine Model</span>
            </button>

            <button
              onClick={handleExportBlueprint}
              className="bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-text-secondary)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-xs flex items-center gap-1 font-mono transition-colors"
              title="Export layout JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label className="bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-text-secondary)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-xs flex items-center gap-1 font-mono cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportBlueprint} className="hidden" />
            </label>

            <button
              onClick={handleDeployToMes}
              disabled={saving || !activeLine}
              className="bg-[var(--mes-status-pass)] hover:opacity-90 text-slate-950 font-bold px-3.5 py-1.5 rounded-[var(--mes-radius)] text-xs flex items-center gap-1.5 font-mono transition-all disabled:opacity-50"
              style={{ boxShadow: 'var(--mes-glow-pass)' }}
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'COMMITTING...' : 'DEPLOY TO MES'}</span>
            </button>
          </div>
        </div>

        {/* Line Configuration Metadata Bar */}
        {activeLine && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label className="text-[10px] text-[var(--mes-text-muted)] uppercase tracking-wider block mb-1">
                Customer Line Name
              </label>
              <input
                type="text"
                value={activeLine.name}
                onChange={(e) => setActiveLine({ ...activeLine, name: e.target.value })}
                className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)] font-bold text-xs"
                placeholder="e.g. SMT Line 01 (High-Speed)"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--mes-text-muted)] uppercase tracking-wider block mb-1">
                Line Code (Asset Tag)
              </label>
              <input
                type="text"
                value={activeLine.code}
                onChange={(e) => setActiveLine({ ...activeLine, code: e.target.value.toUpperCase() })}
                className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)] text-xs uppercase"
                placeholder="e.g. LINE-SMT-01"
              />
            </div>

            <div>
              <label className="text-[10px] text-[var(--mes-text-muted)] uppercase tracking-wider block mb-1">
                Target Takt Time (seconds)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="120"
                  value={activeLine.taktTargetSec || 18.0}
                  onChange={(e) => setActiveLine({ ...activeLine, taktTargetSec: parseFloat(e.target.value) || 18.0 })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)] text-xs"
                />
                <span className="text-[var(--mes-text-muted)]">sec</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[var(--mes-text-muted)] uppercase tracking-wider block mb-1">
                Line Balancing (PBR)
              </label>
              <div className="flex items-center justify-between px-2 py-1 bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)]">
                <span className="text-[var(--mes-text-secondary)] font-bold">
                  {lineStats.lineBalancePct}%
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-[var(--mes-radius)] ${
                  lineStats.isOverTakt 
                    ? 'text-[var(--mes-status-warn)] bg-[var(--mes-status-warn-muted)]' 
                    : 'text-[var(--mes-status-pass)] bg-[var(--mes-status-pass-muted)]'
                }`}>
                  {lineStats.isOverTakt ? 'OVER TAKT' : 'BALANCED'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Work Area: Split Grid (Left Catalog, Center Conveyor, Right Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column (3 cols): Multi-Vendor Equipment Catalog Palette */}
        <div 
          className="lg:col-span-3 bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3 space-y-3 flex flex-col max-h-[750px] overflow-hidden"
          style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
        >
          <div className="flex items-center justify-between border-b border-[var(--mes-border-hairline)] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--mes-text-primary)] flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
              Machine Catalog
            </h3>
            <span className="text-[10px] text-[var(--mes-text-muted)] font-mono">
              {filteredCatalog.length} models
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-[var(--mes-text-muted)]" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search make or model..."
              className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] pl-7 pr-2 py-1 text-xs text-[var(--mes-text-primary)] rounded-[var(--mes-radius)] focus:outline-none focus:border-[var(--mes-accent-primary)] font-mono"
            />
          </div>

          {/* Manufacturer Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {manufacturers.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedManufacturer(m)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] whitespace-nowrap transition-colors ${
                  selectedManufacturer === m
                    ? 'bg-[var(--mes-accent-primary)] text-slate-950 font-bold'
                    : 'bg-[var(--mes-bg-well)] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Catalog Scrollable Cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify({ type: 'CATALOG_ITEM', item }));
                  e.dataTransfer.effectAllowed = 'copy';
                  setIsDraggingFromCatalog(true);
                }}
                onDragEnd={() => {
                  setIsDraggingFromCatalog(false);
                  setDragOverIndex(null);
                }}
                className="bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] border border-[var(--mes-border-hairline)] hover:border-[var(--mes-accent-primary)] rounded-[var(--mes-radius)] p-2 transition-all cursor-grab active:cursor-grabbing group select-none hover:shadow-sm"
                onClick={() => handleAddStationFromCatalog(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <div>
                      <div className="text-xs font-bold text-[var(--mes-text-primary)] leading-tight group-hover:text-[var(--mes-accent-primary)] transition-colors">
                        {item.modelName}
                      </div>
                      <div className="text-[10px] text-[var(--mes-text-muted)] font-mono">
                        {item.manufacturer} · {item.category}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="opacity-0 group-hover:opacity-100 bg-[var(--mes-accent-primary)] text-slate-950 p-1 rounded-[var(--mes-radius)] transition-opacity"
                    title="Add to line flow"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-[10px] font-mono text-[var(--mes-text-muted)]">
                  <span>Cycle: {item.defaultCycleTimeSec}s</span>
                  {item.ratedCph ? (
                    <span className="text-[var(--mes-status-pass)] font-bold">
                      {(item.ratedCph / 1000).toFixed(0)}k CPH
                    </span>
                  ) : (
                    <span>{item.supportedProtocols[0] || 'IPC-CFX'}</span>
                  )}
                </div>
              </div>
            ))}

            {filteredCatalog.length === 0 && (
              <div className="text-center py-8 text-xs text-[var(--mes-text-muted)] font-mono">
                No matching machine models found.
              </div>
            )}
          </div>
        </div>

        {/* Center Column (Conveyor Flow Lane) - 6 cols if inspector open, 9 cols if closed */}
        <div className={`${selectedStation ? 'lg:col-span-6' : 'lg:col-span-9'} space-y-3 transition-all`}>
          {/* Conveyor Flow Header & SMEMA Transit Visualizer */}
          <div 
            className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3 space-y-3"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--mes-border-hairline)] pb-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--mes-status-pass)] animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-[var(--mes-text-primary)]">
                  Physical SMEMA Conveyor Flow ({activeLine?.stations?.length || 0} Stations)
                </span>
              </div>

              {lineStats.slowestStation && (
                <div className="flex items-center gap-1.5 text-[10.5px]">
                  <span className="text-[var(--mes-text-muted)]">Line Bottleneck:</span>
                  <span className={`font-bold ${lineStats.isOverTakt ? 'text-[var(--mes-status-halt)]' : 'text-[var(--mes-status-pass)]'}`}>
                    {lineStats.slowestStation.name} ({lineStats.bottleneckCycle}s)
                  </span>
                </div>
              )}
            </div>

            {/* Conveyor Flow Lane Track */}
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = isDraggingFromCatalog ? 'copy' : 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                try {
                  const raw = e.dataTransfer.getData('application/json');
                  if (!raw) return;
                  const data = JSON.parse(raw);
                  if (data.type === 'CATALOG_ITEM' && data.item) {
                    handleAddStationFromCatalog(data.item);
                  }
                } catch (err) {
                  console.error('Conveyor drop error', err);
                } finally {
                  setIsDraggingFromCatalog(false);
                  setDraggedStationIndex(null);
                  setDragOverIndex(null);
                }
              }}
              className={`relative py-2 px-1 bg-[var(--mes-bg-canvas)] border rounded-[var(--mes-radius)] overflow-x-auto scrollbar-thin transition-colors ${
                isDraggingFromCatalog || draggedStationIndex !== null
                  ? 'border-[var(--mes-accent-primary)] bg-[var(--mes-accent-muted)]/10'
                  : 'border-[var(--mes-border-hairline)]'
              }`}
            >
              {/* Conveyor Belt Indicators */}
              <div className="flex items-center justify-between text-[9px] font-mono text-[var(--mes-text-muted)] uppercase tracking-widest px-2 mb-2">
                <span>◀ Bare PCB Infeed (SMEMA Inflow)</span>
                <span>Inspected Assembly Outflow ▶</span>
              </div>

              {/* Station Sequence Cards */}
              <div className="flex items-center gap-2 min-w-max pb-2">
                {activeLine?.stations?.map((station, index) => {
                  const isSelected = selectedStationIndex === index;
                  const isBottleneck = station.cycleTimeNominalSec === lineStats.bottleneckCycle;
                  const isOverTakt = station.cycleTimeNominalSec > (activeLine.taktTargetSec || 18.0);

                  return (
                    <React.Fragment key={station.id || index}>
                      {/* Machine Station Card */}
                      <div
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify({ type: 'STATION_REORDER', index }));
                          e.dataTransfer.effectAllowed = 'move';
                          setDraggedStationIndex(index);
                        }}
                        onDragEnd={() => {
                          setDraggedStationIndex(null);
                          setDragOverIndex(null);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = isDraggingFromCatalog ? 'copy' : 'move';
                          if (dragOverIndex !== index) {
                            setDragOverIndex(index);
                          }
                        }}
                        onDragLeave={(e) => {
                          e.stopPropagation();
                          if (dragOverIndex === index) {
                            setDragOverIndex(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragOverIndex(null);
                          try {
                            const raw = e.dataTransfer.getData('application/json');
                            if (!raw) return;
                            const data = JSON.parse(raw);
                            if (data.type === 'CATALOG_ITEM' && data.item) {
                              handleAddStationFromCatalog(data.item, index);
                            } else if (data.type === 'STATION_REORDER' && typeof data.index === 'number') {
                              handleReorderStation(data.index, index);
                            }
                          } catch (err) {
                            console.error('Card drop error', err);
                          } finally {
                            setDraggedStationIndex(null);
                            setIsDraggingFromCatalog(false);
                          }
                        }}
                        onClick={() => setSelectedStationIndex(index)}
                        className={`w-44 bg-[var(--mes-bg-surface)] border rounded-[var(--mes-radius)] p-2.5 cursor-grab active:cursor-grabbing transition-all relative flex flex-col justify-between select-none ${
                          dragOverIndex === index
                            ? 'border-[var(--mes-accent-primary)] ring-2 ring-[var(--mes-accent-primary)] scale-[1.03] shadow-lg bg-[var(--mes-bg-well)]'
                            : isSelected
                            ? 'border-[var(--mes-accent-primary)] ring-1 ring-[var(--mes-accent-primary)] shadow-md'
                            : 'border-[var(--mes-border-subtle)] hover:border-[var(--mes-border-strong)]'
                        } ${draggedStationIndex === index ? 'opacity-40' : 'opacity-100'}`}
                      >
                        {/* Top Meta: Drag handle + Sequence + Category Icon */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1" title="Drag to reorder">
                            <GripVertical className="w-3.5 h-3.5 text-[var(--mes-text-muted)] cursor-grab active:cursor-grabbing hover:text-[var(--mes-accent-primary)]" />
                            <span className="text-[10px] font-mono font-bold bg-[var(--mes-bg-well)] text-[var(--mes-text-primary)] px-1.5 py-0.2 border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)]">
                              #{station.sequenceOrder < 10 ? `0${station.sequenceOrder}` : station.sequenceOrder}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(station.type)}
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-pass)]" title="Tower: RUN" />
                          </div>
                        </div>

                        {/* Customer Display Name & Asset Code */}
                        <div className="space-y-0.5 my-1">
                          <div className="text-xs font-bold text-[var(--mes-text-primary)] truncate" title={station.name}>
                            {station.name}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--mes-text-muted)] truncate">
                            {station.customerCode || station.code} · {station.manufacturer || 'OEM'}
                          </div>
                        </div>

                        {/* Cycle Time & Bottleneck Tag */}
                        <div className="mt-2 pt-1.5 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-[10px] font-mono">
                          <span className={`${isOverTakt ? 'text-[var(--mes-status-halt)] font-bold' : 'text-[var(--mes-text-secondary)]'}`}>
                            {station.cycleTimeNominalSec}s
                          </span>
                          {isBottleneck && (
                            <span className="text-[9px] font-bold text-[var(--mes-status-halt)] bg-[var(--mes-status-halt-muted)] px-1 py-0.2 rounded">
                              PACE
                            </span>
                          )}
                        </div>

                        {/* Station Quick Controls (Hover/Select) */}
                        <div className="mt-2 pt-1.5 border-t border-[var(--mes-border-hairline)] flex items-center justify-between text-slate-400">
                          <button
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); handleMoveStation(index, 'LEFT'); }}
                            className="p-1 hover:text-[var(--mes-text-primary)] disabled:opacity-20"
                            title="Move left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDuplicateStation(index); }}
                            className="p-1 hover:text-[var(--mes-accent-primary)]"
                            title="Duplicate module"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveStation(index); }}
                            className="p-1 hover:text-[var(--mes-status-halt)]"
                            title="Remove station"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            disabled={index === (activeLine?.stations?.length || 0) - 1}
                            onClick={(e) => { e.stopPropagation(); handleMoveStation(index, 'RIGHT'); }}
                            className="p-1 hover:text-[var(--mes-text-primary)] disabled:opacity-20"
                            title="Move right"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Insertion Connector Arrow */}
                      {index < (activeLine?.stations?.length || 0) - 1 && (
                        <div className="text-[var(--mes-border-subtle)] flex items-center justify-center">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* End-of-line Drop Zone */}
                {(isDraggingFromCatalog || draggedStationIndex !== null) && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = isDraggingFromCatalog ? 'copy' : 'move';
                      setDragOverIndex(-1);
                    }}
                    onDragLeave={() => {
                      if (dragOverIndex === -1) setDragOverIndex(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverIndex(null);
                      try {
                        const raw = e.dataTransfer.getData('application/json');
                        if (!raw) return;
                        const data = JSON.parse(raw);
                        if (data.type === 'CATALOG_ITEM' && data.item) {
                          handleAddStationFromCatalog(data.item);
                        } else if (data.type === 'STATION_REORDER' && typeof data.index === 'number') {
                          handleReorderStation(data.index, (activeLine?.stations?.length || 1) - 1);
                        }
                      } catch (err) {
                        console.error('End drop error', err);
                      } finally {
                        setDraggedStationIndex(null);
                        setIsDraggingFromCatalog(false);
                      }
                    }}
                    className={`w-36 h-28 border-2 border-dashed rounded-[var(--mes-radius)] flex flex-col items-center justify-center text-center p-2 transition-all font-mono text-[10px] ${
                      dragOverIndex === -1
                        ? 'border-[var(--mes-accent-primary)] bg-[var(--mes-accent-muted)] text-[var(--mes-accent-primary)] font-bold scale-105'
                        : 'border-[var(--mes-border-subtle)] text-[var(--mes-text-muted)] bg-[var(--mes-bg-well)]/40'
                    }`}
                  >
                    <Plus className="w-4 h-4 mb-1" />
                    <span>Drop at End of Line</span>
                  </div>
                )}

                {(!activeLine?.stations || activeLine.stations.length === 0) && (
                  <div className="p-8 text-center text-xs text-[var(--mes-text-muted)] font-mono w-full">
                    Conveyor lane is empty. Click any machine in the catalog to add it to this line.
                  </div>
                )}
              </div>
            </div>

            {/* Conveyor Line Balance Chart Strip */}
            <div className="p-2.5 bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-[var(--mes-text-muted)] uppercase tracking-wide">
                  Cycle Time vs. Target Takt ({activeLine?.taktTargetSec || 18.0}s)
                </span>
                <span className="text-[var(--mes-text-secondary)] font-bold">
                  Total Line Cycle: {lineStats.totalCycle}s
                </span>
              </div>

              {/* Graphical Cycle Bars */}
              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-1.5 pt-1">
                {activeLine?.stations?.map((s, idx) => {
                  const takt = activeLine.taktTargetSec || 18.0;
                  const cycle = Number(s.cycleTimeNominalSec || 15);
                  const pct = Math.min(100, Math.round((cycle / (takt * 1.5)) * 100));
                  const isOver = cycle > takt;

                  return (
                    <div key={idx} className="space-y-1" title={`${s.name}: ${cycle}s`}>
                      <div className="h-12 bg-[var(--mes-bg-canvas)] rounded-[1px] flex flex-col justify-end p-0.5 border border-[var(--mes-border-hairline)]">
                        <div 
                          className={`w-full rounded-[1px] transition-all ${
                            isOver ? 'bg-[var(--mes-status-halt)]' : 'bg-[var(--mes-status-pass)]'
                          }`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[9px] font-mono text-[var(--mes-text-muted)] truncate text-center">
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Station Property Inspector (Opens when a station is selected) */}
        {selectedStation && (
          <div 
            className="lg:col-span-3 bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] p-3 space-y-3 flex flex-col max-h-[750px] overflow-y-auto scrollbar-thin"
            style={{ boxShadow: 'var(--mes-shadow-subtle)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--mes-border-hairline)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--mes-text-primary)] flex items-center gap-1.5 font-mono">
                <Settings className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                Station Inspector
              </h3>
              <button 
                onClick={() => setSelectedStationIndex(null)}
                className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Customer Machine Name
                </label>
                <input
                  type="text"
                  value={selectedStation.name}
                  onChange={(e) => {
                    const updated = [...(activeLine?.stations || [])];
                    if (selectedStationIndex !== null) {
                      updated[selectedStationIndex].name = e.target.value;
                      setActiveLine({ ...activeLine!, stations: updated });
                    }
                  }}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Customer Asset Code / Tag
                </label>
                <input
                  type="text"
                  value={selectedStation.customerCode || ''}
                  onChange={(e) => {
                    const updated = [...(activeLine?.stations || [])];
                    if (selectedStationIndex !== null) {
                      updated[selectedStationIndex].customerCode = e.target.value.toUpperCase();
                      setActiveLine({ ...activeLine!, stations: updated });
                    }
                  }}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)] uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Rated Cycle Time (sec)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  value={selectedStation.cycleTimeNominalSec}
                  onChange={(e) => {
                    const updated = [...(activeLine?.stations || [])];
                    if (selectedStationIndex !== null) {
                      updated[selectedStationIndex].cycleTimeNominalSec = parseFloat(e.target.value) || 15.0;
                      setActiveLine({ ...activeLine!, stations: updated });
                    }
                  }}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Manufacturer / Model
                </label>
                <div className="p-2 bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] rounded-[var(--mes-radius)] text-[var(--mes-text-secondary)]">
                  {selectedStation.manufacturer || 'OEM'} · {selectedStation.modelName || 'Standard'}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Protocol Driver
                </label>
                <select
                  value={selectedStation.protocolBinding?.protocol || 'IPC_CFX'}
                  onChange={(e) => {
                    const updated = [...(activeLine?.stations || [])];
                    if (selectedStationIndex !== null) {
                      updated[selectedStationIndex].protocolBinding = {
                        ...updated[selectedStationIndex].protocolBinding,
                        protocol: e.target.value as ProtocolType
                      };
                      setActiveLine({ ...activeLine!, stations: updated });
                    }
                  }}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                >
                  <option value="IPC_CFX">IPC-CFX (IPC-2591 Standard)</option>
                  <option value="FUJI_NEXIM">Fuji Nexim Host (TCP:30040)</option>
                  <option value="SECS_GEM">SECS/GEM (SEMI E30/E37)</option>
                  <option value="KOH_YOUNG_XML">Koh Young XML Inspection</option>
                  <option value="KIC_PROFILING">KIC / Datapaq Thermal Profile</option>
                  <option value="HERMES">Hermes (IPC-9852 SMEMA)</option>
                  <option value="GENERIC_TCP">Generic Socket / TCP Stream</option>
                  <option value="SIMULATOR">Cleanroom Digital Twin Simulator</option>
                </select>
              </div>

              <div className="pt-2 border-t border-[var(--mes-border-hairline)]">
                <button
                  onClick={() => setSelectedStationIndex(null)}
                  className="w-full bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-text-primary)] border border-[var(--mes-border-hairline)] py-1.5 rounded-[var(--mes-radius)] text-xs transition-colors"
                >
                  Done Editing Station
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Register Custom Machine Model */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-mono">
          <div 
            className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] max-w-md w-full p-4 space-y-3 shadow-2xl animate-in fade-in"
            style={{ boxShadow: 'var(--mes-shadow-modal)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--mes-border-hairline)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--mes-text-primary)] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                Register New Machine Model
              </h3>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewModel} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Manufacturer / OEM Make
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hanwha, Juki, Yamaha, Panasonic, Sony"
                  value={newModelForm.manufacturer}
                  onChange={(e) => setNewModelForm({ ...newModelForm, manufacturer: e.target.value })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Model Name & Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decan S1 Ultra-Speed Mounter"
                  value={newModelForm.modelName}
                  onChange={(e) => setNewModelForm({ ...newModelForm, modelName: e.target.value })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={newModelForm.category}
                    onChange={(e) => setNewModelForm({ ...newModelForm, category: e.target.value as EquipmentCategory })}
                    className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                  >
                    <option value="PICK_AND_PLACE">Pick & Place Mounter</option>
                    <option value="PRINTER">Screen Printer</option>
                    <option value="SPI">3D SPI</option>
                    <option value="REFLOW">Reflow Oven</option>
                    <option value="AOI">3D AOI</option>
                    <option value="XRAY">AXI X-Ray</option>
                    <option value="LASER">Laser Marker</option>
                    <option value="BUFFER">Conveyor / Buffer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                    Default Cycle (s)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newModelForm.defaultCycleTimeSec}
                    onChange={(e) => setNewModelForm({ ...newModelForm, defaultCycleTimeSec: parseFloat(e.target.value) || 15.0 })}
                    className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--mes-border-hairline)]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--mes-bg-well)] text-[var(--mes-text-secondary)] rounded-[var(--mes-radius)] hover:bg-[var(--mes-bg-card)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[var(--mes-accent-primary)] text-slate-950 font-bold rounded-[var(--mes-radius)] hover:opacity-90 transition-opacity"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Production Line */}
      {isNewLineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-mono">
          <div 
            className="bg-[var(--mes-bg-surface)] border border-[var(--mes-border-subtle)] rounded-[var(--mes-radius)] max-w-md w-full p-4 space-y-3 shadow-2xl animate-in fade-in"
            style={{ boxShadow: 'var(--mes-shadow-modal)' }}
          >
            <div className="flex items-center justify-between border-b border-[var(--mes-border-hairline)] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--mes-text-primary)] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                Create New Production Line
              </h3>
              <button 
                onClick={() => setIsNewLineModalOpen(false)}
                className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewLine} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Line Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SMT Line 03 (Automotive High-Reliability)"
                  value={newLineForm.name}
                  onChange={(e) => setNewLineForm({ ...newLineForm, name: e.target.value })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Line Code (Short ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LINE-SMT-03"
                  value={newLineForm.code}
                  onChange={(e) => setNewLineForm({ ...newLineForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)] uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-[var(--mes-text-muted)] uppercase block mb-1">
                  Target Takt Time (seconds)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newLineForm.taktTargetSec}
                  onChange={(e) => setNewLineForm({ ...newLineForm, taktTargetSec: parseFloat(e.target.value) || 18.0 })}
                  className="w-full bg-[var(--mes-bg-well)] border border-[var(--mes-border-hairline)] px-2.5 py-1.5 rounded-[var(--mes-radius)] text-[var(--mes-text-primary)] focus:outline-none focus:border-[var(--mes-accent-primary)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--mes-border-hairline)]">
                <button
                  type="button"
                  onClick={() => setIsNewLineModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--mes-bg-well)] text-[var(--mes-text-secondary)] rounded-[var(--mes-radius)] hover:bg-[var(--mes-bg-card)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[var(--mes-accent-primary)] text-slate-950 font-bold rounded-[var(--mes-radius)] hover:opacity-90 transition-opacity"
                >
                  Create Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
