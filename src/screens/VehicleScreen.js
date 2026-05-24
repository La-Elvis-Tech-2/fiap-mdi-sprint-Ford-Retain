import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, FlatList, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useApp } from '../services/AppContext';
import { Colors, Radius, Shadow } from '../theme';
import Toast from '../components/Toast';

/* ─── Dados ── */
const MOCK_VEHICLE = {
  brand: 'Ford', model: 'Ranger', version: 'XLS 2.2 Diesel',
  year: 2021, color: 'Branco Ártico', plate: 'ABC-1234',
  vin: '9BFZZ5JZ4MB123456', km: 8240, nextRevisionKm: 10000,
  warranty: 'Válida até Dez/2025', insuranceExpiry: 'Mar/2025',
};

const HEALTH_ITEMS = [
  { id: 'h1', label: 'Motor',           status: 'ok',      icon: 'zap'      },
  { id: 'h2', label: 'Freios',          status: 'ok',      icon: 'disc'     },
  { id: 'h3', label: 'Pneus',           status: 'warning', icon: 'circle'   },
  { id: 'h4', label: 'Óleo',            status: 'warning', icon: 'droplet'  },
  { id: 'h5', label: 'Bateria',         status: 'ok',      icon: 'battery'  },
  { id: 'h6', label: 'Ar-condicionado', status: 'ok',      icon: 'wind'     },
];

const STATUS_MAP = {
  ok:      { color: Colors.green, bg: Colors.greenLight, label: 'OK'      },
  warning: { color: Colors.amber, bg: Colors.amberLight, label: 'Atenção' },
  danger:  { color: Colors.red,   bg: '#FEE2E2',         label: 'Crítico' },
};

const INITIAL_HISTORY = [
  { id: 'sv1', type: 'Revisão Completa',  dealer: 'Ford Bela Vista', date: '15 Jan 2024', km: '5.200 km', cost: 'R$ 890', official: true,  icon: 'settings' },
  { id: 'sv2', type: 'Troca de Óleo',     dealer: 'Ford Tatuapé',    date: '03 Jun 2023', km: '2.100 km', cost: 'R$ 320', official: true,  icon: 'droplet'  },
  { id: 'sv3', type: 'Alinhamento',       dealer: 'Oficina do Bairro',date: '10 Mar 2023', km: '1.000 km', cost: 'R$ 120', official: false, icon: 'sliders'  },
];

/* ─── KM Card com edição inline ── */
function KmCard({ vehicle, onKmChange }) {
  const [editing, setEditing]   = useState(false);
  const [draft,   setDraft]     = useState('');

  const kmProgress = Math.min((vehicle.km / vehicle.nextRevisionKm) * 100, 100);
  const kmLeft     = Math.max(vehicle.nextRevisionKm - vehicle.km, 0);
  const barColor   = kmProgress >= 90 ? Colors.red : kmProgress >= 70 ? Colors.amber : Colors.blue;

  const urgencyLabel =
    kmProgress >= 90 ? 'Revisão urgente!' :
    kmProgress >= 70 ? 'Revisão em breve' :
    'Em dia';
  const urgencyColor =
    kmProgress >= 90 ? Colors.red :
    kmProgress >= 70 ? Colors.amber :
    Colors.green;

  const handleConfirm = () => {
    const val = parseInt(draft.replace(/\D/g, ''), 10);
    if (!isNaN(val) && val >= 0) onKmChange(val);
    setEditing(false);
  };

  return (
    <View style={km.card}>
      {/* topo: label + badge de urgência */}
      <View style={km.topRow}>
        <Text style={km.label}>PRÓXIMA REVISÃO</Text>
        <View style={[km.urgencyBadge, { backgroundColor: urgencyColor + '20' }]}>
          <View style={[km.urgencyDot, { backgroundColor: urgencyColor }]} />
          <Text style={[km.urgencyTxt, { color: urgencyColor }]}>{urgencyLabel}</Text>
        </View>
      </View>

      {/* KM editável */}
      <View style={km.valueRow}>
        {editing ? (
          <View style={km.editRow}>
            <TextInput
              style={km.editInput}
              value={draft}
              onChangeText={setDraft}
              keyboardType="numeric"
              autoFocus
              selectTextOnFocus
              onSubmitEditing={handleConfirm}
              onBlur={handleConfirm}
            />
            <Text style={km.editUnit}>km</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={km.editRow}
            onPress={() => { setDraft(String(vehicle.km)); setEditing(true); }}
            activeOpacity={0.7}
          >
            <Text style={km.value}>{vehicle.km.toLocaleString('pt-BR')}</Text>
            <Text style={km.unit}> km</Text>
            <View style={km.pencilWrap}>
              <Icon name="edit-2" size={11} color={Colors.blue} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        )}
        <View style={km.limitWrap}>
          <Text style={km.limitLabel}>limite</Text>
          <Text style={km.limitVal}>{vehicle.nextRevisionKm.toLocaleString('pt-BR')} km</Text>
        </View>
      </View>

      {/* barra de progresso */}
      <View style={km.trackWrap}>
        <View style={km.track}>
          <View style={[km.fill, { width: `${kmProgress}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={[km.pct, { color: barColor }]}>{Math.round(kmProgress)}%</Text>
      </View>

      {/* rodapé */}
      <View style={km.footer}>
        <Icon name="activity" size={12} color={Colors.text3} strokeWidth={2} />
        <Text style={km.footerTxt}>
          {kmLeft > 0
            ? `Faltam ${kmLeft.toLocaleString('pt-BR')} km para a próxima revisão`
            : 'Revisão necessária imediatamente!'}
        </Text>
      </View>
    </View>
  );
}

/* ─── Health Item ── */
function HealthItem({ item }) {
  const st = STATUS_MAP[item.status];
  return (
    <View style={[hi.card, item.status !== 'ok' && hi.cardAlert]}>
      <View style={[hi.iconWrap, { backgroundColor: st.bg }]}>
        <Icon name={item.icon} size={15} color={st.color} strokeWidth={1.75} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={hi.label}>{item.label}</Text>
        <Text style={[hi.status, { color: st.color }]}>{st.label}</Text>
      </View>
      {item.status !== 'ok' && (
        <View style={[hi.dot, { backgroundColor: st.color }]} />
      )}
    </View>
  );
}

/* ─── VIN Share Ring ── */
function VinShareRing({ pct, network, total }) {
  const angle   = Math.min(pct / 100, 1) * 251; // circumference ~251 for r=40
  const color   = pct >= 80 ? Colors.green : pct >= 50 ? Colors.amber : Colors.red;
  return (
    <View style={vs.card}>
      <View style={{ flex: 1 }}>
        <Text style={vs.label}>VIN SHARE</Text>
        <Text style={[vs.value, { color }]}>{pct}%</Text>
        <Text style={vs.sub}>{network} de {total} revisões{'\n'}na rede Ford</Text>
        <View style={[vs.tag, { backgroundColor: color + '18' }]}>
          <Icon name={pct >= 80 ? 'check-circle' : 'alert-triangle'} size={11} color={color} strokeWidth={2} />
          <Text style={[vs.tagTxt, { color }]}>
            {pct >= 80 ? 'Ótimo desempenho' : pct >= 50 ? 'Pode melhorar' : 'Atenção necessária'}
          </Text>
        </View>
      </View>
      {/* ring visual simples */}
      <View style={vs.ringOuter}>
        <View style={[vs.ringInner, { borderColor: color }]}>
          <Text style={[vs.ringPct, { color }]}>{pct}%</Text>
          <Text style={vs.ringLbl}>Ford</Text>
        </View>
        <View style={[vs.ringBg, { borderColor: color + '22' }]} />
      </View>
    </View>
  );
}

/* ─── Service Row ── */
function ServiceRow({ item, first }) {
  return (
    <View style={[sr.row, !first && sr.border]}>
      <View style={[sr.iconWrap, { backgroundColor: item.official ? Colors.blueXLight : Colors.bg }]}>
        <Icon name={item.icon} size={15} color={item.official ? Colors.blue : Colors.text3} strokeWidth={1.75} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={sr.titleRow}>
          <Text style={sr.type} numberOfLines={1}>{item.type}</Text>
          <View style={[sr.badge, { backgroundColor: item.official ? Colors.blueXLight : Colors.bg }]}>
            <Icon
              name={item.official ? 'check-circle' : 'alert-circle'}
              size={9} strokeWidth={2.5}
              color={item.official ? Colors.blue : Colors.text3}
            />
            <Text style={[sr.badgeTxt, { color: item.official ? Colors.blue : Colors.text3 }]}>
              {item.official ? 'Rede Ford' : 'Fora da rede'}
            </Text>
          </View>
        </View>
        <Text style={sr.dealer}>{item.dealer}</Text>
        <View style={sr.meta}>
          <Icon name="calendar" size={10} color={Colors.text3} />
          <Text style={sr.metaTxt}>{item.date}</Text>
          <Text style={sr.sep}>·</Text>
          <Text style={sr.metaTxt}>{item.km}</Text>
          <Text style={sr.sep}>·</Text>
          <Text style={[sr.cost, { color: item.official ? Colors.text : Colors.text3 }]}>{item.cost}</Text>
        </View>
      </View>
    </View>
  );
}

/* ─── Edit Modal ── */
function EditModal({ visible, vehicle, onClose, onSave }) {
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [plate, setPlate] = useState(vehicle?.plate ?? '');
  const [km,    setKm]    = useState(String(vehicle?.km ?? ''));
  const [nextKm,setNextKm]= useState(String(vehicle?.nextRevisionKm ?? ''));

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={em.overlay}>
        <View style={em.sheet}>
          <View style={em.handle} />
          <View style={em.header}>
            <Text style={em.title}>Editar veículo</Text>
            <TouchableOpacity onPress={onClose} style={em.closeBtn} activeOpacity={0.7}>
              <Icon name="x" size={18} color={Colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {[
            { label: 'Modelo',               val: model,  set: setModel,  ph: 'Ex: Ranger',  cap: 'words',     kbt: 'default' },
            { label: 'Placa',                val: plate,  set: setPlate,  ph: 'ABC-1234',    cap: 'characters', kbt: 'default', max: 8 },
            { label: 'Quilometragem atual',  val: km,     set: setKm,     ph: 'Ex: 8240',    cap: 'none',      kbt: 'numeric' },
            { label: 'KM da próxima revisão',val: nextKm, set: setNextKm, ph: 'Ex: 10000',   cap: 'none',      kbt: 'numeric' },
          ].map(f => (
            <View key={f.label} style={em.fieldWrap}>
              <Text style={em.label}>{f.label}</Text>
              <TextInput
                style={em.input}
                value={f.val}
                onChangeText={f.set}
                placeholder={f.ph}
                placeholderTextColor={Colors.text3}
                autoCapitalize={f.cap}
                keyboardType={f.kbt}
                maxLength={f.max}
              />
            </View>
          ))}

          <TouchableOpacity
            style={em.saveBtn} activeOpacity={0.8}
            onPress={() => {
              onSave({
                model,
                plate: plate.toUpperCase(),
                km: parseInt(km) || vehicle.km,
                nextRevisionKm: parseInt(nextKm) || vehicle.nextRevisionKm,
              });
              onClose();
            }}
          >
            <Icon name="check" size={16} color={Colors.white} strokeWidth={2.5} />
            <Text style={em.saveTxt}>Salvar alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Full History Modal ── */
function HistoryModal({ visible, onClose, history }) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={hm.overlay}>
        <View style={hm.sheet}>
          <View style={hm.header}>
            <Text style={hm.title}>Histórico completo</Text>
            <TouchableOpacity onPress={onClose} style={hm.closeBtn} activeOpacity={0.7}>
              <Icon name="x" size={18} color={Colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={i => i.id}
            renderItem={({ item, index }) => <ServiceRow item={item} first={index === 0} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

/* ─── Screen ── */
export default function VehicleScreen() {
  const { networkServices, totalServices, revisions } = useApp();
  const toastRef = useRef(null);

  const [vehicle,         setVehicle]         = useState(MOCK_VEHICLE);
  const [showEdit,        setShowEdit]        = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const dynamicHistory = [
    ...revisions.map(r => ({
      id: `dyn_${r.id}`, type: r.type || 'Revisão',
      dealer: 'Rede Ford (agendado)', date: 'Recente',
      km: r.km ? `${r.km} km` : '—', cost: '—',
      official: true, icon: 'settings',
    })),
    ...INITIAL_HISTORY,
  ];

  const effectiveNetwork = networkServices > 0 ? networkServices : 2;
  const effectiveTotal   = totalServices   > 0 ? totalServices   : 3;
  const vinSharePct      = Math.round((effectiveNetwork / effectiveTotal) * 100);

  const handleSave = (data) => {
    setVehicle(prev => ({ ...prev, ...data }));
    toastRef.current?.show('Veículo atualizado!', 'success');
  };

  // KM editável inline no KmCard
  const handleKmChange = (val) => {
    setVehicle(prev => ({ ...prev, km: val }));
    toastRef.current?.show('Quilometragem atualizada!', 'success');
  };

  const warningCount = HEALTH_ITEMS.filter(i => i.status !== 'ok').length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Meu Veículo</Text>
          <Text style={s.subtitle}>{vehicle.brand} {vehicle.model} · {vehicle.year}</Text>
        </View>
        <TouchableOpacity style={s.editBtn} activeOpacity={0.7} onPress={() => setShowEdit(true)}>
          <Icon name="edit-2" size={13} color={Colors.blue} strokeWidth={2} />
          <Text style={s.editTxt}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>

        {/* ── Hero card ── */}
        <View style={s.heroCard}>
          {/* linha superior */}
          <View style={s.heroTop}>
            <View style={s.carIconWrap}>
              <Icon name="car" size={26} color={Colors.blue} strokeWidth={1.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.heroModel}>{vehicle.brand} {vehicle.model}</Text>
              <Text style={s.heroVersion}>{vehicle.version}</Text>
            </View>
            <View style={s.heroPlateWrap}>
              <Text style={s.heroPlate}>{vehicle.plate}</Text>
            </View>
          </View>

          <View style={s.heroDivider} />

          {/* chips de info */}
          <View style={s.heroChips}>
            {[
              { icon: 'calendar', val: String(vehicle.year)   },
              { icon: 'droplet',  val: vehicle.color          },
              { icon: 'hash',     val: vehicle.vin.slice(-8)  },
            ].map(c => (
              <View key={c.icon} style={s.heroChip}>
                <Icon name={c.icon} size={11} color="rgba(255,255,255,0.45)" strokeWidth={2} />
                <Text style={s.heroChipTxt}>{c.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── KM Card (editável) ── */}
        <KmCard vehicle={vehicle} onKmChange={handleKmChange} />

        {/* ── Saúde ── */}
        <View style={s.secRow}>
          <Text style={s.sectionTitle}>Saúde do veículo</Text>
          {warningCount > 0 && (
            <View style={s.warnBadge}>
              <Text style={s.warnBadgeTxt}>{warningCount} atenção</Text>
            </View>
          )}
        </View>
        <View style={s.healthGrid}>
          {HEALTH_ITEMS.map(item => <HealthItem key={item.id} item={item} />)}
        </View>

        {/* ── VIN Share ── */}
        <VinShareRing pct={vinSharePct} network={effectiveNetwork} total={effectiveTotal} />

        {/* ── Documentos ── */}
        <View style={s.docsRow}>
          <View style={[s.docCard, { borderColor: Colors.green, backgroundColor: Colors.greenLight }]}>
            <View style={s.docIconWrap}>
              <Icon name="shield" size={15} color={Colors.green} strokeWidth={1.75} />
            </View>
            <Text style={s.docTitle}>Garantia</Text>
            <Text style={s.docValue}>{vehicle.warranty}</Text>
          </View>
          <View style={[s.docCard, { borderColor: Colors.amber, backgroundColor: Colors.amberLight }]}>
            <View style={[s.docIconWrap, { backgroundColor: 'rgba(217,119,6,0.12)' }]}>
              <Icon name="file-text" size={15} color={Colors.amber} strokeWidth={1.75} />
            </View>
            <Text style={s.docTitle}>Seguro / IPVA</Text>
            <Text style={s.docValue}>{vehicle.insuranceExpiry}</Text>
          </View>
        </View>

        {/* ── Histórico ── */}
        <View style={s.secRow}>
          <Text style={s.sectionTitle}>Histórico de serviços</Text>
          <TouchableOpacity onPress={() => setShowFullHistory(true)} activeOpacity={0.7}>
            <Text style={s.secLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        <View style={s.historyCard}>
          {dynamicHistory.slice(0, 3).map((item, i) => (
            <ServiceRow key={item.id} item={item} first={i === 0} />
          ))}
        </View>

        {/* ── Dica ── */}
        {vinSharePct < 100 && (
          <View style={s.tipCard}>
            <View style={s.tipIconWrap}>
              <Icon name="info" size={15} color={Colors.blue} strokeWidth={2} />
            </View>
            <Text style={s.tipText}>
              Revisões fora da rede podem invalidar sua garantia Ford. Mantenha 100% do histórico na rede oficial.
            </Text>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      <HistoryModal
        visible={showFullHistory}
        onClose={() => setShowFullHistory(false)}
        history={dynamicHistory}
      />
      <EditModal
        visible={showEdit}
        vehicle={vehicle}
        onClose={() => setShowEdit(false)}
        onSave={handleSave}
      />
      <Toast ref={toastRef} />
    </SafeAreaView>
  );
}

/* ── Main styles ── */
const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.bg },
  header:       {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12,
  },
  title:        { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.4 },
  subtitle:     { fontSize: 12, color: Colors.text3, marginTop: 2 },
  editBtn:      {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.blueXLight, borderRadius: Radius.full,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  editTxt:      { fontSize: 12, fontWeight: '600', color: Colors.blue },
  body:         { paddingHorizontal: 16, paddingBottom: 32 },

  /* hero */
  heroCard:     {
    backgroundColor: Colors.dark, borderRadius: Radius.xl,
    padding: 18, marginBottom: 12, ...Shadow.md,
  },
  heroTop:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  carIconWrap:  {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  heroModel:    { fontSize: 17, fontWeight: '700', color: Colors.white, letterSpacing: -0.3 },
  heroVersion:  { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 },
  heroPlateWrap:{
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  heroPlate:    { fontSize: 13, fontWeight: '700', color: Colors.white, letterSpacing: 1.5 },
  heroDivider:  { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 14 },
  heroChips:    { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  heroChip:     {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 7,
    paddingHorizontal: 9, paddingVertical: 5,
  },
  heroChipTxt:  { fontSize: 11, color: 'rgba(255,255,255,0.5)' },

  /* sections */
  secRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  secLink:      { fontSize: 12, fontWeight: '500', color: Colors.blue },
  warnBadge:    {
    backgroundColor: Colors.amberLight, borderRadius: 7,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  warnBadgeTxt: { fontSize: 11, fontWeight: '600', color: Colors.amber },

  /* health */
  healthGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },

  /* docs */
  docsRow:      { flexDirection: 'row', gap: 10, marginBottom: 14 },
  docCard:      {
    flex: 1, borderRadius: Radius.lg, borderWidth: 1,
    padding: 14, gap: 5,
  },
  docIconWrap:  {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: 'rgba(5,150,105,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  docTitle:     { fontSize: 10, fontWeight: '600', color: Colors.text2, marginTop: 2 },
  docValue:     { fontSize: 12, fontWeight: '600', color: Colors.text },

  /* history */
  historyCard:  {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', marginBottom: 12, ...Shadow.sm,
  },

  /* tip */
  tipCard:      {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.blueXLight, borderRadius: Radius.lg,
    padding: 14, borderWidth: 1, borderColor: Colors.blueLight,
  },
  tipIconWrap:  {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.blueLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipText:      { flex: 1, fontSize: 12, color: Colors.text2, lineHeight: 18 },
});

/* ── KM card styles ── */
const km = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border,
    padding: 18, marginBottom: 14, ...Shadow.sm,
  },
  topRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  label:        { fontSize: 10, fontWeight: '700', color: Colors.text3, letterSpacing: 0.8 },
  urgencyBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  urgencyDot:   { width: 6, height: 6, borderRadius: 3 },
  urgencyTxt:   { fontSize: 11, fontWeight: '600' },

  valueRow:     { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  editRow:      { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  value:        { fontSize: 36, fontWeight: '800', color: Colors.text, letterSpacing: -1.5, lineHeight: 40 },
  unit:         { fontSize: 16, fontWeight: '500', color: Colors.text2, marginBottom: 4 },
  pencilWrap:   {
    width: 22, height: 22, borderRadius: 6,
    backgroundColor: Colors.blueXLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4, marginLeft: 4,
  },
  editInput:    {
    fontSize: 36, fontWeight: '800', color: Colors.blue,
    letterSpacing: -1.5, lineHeight: 40,
    borderBottomWidth: 2, borderBottomColor: Colors.blue,
    minWidth: 120, padding: 0,
  },
  editUnit:     { fontSize: 16, fontWeight: '500', color: Colors.blue, marginBottom: 4 },
  limitWrap:    { alignItems: 'flex-end', paddingBottom: 4 },
  limitLabel:   { fontSize: 10, color: Colors.text3 },
  limitVal:     { fontSize: 13, fontWeight: '600', color: Colors.text2 },

  trackWrap:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  track:        { flex: 1, height: 10, backgroundColor: Colors.blueXLight, borderRadius: 5, overflow: 'hidden' },
  fill:         { height: '100%', borderRadius: 5 },
  pct:          { fontSize: 12, fontWeight: '700', minWidth: 36, textAlign: 'right' },

  footer:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTxt:    { fontSize: 11, color: Colors.text3, flex: 1 },
});

/* ── Health item styles ── */
const hi = StyleSheet.create({
  card:      {
    width: '47%', backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, ...Shadow.sm,
  },
  cardAlert: { borderColor: Colors.amber },
  iconWrap:  { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  label:     { fontSize: 12, fontWeight: '500', color: Colors.text },
  status:    { fontSize: 10, fontWeight: '600', marginTop: 2 },
  dot:       { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
});

/* ── VIN Share styles ── */
const vs = StyleSheet.create({
  card:     {
    backgroundColor: Colors.dark, borderRadius: Radius.xl,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, ...Shadow.md,
  },
  label:    { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, marginBottom: 4 },
  value:    { fontSize: 38, fontWeight: '800', letterSpacing: -1.5, lineHeight: 42 },
  sub:      { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, lineHeight: 17 },
  tag:      { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start', marginTop: 10 },
  tagTxt:   { fontSize: 11, fontWeight: '600' },
  ringOuter:{ width: 84, height: 84, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringBg:   { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 8 },
  ringInner:{ width: 84, height: 84, borderRadius: 42, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  ringPct:  { fontSize: 18, fontWeight: '800', color: Colors.white },
  ringLbl:  { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 1 },
});

/* ── Service row styles ── */
const sr = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  border:   { borderTopWidth: 1, borderTopColor: Colors.border },
  iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 2 },
  type:     { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },
  badge:    { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  badgeTxt: { fontSize: 9, fontWeight: '700' },
  dealer:   { fontSize: 12, color: Colors.text2 },
  meta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaTxt:  { fontSize: 11, color: Colors.text3 },
  sep:      { fontSize: 11, color: Colors.text3 },
  cost:     { fontSize: 11, fontWeight: '600' },
});

/* ── Edit modal styles ── */
const em = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:    { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  handle:   { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  title:    { fontSize: 17, fontWeight: '700', color: Colors.text },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  fieldWrap:{ marginBottom: 14 },
  label:    { fontSize: 11, fontWeight: '600', color: Colors.text2, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:    { height: 46, backgroundColor: Colors.bg, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 15, color: Colors.text },
  saveBtn:  { height: 52, backgroundColor: Colors.blue, borderRadius: Radius.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6, ...Shadow.md },
  saveTxt:  { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

/* ── History modal styles ── */
const hm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingBottom: 24 },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title:   { fontSize: 16, fontWeight: '700', color: Colors.text },
  closeBtn:{ width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
});