'use client';

import { useParams } from 'next/navigation';
import { GameSessionLayout } from '@/components/templates/GameSessionLayout';

export default function GameSessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  // Mock data - será substituído por dados reais da API
  const sessionData = {
    id: sessionId,
    title: 'A Lenda do Cristal Perdido',
    status: 'not_started' as const,
    players: [
      {
        id: '1',
        name: 'Aelindra Corvonoite',
        playerName: 'João',
        avatar: '/api/placeholder/40/40',
        level: 5,
        class: 'Ranger',
        race: 'Elfo',
        hp: { current: 28, max: 32 },
        mana: { current: 15, max: 20 },
        status: 'alive' as const,
        position: { x: 200, y: 150 },
        isOnline: true,
        attributes: {
          strength: { value: 12, modifier: 1 },
          dexterity: { value: 18, modifier: 4 },
          constitution: { value: 14, modifier: 2 },
          intelligence: { value: 13, modifier: 1 },
          wisdom: { value: 16, modifier: 3 },
          charisma: { value: 10, modifier: 0 },
        },
        conditions: ['Abençoado', 'Inspirado'],
        appearance:
          'Uma elfa de cabelos prateados e olhos verdes profundos. Veste um manto verde-escuro e carrega um arco élfico antigo.',
        backstory:
          'Nascida nas florestas de Eternum, Aelindra perdeu sua família em um ataque de orcs. Jurou proteger os inocentes e vingar sua família.',
        personality: 'Determinada e leal, mas às vezes impulsiva. Tem um forte senso de justiça.',
        ideals: 'A natureza deve ser protegida a todo custo.',
        bonds: 'Meu arco élfico é tudo o que restou da minha família.',
        flaws: 'Tenho dificuldade em confiar em pessoas que não respeitam a natureza.',
        notes: 'Tem um lobo companheiro chamado Sombra.',
        inventory: [
          { id: '1', name: 'Arco Élfico +1', quantity: 1, description: 'Arco mágico da família' },
          { id: '2', name: 'Flechas', quantity: 30 },
          { id: '3', name: 'Poção de Cura', quantity: 2, description: '2d4+2 pontos de vida' },
          { id: '4', name: 'Corda (15 metros)', quantity: 1 },
          { id: '5', name: 'Kit de Sobrevivência', quantity: 1 },
        ],
      },
      {
        id: '2',
        name: 'Thorek Martelo-de-Ferro',
        playerName: 'Maria',
        avatar: '/api/placeholder/40/40',
        level: 4,
        class: 'Guerreiro',
        race: 'Anão',
        hp: { current: 45, max: 48 },
        mana: { current: 8, max: 12 },
        status: 'alive' as const,
        position: { x: 250, y: 180 },
        isOnline: true,
        attributes: {
          strength: { value: 16, modifier: 3 },
          dexterity: { value: 10, modifier: 0 },
          constitution: { value: 16, modifier: 3 },
          intelligence: { value: 8, modifier: -1 },
          wisdom: { value: 12, modifier: 1 },
          charisma: { value: 14, modifier: 2 },
        },
        conditions: [],
        appearance:
          'Um anão robusto com uma barba ruiva trançada. Usa uma armadura de placas e empunha um martelo de guerra.',
        backstory:
          'Herdeiro de uma antiga linhagem de ferreiros anões. Deixou sua forja para buscar aventuras e honrar seus ancestrais.',
        personality: 'Honrado e corajoso, mas teimoso. Nunca recua de uma luta justa.',
        ideals: 'A honra é mais importante que a vida.',
        bonds: 'Meu martelo foi forjado por meu avô.',
        flaws: 'Sou muito orgulhoso para aceitar ajuda.',
        notes: 'Especialista em combate corpo a corpo.',
        inventory: [
          {
            id: '1',
            name: 'Martelo de Guerra +1',
            quantity: 1,
            description: 'Forjado pela família',
          },
          { id: '2', name: 'Armadura de Placas', quantity: 1, description: 'CA 18' },
          { id: '3', name: 'Escudo', quantity: 1, description: '+2 CA' },
          { id: '4', name: 'Poção de Força Gigante', quantity: 1 },
          { id: '5', name: 'Ferramentas de Ferreiro', quantity: 1 },
        ],
      },
      {
        id: '3',
        name: 'Zephyr Ventolâmina',
        playerName: 'Pedro',
        avatar: '/api/placeholder/40/40',
        level: 6,
        class: 'Mago',
        race: 'Humano',
        hp: { current: 22, max: 26 },
        mana: { current: 25, max: 30 },
        status: 'alive' as const,
        position: { x: 180, y: 200 },
        isOnline: true,
        attributes: {
          strength: { value: 8, modifier: -1 },
          dexterity: { value: 14, modifier: 2 },
          constitution: { value: 12, modifier: 1 },
          intelligence: { value: 18, modifier: 4 },
          wisdom: { value: 13, modifier: 1 },
          charisma: { value: 11, modifier: 0 },
        },
        conditions: ['Concentração', 'Escudo Mágico'],
        appearance:
          'Um jovem humano de vestes azuis ornamentadas. Carrega um cajado cristalino e um grimório antigo.',
        backstory:
          'Estudioso da Academia Arcana, busca conhecimentos perdidos sobre magia ancestral.',
        personality: 'Curioso e intelectual, mas às vezes arrogante com seu conhecimento.',
        ideals: 'O conhecimento deve ser preservado e compartilhado.',
        bonds: 'Meu grimório contém segredos que não podem ser perdidos.',
        flaws: 'Subestimo o perigo por confiar demais na magia.',
        notes: 'Especialista em magias de evocação e abjuração.',
        inventory: [
          { id: '1', name: 'Cajado Arcano', quantity: 1, description: '+1 em ataques mágicos' },
          { id: '2', name: 'Grimório', quantity: 1, description: 'Contém 20 magias' },
          { id: '3', name: 'Componentes Mágicos', quantity: 1 },
          {
            id: '4',
            name: 'Pergaminhos de Magia',
            quantity: 3,
            description: 'Bola de Fogo, Raio, Cura',
          },
          {
            id: '5',
            name: 'Poção de Mana',
            quantity: 2,
            description: 'Restaura 2d4+2 pontos de mana',
          },
        ],
      },
    ],
    currentUser: {
      id: 'current-user',
      role: 'master' as const, // 'player' | 'master'
    },
    joinCode: 'ABCD1234',
    mapImage: undefined, // Usar placeholder interno do p5.js
    messages: [
      {
        id: '1',
        senderId: 'system',
        senderName: 'Sistema',
        content: 'Bem-vindos à sessão "A Lenda do Cristal Perdido"!',
        timestamp: new Date('2024-01-15T10:00:00'),
        type: 'system' as const,
        chatType: 'general' as const,
      },
      {
        id: '2',
        senderId: '1',
        senderName: 'João',
        content: 'Pronto para a aventura!',
        timestamp: new Date('2024-01-15T10:01:00'),
        type: 'user' as const,
        chatType: 'general' as const,
      },
      {
        id: '3',
        senderId: 'master',
        senderName: 'Mestre',
        content:
          'Vocês chegam à entrada da caverna antiga. O ar está pesado e uma brisa fria sopra do interior...',
        timestamp: new Date('2024-01-15T10:02:00'),
        type: 'user' as const,
        chatType: 'general' as const,
        senderRole: 'master' as const,
      },
      {
        id: '4',
        senderId: '1',
        senderName: 'Maria',
        content: 'Uso a minha magia para iluminar a caverna...',
        timestamp: new Date('2024-01-15T10:03:00'),
        type: 'user' as const,
        chatType: 'general' as const,
      },
      {
        id: '5',
        senderId: 'master',
        senderName: 'Mestre',
        content: 'Vocês entram na caverna...',
        timestamp: new Date('2024-01-15T10:04:00'),
        type: 'user' as const,
        chatType: 'ai' as const,
        senderRole: 'player' as const,
      },
      {
        id: '6',
        senderId: 'ai',
        senderName: 'Assistente IA',
        content: 'Vocês entram na caverna... e encontra um dragão!',
        timestamp: new Date('2024-01-15T10:05:00'),
        type: 'ai' as const,
        chatType: 'ai' as const,
        senderRole: 'ai' as const,
      },
    ],
    notes: [
      {
        id: '1',
        title: 'Lore da Caverna',
        content: 'A caverna foi selada há 500 anos pelos elfos antigos.',
        timestamp: new Date('2024-01-15T09:45:00'),
      },
      {
        id: '2',
        title: 'Inimigos Potenciais',
        content: 'Possível presença de esqueletos e espíritos sombrios.',
        timestamp: new Date('2024-01-15T09:50:00'),
      },
    ],
  };

  return <GameSessionLayout sessionData={sessionData} />;
}
