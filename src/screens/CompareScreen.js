import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useApp } from '../services/AppContext';
import { callGroq } from '../services/groq';
import { Colors, Radius, Shadow } from '../theme';
import Toast from '../components/Toast';

export default function CompareScreen() {
  const { addPoints, addActivity } = useApp();
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);
  const inputRef2 = useRef(null);

  const handleCompare = async () => {
    if (!v1.trim() || !v2.trim()) {
      toastRef.current?.show('Preencha os dois veículos', 'warning');
      return;
    }
    setLoading(true);
    setAnalysis('');
    setInsight('');
    try {
      const a = await callGroq(
        `Compare ${v1} vs ${v2}. Qual é melhor para uso urbano e qual para off-road. Máximo 3 linhas.`,
      );
      addPoints(10);
      const ins = await callGroq(
        `Usuário comparou ${v1} vs ${v2}. Gere 1 frase animada incentivando pesquisa. 1 linha.`,
      );
      setAnalysis(a);
      setInsight(ins);
      addActivity({ title: `${v1} vs ${v2}`, sub: 'Comparação realizada · +10 pts', ok: true });
      toastRef.current?.show('+10 pts adicionados!', 'success');
    } catch {
      toastRef.current?.show('Erro ao conectar. Verifique a chave Groq.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.title}>Comparador IA</Text>
            <Text style={s.subtitle}>Análise inteligente de veículos Ford</Text>
          </View>
          <View style={s.ptsPill}>
            <Icon name="zap" size={12} color={Colors.blue} strokeWidth={2} />
            <Text style={s.ptsTxt}>+10 pts / análise</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
        >
          {/* input cards */}
          <View style={s.vsRow}>
            <View style={s.inputCard}>
              <Text style={s.inputLabel}>VEÍCULO 1</Text>
              <View style={s.inputRow}>
                <Icon name="car" size={15} color={Colors.text3} />
                <TextInput
                  style={s.input}
                  placeholder="ex: Ford Ranger"
                  placeholderTextColor={Colors.text3}
                  value={v1}
                  onChangeText={setV1}
                  returnKeyType="next"
                  onSubmitEditing={() => inputRef2.current?.focus()}
                />
              </View>
            </View>

            <View style={s.vsCircle}>
              <Text style={s.vsTxt}>VS</Text>
            </View>

            <View style={s.inputCard}>
              <Text style={s.inputLabel}>VEÍCULO 2</Text>
              <View style={s.inputRow}>
                <Icon name="car" size={15} color={Colors.text3} />
                <TextInput
                  ref={inputRef2}
                  style={s.input}
                  placeholder="ex: Toyota Hilux"
                  placeholderTextColor={Colors.text3}
                  value={v2}
                  onChangeText={setV2}
                  returnKeyType="done"
                  onSubmitEditing={handleCompare}
                />
              </View>
            </View>
          </View>

          {/* button */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnOff]}
            onPress={handleCompare}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <>
                  <Icon name="brain" size={18} color={Colors.white} />
                  <Text style={s.btnTxt}>Analisar com IA</Text>
                </>
            }
          </TouchableOpacity>

          {/* results */}
          {!!analysis && (
            <View style={s.results}>
              <View style={s.resultCard}>
                <View style={s.rcHead}>
                  <View style={[s.rcIcon, { backgroundColor: Colors.blueXLight }]}>
                    <Icon name="brain" size={14} color={Colors.blue} />
                  </View>
                  <Text style={s.rcLabel}>ANÁLISE COMPARATIVA</Text>
                </View>
                <Text style={s.rcText}>{analysis}</Text>
              </View>

              {!!insight && (
                <View style={s.resultCard}>
                  <View style={s.rcHead}>
                    <View style={[s.rcIcon, { backgroundColor: Colors.greenLight }]}>
                      <Icon name="star" size={14} color={Colors.green} />
                    </View>
                    <Text style={s.rcLabel}>INSIGHT</Text>
                  </View>
                  <Text style={s.rcText}>{insight}</Text>
                  <View style={s.ptsTag}>
                    <Icon name="trophy" size={13} color={Colors.blue} />
                    <Text style={s.ptsTagTxt}>+10 pts adicionados</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast ref={toastRef} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 16,
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, letterSpacing: -0.4 },
  subtitle: { fontSize: 12, color: Colors.text3, marginTop: 3 },
  ptsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.blueXLight, borderRadius: Radius.full,
    paddingHorizontal: 11, paddingVertical: 6, marginTop: 2,
  },
  ptsTxt: { fontSize: 12, fontWeight: '600', color: Colors.blue },

  body: { paddingHorizontal: 16, paddingBottom: 32 },

  vsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 16 },
  inputCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: 13, ...Shadow.sm,
  },
  inputLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.text3,
    letterSpacing: 0.9, marginBottom: 9,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  input: { flex: 1, fontSize: 13, color: Colors.text, height: 22, padding: 0 },
  vsCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.blue,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 13,
  },
  vsTxt: { color: Colors.white, fontSize: 10, fontWeight: '800' },

  btn: {
    height: 52, backgroundColor: Colors.blue, borderRadius: Radius.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    ...Shadow.md,
  },
  btnOff: { opacity: 0.45 },
  btnTxt: { color: Colors.white, fontSize: 15, fontWeight: '600' },

  results: { marginTop: 20, gap: 12 },
  resultCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border, padding: 16, ...Shadow.sm,
  },
  rcHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  rcIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rcLabel: { fontSize: 10, fontWeight: '700', color: Colors.text2, letterSpacing: 0.9 },
  rcText: { fontSize: 14, color: Colors.text, lineHeight: 22 },
  ptsTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', backgroundColor: Colors.blueXLight,
    borderRadius: Radius.md, paddingHorizontal: 10, paddingVertical: 5, marginTop: 10,
  },
  ptsTagTxt: { fontSize: 12, fontWeight: '600', color: Colors.blue },
});
