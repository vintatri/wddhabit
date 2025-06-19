import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { Svg, Path, Circle, Line, Polyline } from 'react-native-svg';

// --- Ícones em SVG (versão para react-native-svg) ---
const HomeIcon = ({ color }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></Path>
    <Polyline points="9 22 9 12 15 12 15 22"></Polyline>
  </Svg>
);

const PlusCircleIcon = ({ color }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10"></Circle>
    <Line x1="12" y1="8" x2="12" y2="16"></Line>
    <Line x1="8" y1="12" x2="16" y2="12"></Line>
  </Svg>
);

const BarChartIcon = ({ color }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="20" x2="12" y2="10"></Line>
    <Line x1="18" y1="20" x2="18" y2="4"></Line>
    <Line x1="6" y1="20" x2="6" y2="16"></Line>
  </Svg>
);

const UserIcon = ({ color }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></Path>
    <Circle cx="12" cy="7" r="4"></Circle>
  </Svg>
);

// --- Componente: Tela de Perfil ---
const ProfileScreen = ({ userProfile, onUpdate, setScreen }) => {
  const [profile, setProfile] = useState(userProfile);

  const handleSave = () => {
    // Validação simples
    if (!profile.weight || !profile.age || !profile.strain.name || !profile.strain.thc || !profile.strain.cbd) {
      Alert.alert("Erro", "Por favor, preencha todos os campos para continuar.");
      return;
    }
    onUpdate(profile);
    Alert.alert("Sucesso", "Perfil atualizado!");
    setScreen('home');
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>Seu Perfil</Text>
      <Text style={styles.subtitle}>Dados básicos para personalizar a experiência.</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          value={profile.weight}
          onChangeText={(text) => setProfile({ ...profile, weight: text })}
          keyboardType="numeric"
          placeholder="Ex: 75"
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={profile.age}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
          keyboardType="numeric"
          placeholder="Ex: 30"
        />

        <Text style={styles.label}>Sexo</Text>
        <View style={styles.segmentedControl}>
            {['Masculino', 'Feminino', 'Outro'].map(gender => (
                <TouchableOpacity 
                    key={gender} 
                    style={[styles.segmentButton, profile.gender === gender && styles.segmentButtonActive]}
                    onPress={() => setProfile({ ...profile, gender })}
                >
                    <Text style={[styles.segmentText, profile.gender === gender && styles.segmentTextActive]}>{gender}</Text>
                </TouchableOpacity>
            ))}
        </View>
      </View>

      <Text style={styles.title}>Sua Cannabis</Text>
      <Text style={styles.subtitle}>Informações da variedade que você está utilizando.</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome da Variedade (Strain)</Text>
        <TextInput
          style={styles.input}
          value={profile.strain.name}
          onChangeText={(text) => setProfile({ ...profile, strain: { ...profile.strain, name: text } })}
          placeholder="Ex: OG Kush"
        />

        <Text style={styles.label}>THC (%)</Text>
        <TextInput
          style={styles.input}
          value={profile.strain.thc}
          onChangeText={(text) => setProfile({ ...profile, strain: { ...profile.strain, thc: text } })}
          keyboardType="numeric"
          placeholder="Ex: 20"
        />

        <Text style={styles.label}>CBD (%)</Text>
        <TextInput
          style={styles.input}
          value={profile.strain.cbd}
          onChangeText={(text) => setProfile({ ...profile, strain: { ...profile.strain, cbd: text } })}
          keyboardType="numeric"
          placeholder="Ex: 1"
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- Componente: Modal de Registro de Sessão ---
const LogSessionModal = ({ visible, onClose, onLog, strain }) => {
  const [amount, setAmount] = useState('0.1');
  const [temperature, setTemperature] = useState('180');
  const [puffDuration, setPuffDuration] = useState('5');

  const handleLogSession = () => {
    const parsedAmount = parseFloat(amount);
    const thcPercent = parseFloat(strain.thc);
    const cbdPercent = parseFloat(strain.cbd);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert("Erro", "A quantidade de erva deve ser um número positivo.");
        return;
    }

    const thcIngested = (parsedAmount * (thcPercent / 100)) * 1000; // em mg
    const cbdIngested = (parsedAmount * (cbdPercent / 100)) * 1000; // em mg

    onLog({
      timestamp: new Date().toISOString(),
      amount: parsedAmount,
      temperature: parseInt(temperature),
      puffDuration: parseInt(puffDuration),
      thcIngested,
      cbdIngested,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registrar "Trago"</Text>
          
          <Text style={styles.label}>Temperatura (°C)</Text>
          <TextInput style={styles.input} value={temperature} onChangeText={setTemperature} keyboardType="numeric" />
          
          <Text style={styles.label}>Quantidade de erva (g)</Text>
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" />

          <Text style={styles.label}>Duração do trago (s)</Text>
          <TextInput style={styles.input} value={puffDuration} onChangeText={setPuffDuration} keyboardType="numeric" />
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogSession}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Componente: Tela Principal (Dashboard) ---
const HomeScreen = ({ userProfile, sessions, setScreen, setModalVisible }) => {
  const [intoxication, setIntoxication] = useState({ level: 'Nenhum', message: 'Nenhum consumo hoje.' });
  const [alerts, setAlerts] = useState([]);

  const dailyTHCGoal = 20; // mg - Dose diária moderada
  const harmfulUseThreshold = 100; // mg - Limite de uso potencialmente nocivo

  const calculateTodayConsumption = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return sessions
      .filter(s => s.timestamp.startsWith(today))
      .reduce((acc, s) => ({
        thc: acc.thc + s.thcIngested,
        cbd: acc.cbd + s.cbdIngested,
        count: acc.count + 1
      }), { thc: 0, cbd: 0, count: 0 });
  }, [sessions]);

  useEffect(() => {
    const todayConsumption = calculateTodayConsumption();
    const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
    const newAlerts = [];

    // --- Lógica de Nível de Intoxicação Estimado ---
    if (lastSession) {
        const minutesSinceLastSession = (new Date() - new Date(lastSession.timestamp)) / 60000;
        let level = 'Nenhum';
        let message = 'Efeitos da última sessão dissipados.';

        if (minutesSinceLastSession < 10) {
            level = 'Leve';
            message = 'Efeitos começando a ser sentidos.';
        } else if (minutesSinceLastSession < 120) {
            if (lastSession.thcIngested > 10) {
                level = 'Alto';
                message = 'Pico dos efeitos. Evite tarefas complexas.';
            } else if (lastSession.thcIngested > 5) {
                level = 'Moderado';
                message = 'Efeitos claramente perceptíveis.';
            } else {
                level = 'Leve';
                message = 'Efeitos presentes, mas suaves.';
            }
        }
        setIntoxication({ level, message });
    }

    // --- Lógica de Alertas ---
    if (todayConsumption.thc >= dailyTHCGoal * 0.8 && todayConsumption.thc < dailyTHCGoal) {
      newAlerts.push({ type: 'warning', text: `Você atingiu ${Math.round((todayConsumption.thc / dailyTHCGoal) * 100)}% da sua meta diária de THC.` });
    }
    if (todayConsumption.thc >= dailyTHCGoal) {
      newAlerts.push({ type: 'danger', text: `Você ultrapassou sua meta diária de ${dailyTHCGoal} mg de THC.` });
    }
    if (todayConsumption.thc > harmfulUseThreshold) {
      newAlerts.push({ type: 'danger', text: `Consumo diário de ${todayConsumption.thc.toFixed(1)} mg de THC é potencialmente nocivo. Considere reduzir.` });
    }
    if (lastSession && sessions.length > 1) {
      const secondLastSession = sessions[sessions.length - 2];
      const intervalMinutes = (new Date(lastSession.timestamp) - new Date(secondLastSession.timestamp)) / 60000;
      if (intervalMinutes < 60) {
        newAlerts.push({ type: 'info', text: 'Intervalo entre sessões menor que 1 hora. Dê mais tempo para o metabolismo.' });
      }
    }
    setAlerts(newAlerts);

  }, [sessions, calculateTodayConsumption]);
  
  const todayConsumption = calculateTodayConsumption();

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>Olá!</Text>
      <Text style={styles.subtitle}>Seu resumo de hoje.</Text>

      <TouchableOpacity style={styles.logButton} onPress={() => setModalVisible(true)}>
        <PlusCircleIcon color="#FFF" />
        <Text style={styles.logButtonText}>Registrar um Trago</Text>
      </TouchableOpacity>

      {/* Card de Consumo Diário */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consumo de Hoje</Text>
        <View style={styles.consumptionGrid}>
            <View style={styles.consumptionItem}>
                <Text style={styles.consumptionValue}>{todayConsumption.thc.toFixed(1)} mg</Text>
                <Text style={styles.consumptionLabel}>THC</Text>
            </View>
            <View style={styles.consumptionItem}>
                <Text style={styles.consumptionValue}>{todayConsumption.cbd.toFixed(1)} mg</Text>
                <Text style={styles.consumptionLabel}>CBD</Text>
            </View>
             <View style={styles.consumptionItem}>
                <Text style={styles.consumptionValue}>{todayConsumption.count}</Text>
                <Text style={styles.consumptionLabel}>Tragos</Text>
            </View>
        </View>
        <Text style={styles.goalText}>Meta de THC: {todayConsumption.thc.toFixed(1)} / {dailyTHCGoal} mg</Text>
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min((todayConsumption.thc / dailyTHCGoal) * 100, 100)}%` }]} />
        </View>
      </View>

      {/* Card de Nível de Intoxicação */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nível de Intoxicação Estimado</Text>
        <Text style={[styles.intoxicationLevel, styles[`intoxication${intoxication.level}`]]}>{intoxication.level}</Text>
        <Text style={styles.intoxicationMessage}>{intoxication.message}</Text>
      </View>

      {/* Alertas */}
      {alerts.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alertas</Text>
          {alerts.map((alert, index) => (
            <View key={index} style={[styles.alert, styles[`alert_${alert.type}`]]}>
              <Text style={styles.alertText}>{alert.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Tarefas Substitutas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Precisa de uma Pausa?</Text>
        <Text style={styles.subtitle}>Tente uma atividade alternativa para relaxar.</Text>
        <View style={styles.taskGrid}>
            <TouchableOpacity style={styles.taskButton}><Text style={styles.taskText}>🧘 Respiração Guiada</Text></TouchableOpacity>
            <TouchableOpacity style={styles.taskButton}><Text style={styles.taskText}>🚶 Caminhada Leve</Text></TouchableOpacity>
            <TouchableOpacity style={styles.taskButton}><Text style={styles.taskText}>🎧 Meditação</Text></TouchableOpacity>
            <TouchableOpacity style={styles.taskButton}><Text style={styles.taskText}>💧 Beber Água</Text></TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


// --- Componente: Tela de Estatísticas ---
const StatsScreen = ({ sessions }) => {
  // Simples agregação de dados por dia para o gráfico
  const dataByDay = sessions.reduce((acc, session) => {
    const day = session.timestamp.slice(0, 10);
    if (!acc[day]) {
      acc[day] = { thc: 0, cbd: 0 };
    }
    acc[day].thc += session.thcIngested;
    acc[day].cbd += session.cbdIngested;
    return acc;
  }, {});
  
  const chartData = Object.entries(dataByDay)
    .sort(([dayA], [dayB]) => new Date(dayA) - new Date(dayB))
    .slice(-7); // Últimos 7 dias

  const maxThc = Math.max(...chartData.map(([, data]) => data.thc), 20); // Mínimo de 20 para a escala do gráfico

  // Calendário de uso
  const dailyTHCGoal = 20;
  const calendarDays = Object.entries(dataByDay).reduce((acc, [day, data]) => {
    if (data.thc > dailyTHCGoal) {
      acc[day] = 'red';
    } else if (data.thc > 0) {
      acc[day] = 'green';
    }
    return acc;
  }, {});

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>Estatísticas</Text>
      <Text style={styles.subtitle}>Seu progresso ao longo do tempo.</Text>

      {/* Gráfico de Consumo Semanal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Consumo de THC (Últimos 7 Dias)</Text>
        {chartData.length > 0 ? (
          <View style={styles.chartContainer}>
            {chartData.map(([day, data]) => (
              <View key={day} style={styles.chartBarWrapper}>
                <View style={[styles.chartBar, { height: `${(data.thc / maxThc) * 100}%` }]} />
                <Text style={styles.chartLabel}>{new Date(day + 'T00:00:00').getDate()}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.centeredText}>Sem dados suficientes para exibir o gráfico.</Text>
        )}
      </View>
      
       {/* Calendário */}
      <View style={styles.card}>
          <Text style={styles.cardTitle}>Calendário de Consumo</Text>
          <View style={styles.calendarGrid}>
              {/* Gera um exemplo de 30 dias */}
              {Array.from({ length: 30 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (29 - i));
                  const dayKey = date.toISOString().slice(0, 10);
                  const color = calendarDays[dayKey] === 'red' ? '#e57373' : calendarDays[dayKey] === 'green' ? '#81c784' : '#E0E0E0';
                  
                  return (
                      <View key={i} style={[styles.calendarDay, { backgroundColor: color }]}>
                          <Text style={styles.calendarDayText}>{date.getDate()}</Text>
                      </View>
                  )
              })}
          </View>
           <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                <Text><View style={[styles.legendDot, {backgroundColor: '#81c784'}]} /> Abaixo da meta</Text>
                <Text><View style={[styles.legendDot, {backgroundColor: '#e57373'}]} /> Acima da meta</Text>
           </View>
      </View>

      {/* Conquistas (Gamificação) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conquistas</Text>
        <View style={styles.achievement}>
          <Text>🏆</Text>
          <View>
            <Text style={styles.achievementTitle}>Primeiro Registro</Text>
            <Text style={styles.achievementDesc}>Você começou sua jornada de monitoramento.</Text>
          </View>
        </View>
        <View style={styles.achievement}>
          <Text>🔒</Text>
          <View>
            <Text style={styles.achievementTitle}>7 Dias Conscientes</Text>
            <Text style={styles.achievementDesc}>Fique 7 dias abaixo de 50% da sua meta.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};


// --- Componente Principal da Aplicação ---
export default function App() {
  const [screen, setScreen] = useState('profile');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    weight: '',
    age: '',
    gender: 'Masculino',
    strain: { name: '', thc: '', cbd: '' }
  });
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const { weight, age, strain } = userProfile;
    if (weight && age && strain.name && strain.thc && strain.cbd) {
      // Não mudar de tela automaticamente, deixar o usuário clicar em salvar.
    } else {
      setScreen('profile');
    }
  }, []);

  const handleUpdateProfile = (newProfile) => {
    setUserProfile(newProfile);
  };
  
  const handleLogSession = (newSession) => {
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen userProfile={userProfile} sessions={sessions} setScreen={setScreen} setModalVisible={setModalVisible} />;
      case 'stats':
        return <StatsScreen sessions={sessions} />;
      case 'profile':
        return <ProfileScreen userProfile={userProfile} onUpdate={handleUpdateProfile} setScreen={setScreen} />;
      default:
        return <ProfileScreen userProfile={userProfile} onUpdate={handleUpdateProfile} setScreen={setScreen}/>;
    }
  };

  const isProfileComplete = userProfile.weight && userProfile.age && userProfile.strain.name;

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}
      
      <LogSessionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onLog={handleLogSession}
        strain={userProfile.strain}
      />

      {/* Barra de Navegação Inferior só aparece se o perfil estiver completo */}
      {isProfileComplete && (
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => setScreen('home')}>
            <HomeIcon color={screen === 'home' ? '#4CAF50' : '#757575'} />
            <Text style={[styles.navText, screen === 'home' && styles.navTextActive]}>Início</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => setScreen('stats')}>
            <BarChartIcon color={screen === 'stats' ? '#4CAF50' : '#757575'} /
