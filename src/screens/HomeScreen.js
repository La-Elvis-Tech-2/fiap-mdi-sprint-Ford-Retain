import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, StatusBar, TextInput,
  Modal, Animated, Pressable, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useApp } from '../services/AppContext';
import { Colors, Radius, Shadow } from '../theme';

/* ── Bar chart ──────────────────────────────── */
function BarChart({ data, period, onPeriodChange }) {
  const PERIODS = ['7 dias', '30 dias', '90 dias'];
  const max = Math.max(...data, 1);
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <View>
      <View style={ch.wrap}>
        {data.map((v, i) => {
          const pct = v > 0 ? Math.max((v / max), 0.05) : 0.04;
          const active = i === data.length - 1;
          return (
            <View key={i} style={ch.col}>
              <View style={ch.track}>
                <View style={[
                  ch.bar,
                  { flex: pct, backgroundColor: active ? Colors.blue : Colors.blueLight },
                ]} />
              </View>
            </View>
          );
        })}
      </View>
      <View style={ch.labelsRow}>
        {days.map((d, i) => (
          <Text key={i} style={ch.dayLbl}>{d}</Text>
        ))}
      </View>
    </View>
  );
}

/* ── KPI dark card ──────────────────────────── */
function KpiDark({ iconName, value, tagText, tagUp = true, label }) {
  return (
    <View style={kpi.dark}>
      <View style={kpi.darkIconWrap}>
        <Icon name={iconName} size={15} color="rgba(255,255,255,0.75)" strokeWidth={1.75} />
      </View>
      <Text style={kpi.darkNum} adjustsFontSizeToFit numberOfLines={1}>{value}</Text>
      <View style={kpi.tagRow}>
        <Icon
          name={tagUp ? 'trending-up' : 'trending-down'}
          size={11}
          color={tagUp ? '#34D399' : '#F87171'}
          strokeWidth={2}
        />
        <Text style={[kpi.tagTxt, { color: tagUp ? '#34D399' : '#F87171' }]}>{tagText}</Text>
      </View>
      <Text style={kpi.darkLbl}>{label}</Text>
    </View>
  );
}

/* ── KPI light card ─────────────────────────── */
function KpiLight({ iconName, iconBg, iconColor, value, tagText, tagUp = true, label }) {
  return (
    <View style={kpi.light}>
      <View style={[kpi.lightIconWrap, { backgroundColor: iconBg }]}>
        <Icon name={iconName} size={15} color={iconColor} strokeWidth={1.75} />
      </View>
      <Text style={kpi.lightNum} adjustsFontSizeToFit numberOfLines={1}>{value}</Text>
      <View style={kpi.tagRow}>
        <Icon
          name={tagUp ? 'trending-up' : 'trending-down'}
          size={11}
          color={tagUp ? Colors.green : Colors.red}
          strokeWidth={2}
        />
        <Text style={[kpi.tagTxt, { color: tagUp ? Colors.green : Colors.red }]}>{tagText}</Text>
      </View>
      <Text style={kpi.lightLbl}>{label}</Text>
    </View>
  );
}

/* ── Alert row ──────────────────────────────── */
function AlertRow({ item, first }) {
  return (
    <View style={[al.row, !first && al.rowBorder]}>
      <View style={[al.iconWrap, { backgroundColor: item.ok ? Colors.greenLight : Colors.redLight }]}>
        <Icon
          name={item.ok ? 'check-circle' : 'alert-triangle'}
          size={16}
          color={item.ok ? Colors.green : Colors.red}
          strokeWidth={2}
        />
      </View>
      <View style={al.body}>
        <View style={al.titleRow}>
          <Text style={al.title} numberOfLines={1}>{item.title}</Text>
          <View style={[al.badge, { backgroundColor: item.ok ? Colors.greenLight : Colors.red }]}>
            <Text style={[al.badgeTxt, { color: item.ok ? Colors.greenDark : Colors.white }]}>
              {item.ok ? 'OK' : 'Atenção'}
            </Text>
          </View>
        </View>
        <Text style={al.sub} numberOfLines={1}>{item.sub}</Text>
        <Text style={al.time}>{item.time}</Text>
      </View>
    </View>
  );
}

/* ── Period Picker Modal ─────────────────────── */
function PeriodPicker({ visible, current, onSelect, onClose }) {
  const OPTIONS = ['7 dias', '30 dias', '90 dias'];
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={pm.overlay} onPress={onClose}>
        <View style={pm.sheet}>
          <Text style={pm.title}>Selecionar período</Text>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[pm.option, opt === current && pm.optionActive]}
              activeOpacity={0.7}
              onPress={() => { onSelect(opt); onClose(); }}
            >
              <Text style={[pm.optionTxt, opt === current && pm.optionTxtActive]}>{opt}</Text>
              {opt === current && (
                <Icon name="check" size={15} color={Colors.blue} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

/* ── Notifications Modal ─────────────────────── */
function NotificationsModal({ visible, onClose, activities }) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={nm.overlay}>
        <View style={nm.sheet}>
          <View style={nm.header}>
            <Text style={nm.title}>Notificações</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={nm.closeBtn}>
              <Icon name="x" size={18} color={Colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {activities.length === 0 ? (
              <View style={nm.empty}>
                <Icon name="bell" size={32} color={Colors.text3} />
                <Text style={nm.emptyTxt}>Nenhuma notificação</Text>
              </View>
            ) : (
              [...activities].reverse().map((a, i) => (
                <AlertRow key={a.id} item={a} first={i === 0} />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


/* ── All Alerts Modal ───────────────────────── */
function AllAlertsModal({ visible, onClose, activities }) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={nm.overlay}>
        <View style={nm.sheet}>
          <View style={nm.header}>
            <Text style={nm.title}>Todos os alertas</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={nm.closeBtn}>
              <Icon name="x" size={18} color={Colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {activities.length === 0 ? (
              <View style={nm.empty}>
                <Icon name="bell" size={32} color={Colors.text3} />
                <Text style={nm.emptyTxt}>Nenhum alerta</Text>
              </View>
            ) : (
              [...activities].reverse().map((a, i) => (
                <AlertRow key={a.id} item={a} first={i === 0} />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ── Search Modal ───────────────────────────── */
function SearchModal({ visible, onClose, activities }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const results = query.trim().length > 0
    ? activities.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.sub.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleOpen = () => {
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      onShow={handleOpen}
    >
      <View style={sm.overlay}>
        <View style={sm.sheet}>
          <View style={sm.bar}>
            <Icon name="search" size={16} color={Colors.text3} />
            <TextInput
              ref={inputRef}
              style={sm.input}
              placeholder="Buscar alertas, revisões..."
              placeholderTextColor={Colors.text3}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                <Icon name="x-circle" size={16} color={Colors.text3} strokeWidth={2} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => { setQuery(''); onClose(); }} activeOpacity={0.7}>
              <Text style={sm.cancelTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {query.trim().length === 0 ? (
              <View style={sm.hint}>
                <Icon name="search" size={28} color={Colors.text3} />
                <Text style={sm.hintTxt}>Digite para buscar</Text>
              </View>
            ) : results.length === 0 ? (
              <View style={sm.hint}>
                <Icon name="mood-sad" size={28} color={Colors.text3} />
                <Text style={sm.hintTxt}>Nenhum resultado para "{query}"</Text>
              </View>
            ) : (
              results.map((a, i) => (
                <AlertRow key={a.id} item={a} first={i === 0} />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ── Screen ─────────────────────────────────── */
export default function HomeScreen() {
  const { points, vinShare, networkServices, totalServices, badge, activities, pointsHistory, addRevision } = useApp();
  const outside = totalServices - networkServices;

  const [period, setPeriod] = useState('7 dias');
  const [showPeriod, setShowPeriod] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const unreadCount = activities.filter(a => !a.ok).length;

  const handleSaveRevision = (data) => {
    if (typeof addRevision === 'function') {
      addRevision(data);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />

      {/* top bar */}
      <View style={s.topbar}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>CS</Text>
        </View>

        {/* Search — abre modal de busca */}
        <TouchableOpacity
          style={s.searchBox}
          activeOpacity={0.7}
          onPress={() => setShowSearch(true)}
        >
          <Icon name="search" size={14} color={Colors.text3} />
          <Text style={s.searchTxt}>Search</Text>
        </TouchableOpacity>

        {/* Sino — abre notificações */}
        <TouchableOpacity
          style={s.iconBtn}
          activeOpacity={0.7}
          onPress={() => setShowNotifs(true)}
        >
          <Icon name="bell" size={17} color={Colors.text2} />
          {unreadCount > 0 && (
            <View style={s.notifBadge}>
              <Text style={s.notifBadgeTxt}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* KPI grid */}
        <View style={s.grid}>
          <KpiDark
            iconName="trophy"
            value={points}
            tagText={badge.short}
            tagUp={true}
            label="Pontos acumulados"
          />
          <KpiLight
            iconName="percent"
            iconBg={Colors.greenLight}
            iconColor={Colors.green}
            value={`${vinShare}%`}
            tagText={`${networkServices}/${totalServices}`}
            tagUp={true}
            label="VIN Share Ford"
          />
          <KpiLight
            iconName="wrench"
            iconBg={Colors.blueXLight}
            iconColor={Colors.blue}
            value={networkServices}
            tagText={outside > 0 ? `${outside} fora` : 'na rede'}
            tagUp={outside === 0}
            label="Revisões rede"
          />
          <KpiLight
            iconName="star"
            iconBg={Colors.amberLight}
            iconColor={Colors.amber}
            value={badge.short}
            tagText={`${points} pts`}
            tagUp={true}
            label="Nível atual"
          />
        </View>

        {/* chart */}
        <View style={s.secRow}>
          <Text style={s.secTitle}>Tendência de pontuação</Text>

          {/* Pílula — abre seletor de período */}
          <TouchableOpacity
            style={s.pill}
            activeOpacity={0.7}
            onPress={() => setShowPeriod(true)}
          >
            <Text style={s.pillTxt}>{period}</Text>
            <Icon name="chevron-down" size={12} color={Colors.text2} />
          </TouchableOpacity>
        </View>

        <View style={[s.card, { marginHorizontal: 16, marginBottom: 16, paddingBottom: 8 }]}>
          <BarChart data={pointsHistory} period={period} />
        </View>

        {/* alerts */}
        <View style={s.secRow}>
          <Text style={s.secTitle}>Alertas críticos</Text>

          {/* Ver tudo — abre modal com todos os alertas */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowAllAlerts(true)}>
            <Text style={s.secLink}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.card, { marginHorizontal: 16, padding: 0, overflow: 'hidden' }]}>
          {activities.length === 0 ? (
            <View style={al.empty}>
              <Icon name="bell" size={28} color={Colors.text3} />
              <Text style={al.emptyTitle}>Nenhuma atividade ainda</Text>
              <Text style={al.emptySub}>Compare veículos ou registre uma revisão</Text>
            </View>
          ) : (
            [...activities].reverse().slice(0, 4).map((a, i) => (
              <AlertRow key={a.id} item={a} first={i === 0} />
            ))
          )}
        </View>

        <View style={{ height: 12 }} />
      </ScrollView>

      {/* Modais */}
      <PeriodPicker
        visible={showPeriod}
        current={period}
        onSelect={setPeriod}
        onClose={() => setShowPeriod(false)}
      />
      <NotificationsModal
        visible={showNotifs}
        onClose={() => setShowNotifs(false)}
        activities={activities}
      />
      <AllAlertsModal
        visible={showAllAlerts}
        onClose={() => setShowAllAlerts(false)}
        activities={activities}
      />
      <SearchModal
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        activities={activities}
      />
    </SafeAreaView>
  );
}

/* ── Styles ── */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  topbar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.blue,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  searchBox: {
    flex: 1, height: 38, backgroundColor: Colors.white,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13,
  },
  searchTxt: { fontSize: 13, color: Colors.text3 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnBlue: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  notifBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeTxt: { color: Colors.white, fontSize: 9, fontWeight: '700' },
  scroll: { paddingBottom: 8 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: 16, paddingBottom: 16,
  },
  secRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 10,
  },
  secTitle: { fontSize: 15, fontWeight: '600', color: Colors.text },
  secLink: { fontSize: 12, fontWeight: '500', color: Colors.blue },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: 11, paddingVertical: 5,
  },
  pillTxt: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    borderWidth: 1, borderColor: Colors.border, padding: 16, ...Shadow.sm,
  },
});

const kpi = StyleSheet.create({
  dark: {
    width: '47%', backgroundColor: Colors.dark,
    borderRadius: Radius.xl, padding: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  light: {
    width: '47%', backgroundColor: Colors.white,
    borderRadius: Radius.xl, padding: 15,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.sm,
  },
  darkIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  lightIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  darkNum: { fontSize: 28, fontWeight: '700', color: Colors.white, letterSpacing: -0.8 },
  lightNum: { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.5 },
  darkLbl: { fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 5 },
  lightLbl: { fontSize: 11, color: Colors.text3, marginTop: 5 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  tagTxt: { fontSize: 11, fontWeight: '600' },
});

const al = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  iconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 13, fontWeight: '600', color: Colors.text, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeTxt: { fontSize: 10, fontWeight: '700' },
  sub: { fontSize: 12, color: Colors.text2, marginTop: 2, lineHeight: 17 },
  time: { fontSize: 11, color: Colors.text3, marginTop: 3 },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: Colors.text2 },
  emptySub: { fontSize: 12, color: Colors.text3 },
});

const ch = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 5 },
  col: { flex: 1, height: 90 },
  track: { flex: 1, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  labelsRow: { flexDirection: 'row', marginTop: 8 },
  dayLbl: { flex: 1, textAlign: 'center', fontSize: 10, color: Colors.text3 },
});

/* ── Period picker styles ── */
const pm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  title: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 14 },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  optionActive: { backgroundColor: 'transparent' },
  optionTxt: { fontSize: 14, color: Colors.text2 },
  optionTxtActive: { color: Colors.blue, fontWeight: '600' },
});

/* ── Notifications / All alerts modal styles ── */
const nm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '80%', paddingBottom: 20,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 18, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyTxt: { fontSize: 14, color: Colors.text3 },
});

/* ── New revision modal styles ── */
const nr = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 12, fontWeight: '600', color: Colors.text2, marginBottom: 6 },
  input: {
    height: 44, backgroundColor: Colors.bg,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, fontSize: 14, color: Colors.text, marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  chipTxt: { fontSize: 13, color: Colors.text2 },
  chipTxtActive: { color: Colors.white, fontWeight: '600' },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 48, backgroundColor: Colors.blue, borderRadius: Radius.lg,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveTxt: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});

/* ── Search modal styles ── */
const sm = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: Colors.bg,
  },
  sheet: { flex: 1 },
  bar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  cancelTxt: { fontSize: 14, color: Colors.blue, fontWeight: '500' },
  hint: { alignItems: 'center', paddingTop: 64, gap: 10 },
  hintTxt: { fontSize: 14, color: Colors.text3 },
});