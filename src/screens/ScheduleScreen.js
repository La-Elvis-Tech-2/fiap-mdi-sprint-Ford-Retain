import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, Pressable, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useApp } from '../services/AppContext';
import { Colors, Radius, Shadow } from '../theme';
import Toast from '../components/Toast';

/* ─── Dados estáticos ──────────────────────────────────────────────────────── */
const DEALERSHIPS = [
  {
    id: '1',
    name: 'Ford Bela Vista',
    address: 'Av. Paulista, 1578 – São Paulo',
    distance: '2,1 km',
    rating: 4.8,
    open: true,
    hours: 'Fecha às 18h',
    slots: ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00'],
    badge: 'Mais próxima',
    badgeColor: Colors.blue,
  },
  {
    id: '2',
    name: 'Ford Tatuapé',
    address: 'R. Tuiuti, 450 – São Paulo',
    distance: '5,4 km',
    rating: 4.6,
    open: true,
    hours: 'Fecha às 19h',
    slots: ['08:30', '10:00', '11:30', '14:00', '15:30'],
    badge: 'Alta avaliação',
    badgeColor: Colors.green,
  },
  {
    id: '3',
    name: 'Ford Santo André',
    address: 'Av. Industrial, 980 – Santo André',
    distance: '18,7 km',
    rating: 4.5,
    open: false,
    hours: 'Abre amanhã 08h',
    slots: ['08:00', '09:30', '11:00', '14:00', '16:30'],
    badge: null,
    badgeColor: null,
  },
];

const SERVICES = [
  { id: 's1', label: 'Revisão Completa',  icon: 'settings', pts: 50 },
  { id: 's2', label: 'Troca de Óleo',     icon: 'droplet',  pts: 20 },
  { id: 's3', label: 'Revisão de Freios', icon: 'disc',     pts: 30 },
  { id: 's4', label: 'Alinhamento',       icon: 'sliders',  pts: 15 },
  { id: 's5', label: 'Revisão Elétrica',  icon: 'zap',      pts: 25 },
  { id: 's6', label: 'Troca de Pneus',    icon: 'circle',   pts: 20 },
];

const DATES = (() => {
  const DAYS   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const result = [];
  const today  = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push({
      id: String(i),
      dayName: i === 0 ? 'Hoje' : DAYS[d.getDay()],
      dayNum:  d.getDate(),
      month:   MONTHS[d.getMonth()],
      disabled: d.getDay() === 0,
    });
  }
  return result;
})();

/* ─── Stars ─────────────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i} name="star" size={10} strokeWidth={1.5}
          color={i <= Math.round(rating) ? Colors.amber : Colors.border}
        />
      ))}
    </View>
  );
}

/* ─── Dealership Card ────────────────────────────────────────────────────────── */
function DealerCard({ item, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[dc.card, selected && dc.cardSelected]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {item.badge && (
        <View style={[dc.badge, { backgroundColor: item.badgeColor }]}>
          <Text style={dc.badgeTxt}>{item.badge}</Text>
        </View>
      )}
      <View style={dc.row}>
        <View style={[dc.iconWrap, selected && { backgroundColor: Colors.blue }]}>
          <Icon name="map-pin" size={16} color={selected ? Colors.white : Colors.blue} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={dc.name} numberOfLines={1}>{item.name}</Text>
          <Text style={dc.addr} numberOfLines={1}>{item.address}</Text>
          <View style={dc.meta}>
            <Stars rating={item.rating} />
            <Text style={dc.rating}>{item.rating}</Text>
            <Text style={dc.sep}>·</Text>
            <Text style={dc.dist}>{item.distance}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <View style={[dc.dot, { backgroundColor: item.open ? Colors.green : Colors.text3 }]} />
          <Text style={[dc.hours, { color: item.open ? Colors.green : Colors.text3 }]}>
            {item.hours}
          </Text>
        </View>
      </View>
      {selected && (
        <View style={dc.checkRow}>
          <Icon name="check-circle" size={13} color={Colors.blue} strokeWidth={2} />
          <Text style={dc.checkTxt}>Concessionária selecionada</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ─── Summary row (usado no modal de confirmação) ────────────────────────────── */
function SummaryRow({ icon, label, value, last }) {
  return (
    <View style={[cm.rowItem, !last && cm.rowBorder]}>
      <View style={cm.rowIcon}>
        <Icon name={icon} size={13} color={Colors.blue} strokeWidth={2} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={cm.rowLabel}>{label}</Text>
        <Text style={cm.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────────────────── */
function ConfirmModal({ visible, onClose, onConfirm, data, loading }) {
  if (!data) return null;
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={cm.overlay}>
        <View style={cm.sheet}>
          <View style={cm.header}>
            <Text style={cm.title}>Confirmar agendamento</Text>
            <TouchableOpacity onPress={onClose} style={cm.closeBtn} activeOpacity={0.7}>
              <Icon name="x" size={18} color={Colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={cm.summaryCard}>
            <SummaryRow icon="map-pin"  label="Concessionária" value={data.dealer}  />
            <SummaryRow icon="wrench"   label="Serviço"        value={data.service} />
            <SummaryRow icon="calendar" label="Data"           value={data.date}    />
            <SummaryRow icon="clock"    label="Horário"        value={data.slot}    />
            {!!data.plate && (
              <SummaryRow icon="car" label="Placa" value={data.plate} last />
            )}
          </View>

          <View style={cm.ptsBanner}>
            <Icon name="trophy" size={16} color={Colors.amber} />
            <Text style={cm.ptsTxt}>
              Você vai ganhar{' '}
              <Text style={cm.ptsBold}>+{data.pts} pts</Text>
              {' '}ao confirmar
            </Text>
          </View>

          <TouchableOpacity
            style={[cm.btn, loading && cm.btnOff]}
            onPress={onConfirm}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <>
                  <Icon name="check" size={16} color={Colors.white} strokeWidth={2.5} />
                  <Text style={cm.btnTxt}>Confirmar Agendamento</Text>
                </>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={cm.cancelBtn} activeOpacity={0.7}>
            <Text style={cm.cancelTxt}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Success Modal ──────────────────────────────────────────────────────────── */
function SuccessModal({ visible, onClose, data }) {
  if (!data) return null;
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={su.overlay} onPress={onClose}>
        <View style={su.card}>
          <View style={su.iconWrap}>
            <Icon name="check-circle" size={40} color={Colors.green} strokeWidth={1.5} />
          </View>
          <Text style={su.title}>Agendado!</Text>
          <Text style={su.sub}>{data.service}{'\n'}em {data.dealer}</Text>
          <Text style={su.date}>{data.date} às {data.slot}</Text>
          <View style={su.ptsTag}>
            <Icon name="zap" size={14} color={Colors.blue} />
            <Text style={su.ptsTxt}>+{data.pts} pontos adicionados</Text>
          </View>
          <TouchableOpacity style={su.btn} onPress={onClose} activeOpacity={0.8}>
            <Text style={su.btnTxt}>Ótimo!</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

/* ─── Screen ─────────────────────────────────────────────────────────────────── */
export default function ScheduleScreen() {
  const { addPoints, addActivity, addRevision } = useApp();
  const toastRef = useRef(null);

  const [selectedDealer,  setSelectedDealer]  = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate,    setSelectedDate]    = useState(DATES[0]);
  const [selectedSlot,    setSelectedSlot]    = useState(null);
  const [plate,           setPlate]           = useState('');
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);
  const [confirming,      setConfirming]      = useState(false);
  const [lastBooking,     setLastBooking]     = useState(null);

  const dealer  = DEALERSHIPS.find(d => d.id === selectedDealer);
  const service = SERVICES.find(s => s.id === selectedService);
  const slots   = dealer?.slots ?? [];
  const canContinue = selectedDealer && selectedService && selectedDate && selectedSlot;

  const confirmData = canContinue ? {
    dealer:  dealer.name,
    service: service.label,
    date:    `${selectedDate.dayName}, ${selectedDate.dayNum} ${selectedDate.month}`,
    slot:    selectedSlot,
    pts:     service.pts,
    plate:   plate.trim().toUpperCase(),
  } : null;

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1100));
    addPoints(service.pts);
    addRevision({ plate: plate.trim().toUpperCase() || '—', km: '', type: service.label });
    addActivity({
      title: `${service.label} agendado`,
      sub:   `${dealer.name} · ${selectedDate.dayName} ${selectedDate.dayNum} às ${selectedSlot}`,
      ok:    true,
    });
    setLastBooking({ ...confirmData });
    setConfirming(false);
    setShowConfirm(false);
    setShowSuccess(true);
    // reset form
    setSelectedDealer(null);
    setSelectedService(null);
    setSelectedDate(DATES[0]);
    setSelectedSlot(null);
    setPlate('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Agendar Revisão</Text>
          <Text style={s.subtitle}>Rede oficial Ford próxima a você</Text>
        </View>
        <View style={s.ptsPill}>
          <Icon name="zap" size={12} color={Colors.blue} strokeWidth={2} />
          <Text style={s.ptsTxt}>Ganhe pts ao agendar</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>

        {/* ── Concessionárias ── */}
        <Text style={s.sectionTitle}>Concessionárias próximas</Text>
        {DEALERSHIPS.map(d => (
          <DealerCard
            key={d.id}
            item={d}
            selected={selectedDealer === d.id}
            onPress={() => { setSelectedDealer(d.id); setSelectedSlot(null); }}
          />
        ))}

        {/* ── Serviço ── */}
        <Text style={[s.sectionTitle, { marginTop: 20 }]}>Tipo de serviço</Text>
        <View style={s.servicesGrid}>
          {SERVICES.map(sv => {
            const active = selectedService === sv.id;
            return (
              <TouchableOpacity
                key={sv.id}
                style={[s.serviceChip, active && s.serviceChipActive]}
                activeOpacity={0.7}
                onPress={() => setSelectedService(sv.id)}
              >
                <View style={[s.serviceIcon, active && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Icon name={sv.icon} size={14} color={active ? Colors.white : Colors.blue} strokeWidth={1.75} />
                </View>
                <Text style={[s.serviceLabel, active && s.serviceLabelActive]} numberOfLines={1}>
                  {sv.label}
                </Text>
                <Text style={[s.servicePts, active && { color: 'rgba(255,255,255,0.7)' }]}>
                  +{sv.pts}pts
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Data ── */}
        <Text style={[s.sectionTitle, { marginTop: 20 }]}>Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateScroll}>
          <View style={{ flexDirection: 'row', gap: 8, paddingRight: 16 }}>
            {DATES.map(d => {
              const active = selectedDate?.id === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[s.dateChip, active && s.dateChipActive, d.disabled && s.dateChipDisabled]}
                  activeOpacity={0.7}
                  disabled={d.disabled}
                  onPress={() => { setSelectedDate(d); setSelectedSlot(null); }}
                >
                  <Text style={[s.dateDayName, active && s.dateTxtActive, d.disabled && s.dateTxtDim]}>
                    {d.dayName}
                  </Text>
                  <Text style={[s.dateDayNum, active && s.dateTxtActive, d.disabled && s.dateTxtDim]}>
                    {d.dayNum}
                  </Text>
                  <Text style={[s.dateMonth, active && s.dateTxtSub, d.disabled && s.dateTxtDim]}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* ── Horários ── */}
        {selectedDealer && (
          <>
            <Text style={[s.sectionTitle, { marginTop: 20 }]}>Horários disponíveis</Text>
            <View style={s.slotsGrid}>
              {slots.map(slot => {
                const active = selectedSlot === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[s.slotChip, active && s.slotChipActive]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text style={[s.slotTxt, active && s.slotTxtActive]}>{slot}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── Placa opcional ── */}
        <Text style={[s.sectionTitle, { marginTop: 20 }]}>
          Placa do veículo{' '}
          <Text style={s.optional}>(opcional)</Text>
        </Text>
        <View style={s.plateRow}>
          <Icon name="car" size={15} color={Colors.text3} />
          <TextInput
            style={s.plateInput}
            placeholder="ABC-1234"
            placeholderTextColor={Colors.text3}
            value={plate}
            onChangeText={setPlate}
            autoCapitalize="characters"
            maxLength={8}
          />
        </View>

        {/* ── Botão ── */}
        <TouchableOpacity
          style={[s.btn, !canContinue && s.btnOff]}
          disabled={!canContinue}
          activeOpacity={0.8}
          onPress={() => setShowConfirm(true)}
        >
          <Icon name="calendar" size={18} color={Colors.white} strokeWidth={2} />
          <Text style={s.btnTxt}>Confirmar Agendamento</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>

      <ConfirmModal
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        data={confirmData}
        loading={confirming}
      />
      <SuccessModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        data={lastBooking}
      />
      <Toast ref={toastRef} />
    </SafeAreaView>
  );
}

/* ── styles ── */
const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: Colors.bg },
  header:   {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14,
  },
  title:    { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.4 },
  subtitle: { fontSize: 12, color: Colors.text3, marginTop: 3 },
  ptsPill:  {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.blueXLight, borderRadius: Radius.full,
    paddingHorizontal: 11, paddingVertical: 6, marginTop: 2,
  },
  ptsTxt: { fontSize: 12, fontWeight: '600', color: Colors.blue },
  body:   { paddingHorizontal: 16, paddingBottom: 32 },

  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 10 },
  optional:     { fontSize: 11, fontWeight: '400', color: Colors.text3 },

  servicesGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip:       {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.lg, paddingHorizontal: 12, paddingVertical: 10,
    width: '48%',
  },
  serviceChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  serviceIcon:       {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: Colors.blueXLight,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel:      { fontSize: 12, fontWeight: '500', color: Colors.text, flex: 1 },
  serviceLabelActive:{ color: Colors.white },
  servicePts:        { fontSize: 10, fontWeight: '600', color: Colors.blue },

  dateScroll:       { marginHorizontal: -16, paddingLeft: 16, marginBottom: 4 },
  dateChip:         {
    width: 62, paddingVertical: 11, borderRadius: Radius.lg,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', gap: 2, ...Shadow.sm,
  },
  dateChipActive:   { backgroundColor: Colors.blue, borderColor: Colors.blue },
  dateChipDisabled: { opacity: 0.4 },
  dateDayName:      { fontSize: 10, fontWeight: '600', color: Colors.text3 },
  dateDayNum:       { fontSize: 20, fontWeight: '700', color: Colors.text, lineHeight: 26 },
  dateMonth:        { fontSize: 10, color: Colors.text3 },
  dateTxtActive:    { color: Colors.white },
  dateTxtSub:       { color: 'rgba(255,255,255,0.6)' },
  dateTxtDim:       { color: Colors.text3 },

  slotsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip:       {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.md,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  slotChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  slotTxt:        { fontSize: 13, fontWeight: '500', color: Colors.text },
  slotTxtActive:  { color: Colors.white, fontWeight: '600' },

  plateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 46, backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, marginBottom: 20,
  },
  plateInput: { flex: 1, fontSize: 14, color: Colors.text },

  btn:    {
    height: 52, backgroundColor: Colors.blue, borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, ...Shadow.md,
  },
  btnOff: { opacity: 0.4 },
  btnTxt: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

const dc = StyleSheet.create({
  card:         {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 10, ...Shadow.sm,
  },
  cardSelected: { borderColor: Colors.blue, borderWidth: 2 },
  badge:        {
    alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8,
    paddingVertical: 3, marginBottom: 8,
  },
  badgeTxt:  { fontSize: 10, fontWeight: '700', color: Colors.white },
  row:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap:  {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: Colors.blueXLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  name:      { fontSize: 14, fontWeight: '600', color: Colors.text },
  addr:      { fontSize: 12, color: Colors.text2, marginTop: 2 },
  meta:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  rating:    { fontSize: 11, fontWeight: '600', color: Colors.text },
  sep:       { fontSize: 11, color: Colors.text3 },
  dist:      { fontSize: 11, color: Colors.text3 },
  dot:       { width: 7, height: 7, borderRadius: 4 },
  hours:     { fontSize: 10, fontWeight: '500' },
  checkRow:  {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  checkTxt:  { fontSize: 12, color: Colors.blue, fontWeight: '500' },
});

const cm = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet:       {
    backgroundColor: Colors.white, borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 20, paddingBottom: 36,
  },
  header:      {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18,
  },
  title:       { fontSize: 16, fontWeight: '700', color: Colors.text },
  closeBtn:    {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.bg, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 14,
  },
  rowItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  rowBorder:   { borderBottomWidth: 1, borderBottomColor: Colors.border },
  rowIcon:     {
    width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.blueXLight,
    alignItems: 'center', justifyContent: 'center',
  },
  rowLabel:    { fontSize: 10, color: Colors.text3, fontWeight: '600' },
  rowValue:    { fontSize: 13, color: Colors.text, fontWeight: '500', marginTop: 1 },
  ptsBanner:   {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.amberLight, borderRadius: Radius.md, padding: 12, marginBottom: 16,
  },
  ptsTxt:      { fontSize: 13, color: Colors.text },
  ptsBold:     { fontWeight: '700', color: Colors.amber },
  btn:         {
    height: 50, backgroundColor: Colors.blue, borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10,
  },
  btnOff:      { opacity: 0.45 },
  btnTxt:      { color: Colors.white, fontSize: 15, fontWeight: '700' },
  cancelBtn:   { alignItems: 'center', paddingVertical: 8 },
  cancelTxt:   { fontSize: 14, color: Colors.text2 },
});

const su = StyleSheet.create({
  overlay:  {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  card:     {
    width: '82%', backgroundColor: Colors.white, borderRadius: 22,
    padding: 28, alignItems: 'center', ...Shadow.md,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.greenLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title:    { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  sub:      { fontSize: 14, color: Colors.text2, textAlign: 'center', marginBottom: 4 },
  date:     { fontSize: 12, color: Colors.text3, marginBottom: 16 },
  ptsTag:   {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.blueXLight, borderRadius: Radius.full,
    paddingHorizontal: 14, paddingVertical: 7, marginBottom: 22,
  },
  ptsTxt:   { fontSize: 13, fontWeight: '600', color: Colors.blue },
  btn:      {
    width: '100%', height: 46, backgroundColor: Colors.blue,
    borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center',
  },
  btnTxt:   { color: Colors.white, fontSize: 15, fontWeight: '700' },
});