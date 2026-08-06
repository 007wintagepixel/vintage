// ============================================
// Ludo Board Component - Web Game Board
// Canvas-based animated Ludo board with real-time Socket.IO sync
// ============================================

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { Dice1, X, MessageSquare, Users, Settings } from 'lucide-react';

// ============================================
// Types (matching shared-types)
// ============================================

interface Position {
  x: number;
  y: number;
}

interface Token {
  id: number;
  position: number; // -1 = home, 0-51 = track, 52-55 = home lane, 56 = finished
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isMoving: boolean;
}

interface Player {
  userId: string;
  username: string;
  color: 'red' | 'green' | 'yellow' | 'blue';
  tokens: Token[];
  isCurrentTurn: boolean;
  isBot: boolean;
  diceValue?: number;
  hasRolled: boolean;
}

interface GameState {
  matchId: string;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  status: 'waiting' | 'in_progress' | 'completed';
  winner?: string;
  legalMoves: { tokenId: number; fromPosition: number; toPosition: number }[];
  stateVersion: number;
}

interface Move {
  tokenId: number;
  fromPosition: number;
  toPosition: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  content: string;
  timestamp: Date;
}

// ============================================
// Board Constants
// ============================================

const BOARD_SIZE = 52;
const TOKEN_RADIUS = 16;
const CELL_SIZE = 40;
const BOARD_PADDING = 60;
const HOME_LANE_LENGTH = 4;

const PLAYER_COLORS = {
  red: { main: '#EF4444', glow: '#F87171', light: '#FEF2F2' },
  green: { main: '#22C55E', glow: '#4ADE80', light: '#F0FDF4' },
  yellow: { main: '#EAB308', glow: '#FDE047', light: '#FEFCE8' },
  blue: { main: '#3B82F6', glow: '#60A5FA', light: '#EFF6FF' },
};

const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];
const START_POSITIONS = { red: 0, green: 13, yellow: 26, blue: 39 };
const HOME_LANE_ENTRY = { red: 51, green: 12, yellow: 25, blue: 38 };

// ============================================
// Board Geometry Calculations
// ============================================

function getTrackCoordinates(index: number): Position {
  if (index < 0) return { x: -100, y: -100 };
  if (index >= 52 && index <= 55) return { x: -100, y: -100 };
  if (index === 56) return { x: -100, y: -100 };

  const perimeter = 52;
  const progress = index / perimeter;
  const side = Math.floor(progress * 4);
  const sideProgress = (progress * 4) % 1;
  const sideIndex = Math.floor(sideProgress * 13);
  
  let x, y;
  const offset = BOARD_PADDING + CELL_SIZE * 6;
  
  switch (side) {
    case 0:
      x = BOARD_PADDING + CELL_SIZE * 6 + sideIndex * CELL_SIZE;
      y = BOARD_PADDING;
      break;
    case 1:
      x = BOARD_PADDING + CELL_SIZE * 18;
      y = BOARD_PADDING + CELL_SIZE * 6 + sideIndex * CELL_SIZE;
      break;
    case 2:
      x = BOARD_PADDING + CELL_SIZE * 18 - sideIndex * CELL_SIZE;
      y = BOARD_PADDING + CELL_SIZE * 18;
      break;
    case 3:
      x = BOARD_PADDING;
      y = BOARD_PADDING + CELL_SIZE * 18 - sideIndex * CELL_SIZE;
      break;
    default:
      x = BOARD_PADDING;
      y = BOARD_PADDING;
  }
  
  return { x: x + CELL_SIZE / 2, y: y + CELL_SIZE / 2 };
}

function getHomeLaneCoordinates(color: keyof typeof PLAYER_COLORS, laneIndex: number): Position {
  const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const laneOffset = 30;
  
  switch (color) {
    case 'red': return { x: centerX - laneOffset * (4 - laneIndex), y: centerY };
    case 'green': return { x: centerX, y: centerY - laneOffset * (4 - laneIndex) };
    case 'yellow': return { x: centerX + laneOffset * (4 - laneIndex), y: centerY };
    case 'blue': return { x: centerX, y: centerY + laneOffset * (4 - laneIndex) };
  }
}

function getHomePosition(color: keyof typeof PLAYER_COLORS, tokenIndex: number): Position {
  const basePositions = {
    red: [
      { x: BOARD_PADDING + CELL_SIZE * 1.5, y: BOARD_PADDING + CELL_SIZE * 1.5 },
      { x: BOARD_PADDING + CELL_SIZE * 3.5, y: BOARD_PADDING + CELL_SIZE * 1.5 },
      { x: BOARD_PADDING + CELL_SIZE * 1.5, y: BOARD_PADDING + CELL_SIZE * 3.5 },
      { x: BOARD_PADDING + CELL_SIZE * 3.5, y: BOARD_PADDING + CELL_SIZE * 3.5 },
    ],
    green: [
      { x: BOARD_PADDING + CELL_SIZE * 10.5, y: BOARD_PADDING + CELL_SIZE * 1.5 },
      { x: BOARD_PADDING + CELL_SIZE * 12.5, y: BOARD_PADDING + CELL_SIZE * 1.5 },
      { x: BOARD_PADDING + CELL_SIZE * 10.5, y: BOARD_PADDING + CELL_SIZE * 3.5 },
      { x: BOARD_PADDING + CELL_SIZE * 12.5, y: BOARD_PADDING + CELL_SIZE * 3.5 },
    ],
    yellow: [
      { x: BOARD_PADDING + CELL_SIZE * 10.5, y: BOARD_PADDING + CELL_SIZE * 10.5 },
      { x: BOARD_PADDING + CELL_SIZE * 12.5, y: BOARD_PADDING + CELL_SIZE * 10.5 },
      { x: BOARD_PADDING + CELL_SIZE * 10.5, y: BOARD_PADDING + CELL_SIZE * 12.5 },
      { x: BOARD_PADDING + CELL_SIZE * 12.5, y: BOARD_PADDING + CELL_SIZE * 12.5 },
    ],
    blue: [
      { x: BOARD_PADDING + CELL_SIZE * 1.5, y: BOARD_PADDING + CELL_SIZE * 10.5 },
      { x: BOARD_PADDING + CELL_SIZE * 3.5, y: BOARD_PADDING + CELL_SIZE * 10.5 },
      { x: BOARD_PADDING + CELL_SIZE * 1.5, y: BOARD_PADDING + CELL_SIZE * 12.5 },
      { x: BOARD_PADDING + CELL_SIZE * 3.5, y: BOARD_PADDING + CELL_SIZE * 12.5 },
    ],
  };
  return basePositions[color][tokenIndex];
}

function getFinishedPosition(): Position {
  const centerX = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  const centerY = BOARD_PADDING + CELL_SIZE * 12 + CELL_SIZE / 2;
  return { x: centerX, y: centerY };
}

// ============================================
// Token Component
// ============================================

interface TokenProps {
  token: Token;
  color: keyof typeof PLAYER_COLORS;
  playerId: string;
  isCurrentPlayer: boolean;
  isLegalMove: boolean;
  onClick: (tokenId: number) => void;
}

function GameToken({ token, color, playerId, isCurrentPlayer, isLegalMove, onClick }: TokenProps) {
  const colorConfig = PLAYER_COLORS[color];
  const isInHome = token.position === -1;
  const isFinished = token.position === 56;
  const isInHomeLane = token.position >= 52 && token.position <= 55;
  
  let visualX = token.x;
  let visualY = token.y;
  
  if (isInHome) {
    const homePos = getHomePosition(color, token.id);
    visualX = homePos.x;
    visualY = homePos.y;
  } else if (isFinished) {
    const finishedPos = getFinishedPosition();
    visualX = finishedPos.x;
    visualY = finishedPos.y;
  } else if (isInHomeLane) {
    const laneIndex = token.position - 52;
    const lanePos = getHomeLaneCoordinates(color, laneIndex);
    visualX = lanePos.x;
    visualY = lanePos.y;
  } else {
    const trackPos = getTrackCoordinates(token.position);
    visualX = trackPos.x;
    visualY = trackPos.y;
  }
  
  const [displayX, setDisplayX] = useState(visualX);
  const [displayY, setDisplayY] = useState(visualY);
  
  useEffect(() => {
    if (token.isMoving) {
      const animate = () => {
        setDisplayX(prev => prev + (visualX - prev) * 0.15);
        setDisplayY(prev => prev + (visualY - prev) * 0.15);
        if (Math.abs(displayX - visualX) > 1 || Math.abs(displayY - visualY) > 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      setDisplayX(visualX);
      setDisplayY(visualY);
    }
  }, [visualX, visualY, token.isMoving]);
  
  const canMove = isCurrentPlayer && isLegalMove && !isFinished;
  
  return (
    <motion.div
      onClick={() => canMove && onClick(token.id)}
      style={{
        position: 'absolute',
        left: displayX - TOKEN_RADIUS,
        top: displayY - TOKEN_RADIUS,
        width: TOKEN_RADIUS * 2,
        height: TOKEN_RADIUS * 2,
        zIndex: isInHomeLane ? 10 : 5,
        cursor: canMove ? 'pointer' : 'default',
        touchAction: 'none',
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        scale: canMove ? 1.15 : 1,
        boxShadow: canMove 
          ? `0 0 20px ${colorConfig.glow}, 0 0 40px ${colorConfig.glow}`
          : '0 4px 12px rgba(0,0,0,0.4)',
      }}
      transition={{ duration: 0.2 }}
      className="token"
    >
      <div
        className="token-inner"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${colorConfig.light}, ${colorConfig.main})`,
          border: `3px solid ${colorConfig.glow}`,
          boxShadow: `
            inset 0 -4px 8px ${colorConfig.main},
            inset 0 4px 8px ${colorConfig.light},
            0 4px 12px rgba(0,0,0,0.4)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {token.id + 1}
      </div>
      
      {token.isMoving && (
        <motion.div
          className="moving-ring"
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: `2px solid ${colorConfig.glow}`,
            opacity: 0.6,
          }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// ============================================
// Dice Component
// ============================================

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  playerColor: keyof typeof PLAYER_COLORS;
}

function GameDice({ value, isRolling, canRoll, onRoll, playerColor }: DiceProps) {
  const colorConfig = PLAYER_COLORS[playerColor];
  
  const diceFaces = [
    [{ x: 0.5, y: 0.5 }],
    [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
    [{ x: 0.25, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.75, y: 0.75 }],
    [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
    [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
    [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }],
  ];
  
  const dots = value ? diceFaces[value - 1] : diceFaces[0];
  
  return (
    <motion.button
      onClick={onRoll}
      disabled={!canRoll || isRolling}
      className="game-dice"
      style={{
        width: 80,
        height: 80,
        borderRadius: 16,
        background: `linear-gradient(135deg, #fff 0%, #f3f4f6 100%)`,
        border: `3px solid ${colorConfig.main}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5), 0 0 0 1px rgba(0,0,0,0.1)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 12,
        cursor: canRoll ? 'pointer' : 'not-allowed',
        opacity: canRoll ? 1 : 0.5,
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: isRolling ? 360 : 0,
        scale: [1, 1.1, 1],
      }}
      transition={{
        rotate: { duration: 0.5, repeat: isRolling ? Infinity : 0, ease: 'linear' },
        scale: { duration: 0.3, repeat: isRolling ? Infinity : 0 },
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, width: '100%', height: '100%' }}>
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff, ${colorConfig.main})`,
              boxShadow: `0 2px 4px rgba(0,0,0,0.3)`,
              placeSelf: 'center',
            }}
            animate={{ scale: isRolling ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 0.3, repeat: isRolling ? Infinity : 0, delay: i * 0.05 }}
          />
        ))}
      </div>
      {isRolling && (
        <motion.span
          className="rolling-text"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ fontSize: 10, fontWeight: 'bold', color: colorConfig.main, marginTop: 4 }}
        >
          ROLLING...
        </motion.span>
      )}
    </motion.button>
  );
}

// ============================================
// Player Panel Component
// ============================================

interface PlayerPanelProps {
  player: Player;
  isCurrentTurn: boolean;
  onTokenClick: (tokenId: number) => void;
  legalMoves: { tokenId: number }[];
}

function PlayerPanel({ player, isCurrentTurn, onTokenClick, legalMoves }: PlayerPanelProps) {
  const colorConfig = PLAYER_COLORS[player.color];
  const legalTokenIds = new Set(legalMoves.map(m => m.tokenId));
  const finishedCount = player.tokens.filter(t => t.position === 56).length;
  const inHomeLaneCount = player.tokens.filter(t => t.position >= 52 && t.position <= 55).length;
  const onBoardCount = player.tokens.filter(t => t.position >= 0 && t.position <= 51).length;
  const inHomeCount = player.tokens.filter(t => t.position === -1).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isCurrentTurn ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: `linear-gradient(135deg, ${colorConfig.light} 0%, ${colorConfig.main}10 100%)`,
        border: `2px solid ${isCurrentTurn ? colorConfig.glow : colorConfig.main}40`,
        borderRadius: 16,
        padding: 16,
        boxShadow: isCurrentTurn 
          ? `0 0 30px ${colorConfig.glow}60, 0 4px 12px rgba(0,0,0,0.2)`
          : '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isCurrentTurn && (
        <motion.div
          className="turn-indicator"
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            height: 4,
            background: `linear-gradient(90deg, ${colorConfig.glow}, ${colorConfig.main})`,
            borderRadius: '16px 16px 0 0',
          }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      
      <div className="player-header" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div className="player-avatar" style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `linear-gradient(135deg, ${colorConfig.glow}, ${colorConfig.main})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: 18, color: '#fff',
          boxShadow: `0 4px 12px ${colorConfig.glow}60`,
        }}>
          {player.username[0].toUpperCase()}
        </div>
        <div className="player-info" style={{ flex: 1, minWidth: 0 }}>
          <div className="player-name" style={{ fontWeight: 700, fontSize: 16, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {player.username} {player.isBot && <span style={{ fontSize: 10, color: '#6b7280', marginLeft: 6 }}>BOT</span>}
          </div>
          <div className="player-status" style={{ fontSize: 12, color: '#6b7280' }}>
            {isCurrentTurn ? 'Your Turn' : 'Waiting for turn'}
          </div>
        </div>
      </div>
      
      <div className="token-status" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        <div className={`status-item ${finishedCount > 0 ? 'active' : ''}`} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: finishedCount > 0 ? `${colorConfig.main}15` : 'transparent' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: finishedCount > 0 ? colorConfig.main : '#9ca3af' }}>{finishedCount}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Home</div>
        </div>
        <div className={`status-item ${inHomeLaneCount > 0 ? 'active' : ''}`} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: inHomeLaneCount > 0 ? `${colorConfig.main}15` : 'transparent' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: inHomeLaneCount > 0 ? colorConfig.main : '#9ca3af' }}>{inHomeLaneCount}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Lane</div>
        </div>
        <div className={`status-item ${onBoardCount > 0 ? 'active' : ''}`} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: onBoardCount > 0 ? `${colorConfig.main}15` : 'transparent' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: onBoardCount > 0 ? colorConfig.main : '#9ca3af' }}>{onBoardCount}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Board</div>
        </div>
        <div className={`status-item ${inHomeCount > 0 ? 'active' : ''}`} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, background: inHomeCount > 0 ? `${colorConfig.main}15` : 'transparent' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: inHomeCount > 0 ? colorConfig.main : '#9ca3af' }}>{inHomeCount}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>Base</div>
        </div>
      </div>
      
      <div className="player-tokens" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {player.tokens.map((token, index) => {
          const isLegal = legalTokenIds.has(token.id);
          const isInHome = token.position === -1;
          const isFinished = token.position === 56;
          
          return (
            <motion.button
              key={token.id}
              onClick={() => !isFinished && onTokenClick(token.id)}
              disabled={isFinished || !isLegal}
              className="token-btn"
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: isFinished 
                  ? `linear-gradient(135deg, ${colorConfig.glow}, ${colorConfig.main})`
                  : isLegal
                    ? `linear-gradient(135deg, ${colorConfig.light}, ${colorConfig.main}20)`
                    : '#f3f4f6',
                border: `2px solid ${isLegal ? colorConfig.glow : isFinished ? colorConfig.main : '#e5e7eb'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 14,
                color: isFinished ? '#fff' : isLegal ? colorConfig.main : '#9ca3af',
                cursor: isLegal && !isFinished ? 'pointer' : 'not-allowed',
                opacity: isFinished || isLegal ? 1 : 0.5,
                boxShadow: isLegal 
                  ? `0 0 15px ${colorConfig.glow}60, 0 4px 12px rgba(0,0,0,0.15)`
                  : isFinished ? `0 4px 12px ${colorConfig.glow}40` : 'none',
                transition: 'all 0.2s',
              }}
              whileTap={{ scale: 0.9 }}
            >
              {isFinished ? (
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✓
                </motion.div>
              ) : <span style={{ fontSize: 14, fontWeight: 'bold' }}>{index + 1}</span>}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// Chat Component
// ============================================

interface ChatProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  currentUserId: string;
}

function GameChat({ messages, onSend, currentUserId }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };
  
  return (
    <div className="game-chat" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
      <div className="chat-header" style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9fafb' }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>Chat</h3>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{messages.length} messages</span>
      </div>
      
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: msg.senderId === currentUserId ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${PLAYER_COLORS[msg.senderColor as keyof typeof PLAYER_COLORS]?.glow || '#3B82F6'}, ${PLAYER_COLORS[msg.senderColor as keyof typeof PLAYER_COLORS]?.main || '#3B82F6'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 12, flexShrink: 0 }}>
                {msg.senderName[0].toUpperCase()}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: msg.senderId === currentUserId ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.senderId === currentUserId ? '#3B82F6' : '#f3f4f6',
                  color: msg.senderId === currentUserId ? '#fff' : '#1f2937',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2, opacity: 0.7 }}>{msg.senderName}</div>
                <div style={{ fontSize: 14, lineHeight: 1.4, wordBreak: 'break-word' }}>{msg.content}</div>
                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} style={{ padding: 16, borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: '2px solid #e5e7eb', outline: 'none', fontSize: 14, transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'} onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
          <button type="submit" disabled={!input.trim()} style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', border: 'none', color: '#fff', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// Main Game Board Page Component
// ============================================

interface GameBoardPageProps {
  params: Promise<{ matchId: string }>;
}

async function GameBoardPage({ params }: GameBoardPageProps) {
  const { matchId } = await params;
  return <GameBoard matchId={matchId} />;
}

function GameBoard({ matchId }: { matchId: string }) {
  // Mock auth context - replace with real auth
  const user = { id: 'user-1', username: 'Player1' };
  const accessToken = 'mock-token';
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [myColor, setMyColor] = useState<keyof typeof PLAYER_COLORS | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // ============================================
  // Socket Connection
  // ============================================
  useEffect(() => {
    if (!accessToken) return;
    
    const newSocket = io('/game', {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
    });
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join_match', { matchId });
    });
    
    newSocket.on('disconnect', () => setIsConnected(false));
    
    newSocket.on('match:state', (state: GameState) => {
      setGameState(state);
      const me = state.players.find(p => p.userId === 'user-1');
      if (me) setMyColor(me.color);
    });
    
    newSocket.on('match:diceRoll', (data: { userId: string; diceRoll: { value: number } }) => {
      setGameState(prev => prev ? { ...prev, diceRoll: data.diceRoll, currentPlayerIndex: prev.players.findIndex(p => p.userId === data.userId) } : null);
    });
    
    newSocket.on('match:move', (data: { userId: string; move: Move; capturedTokens: any[]; gameState: GameState }) => {
      setGameState(data.gameState);
    });
    
    newSocket.on('match:turnChange', (data: { nextPlayerId: string; extraTurn: boolean; diceRoll?: any }) => {
      setGameState(prev => prev ? { ...prev, currentPlayerIndex: prev.players.findIndex(p => p.userId === data.nextPlayerId), diceRoll: data.diceRoll || null } : null);
    });
    
    newSocket.on('match:finished', (data: { winnerId: string; finalRankings: string[]; gameState: GameState }) => {
      setGameState(data.gameState);
    });
    
    newSocket.on('match:error', (data: { code: string; message: string }) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });
    
    newSocket.on('match:chat', (data: { senderId: string; senderName: string; senderColor: string; content: string; timestamp: string }) => {
      setChatMessages(prev => [...prev, { ...data, timestamp: new Date(data.timestamp), id: Date.now().toString() }]);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.emit('leave_match', { matchId });
      newSocket.disconnect();
    };
  }, [matchId, accessToken]);
  
  // ============================================
  // Game Actions
  // ============================================
  const handleRollDice = useCallback(() => {
    socket?.emit('roll_dice', { matchId, idempotencyKey: `roll-${Date.now()}-${Math.random()}` });
  }, [socket, matchId]);
  
  const handleTokenClick = useCallback((tokenId: number) => {
    if (!gameState || !myColor) return;
    const myPlayerIndex = gameState.players.findIndex(p => p.color === myColor);
    if (myPlayerIndex === -1) return;
    const myPlayer = gameState.players[myPlayerIndex];
    const token = myPlayer.tokens[tokenId];
    const legalMove = gameState.legalMoves?.find(m => m.tokenId === tokenId);
    if (!legalMove) return;
    socket?.emit('move_token', { matchId, tokenId, toPosition: legalMove.toPosition, gameStateVersion: gameState.stateVersion, idempotencyKey: `move-${Date.now()}-${Math.random()}` });
  }, [socket, matchId, gameState, myColor]);
  
  const handleSendChat = useCallback((content: string) => {
    socket?.emit('send_chat', { matchId, content });
  }, [socket, matchId]);
  
  // ============================================
  // Render
  // ============================================
  if (!gameState) {
    return (
      <div className="game-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 64, height: 64, border: '4px solid #e5e7eb', borderTopColor: '#3B82F6', borderRadius: '50%' }} />
        <p style={{ color: '#6b7280', fontSize: 16 }}>Loading game...</p>
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Connecting to match {matchId.slice(0, 8)}...</p>
      </div>
    );
  }
  
  const myPlayerIndex = gameState.players.findIndex(p => p.color === myColor);
  const myPlayer = myPlayerIndex >= 0 ? gameState.players[myPlayerIndex] : null;
  const isMyTurn = myPlayerIndex === gameState.currentPlayerIndex;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const legalTokenIds = new Set(gameState.legalMoves?.map(m => m.tokenId) || []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <div className="game-board-container" style={{ height: '100vh', display: 'flex', background: '#0C0A09', color: '#F9FAFB' }}>
      <aside className="sidebar-left" style={{ width: 280, padding: 20, overflowY: 'auto', background: 'linear-gradient(180deg, #111827 0%, #0C0A09 100%)', borderRight: '1px solid #1F2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #374151' }}>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#F9FAFB' }}>Players</h2>
          <button onClick={() => setShowChat(!showChat)} className={`chat-toggle ${showChat ? 'active' : ''}`} style={{ padding: '8px 12px', borderRadius: 8, background: showChat ? '#3B82F6' : '#374151', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={14} /> Chat
          </button>
        </div>
        
        <motion.div key={currentPlayer?.color} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ marginBottom: 24, padding: 16, borderRadius: 12, background: `linear-gradient(135deg, ${PLAYER_COLORS[currentPlayer?.color as keyof typeof PLAYER_COLORS]?.light || '#EFF6FF'} 0%, ${PLAYER_COLORS[currentPlayer?.color as keyof typeof PLAYER_COLORS]?.main || '#3B82F6'}15 100%)`, border: `1px solid ${PLAYER_COLORS[currentPlayer?.color as keyof typeof PLAYER_COLORS]?.main || '#3B82F6'}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${PLAYER_COLORS[currentPlayer?.color as keyof typeof PLAYER_COLORS]?.glow || '#60A5FA'}, ${PLAYER_COLORS[currentPlayer?.color as keyof typeof PLAYER_COLORS]?.main || '#3B82F6'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16, color: '#fff' }}>
              {currentPlayer?.username[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>{currentPlayer?.username}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{gameState.status === 'in_progress' ? 'Current Turn' : gameState.status === 'completed' ? 'Winner! 🏆' : 'Game Starting...'}</div>
            </div>
          </div>
          {gameState.diceValue && (
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} style={{ width: 60, height: 60, borderRadius: 10, background: 'linear-gradient(135deg, #fff, #f3f4f6)', border: '3px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 'bold', color: '#3B82F6', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', margin: '0 auto' }}>
              {gameState.diceValue}
            </motion.div>
          )}
        </motion.div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {gameState.players.map((player, index) => (
            <PlayerPanel key={player.userId} player={player} isCurrentTurn={index === gameState.currentPlayerIndex} onTokenClick={handleTokenClick} legalMoves={index === gameState.currentPlayerIndex ? gameState.legalMoves || [] : []} />
          ))}
        </div>
      </aside>
      
      <main className="game-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16 24', background: 'rgba(17,24,39,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1F2937', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => window.history.back()} style={{ padding: 8, borderRadius: 8, background: '#1F2937', border: '1px solid #374151', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            <h1 style={{ fontWeight: 700, fontSize: 20, background: 'linear-gradient(135deg, #22D3EE, #D946EF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ludo Nexus</h1>
            <span style={{ fontSize: 12, color: '#9CA3AF', background: '#1F2937', padding: '4px 10px', borderRadius: 12 }}>Match: {matchId.slice(0, 8)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#1F2937', borderRadius: 8, border: '1px solid #374151' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected ? '#22C55E' : '#EF4444' }} />
              <span style={{ fontSize: 13, color: '#D1D5DB' }}>{isConnected ? 'Connected' : 'Reconnecting...'}</span>
            </div>
          </div>
        </header>
        
        <div className="board-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
          <canvas ref={canvasRef} width={800} height={800} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 16, boxShadow: '0 0 60px rgba(34,211,238,0.1), 0 20px 40px rgba(0,0,0,0.4)', background: '#0C0A09' }} />
          
          {myPlayer && (
            <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
              <GameDice value={isMyTurn && gameState.diceValue ? gameState.diceValue : null} isRolling={isMyTurn && gameState.diceValue === null && myPlayer.hasRolled} canRoll={isMyTurn && !myPlayer.hasRolled && gameState.status === 'in_progress'} onRoll={handleRollDice} playerColor={myColor!} />
            </div>
          )}
          
          {gameState.status === 'completed' && gameState.winner && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
              <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={{ background: '#111827', borderRadius: 24, padding: 40, maxWidth: 400, width: '90%', textAlign: 'center', border: '1px solid #374151', boxShadow: '0 0 60px rgba(34,211,238,0.2)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
                <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, background: 'linear-gradient(135deg, #22D3EE, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Game Complete!</h2>
                <p style={{ fontSize: 18, color: '#D1D5DB', marginBottom: 24 }}>
                  {gameState.winner === 'user-1' ? 'You Won! 🎉' : `${gameState.players.find(p => p.userId === gameState.winner)?.username} Wins!`}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {gameState.players.map((p, i) => (
                    <div key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: p.userId === 'user-1' ? '#3B82F620' : '#1F2937', borderRadius: 12, border: p.userId === 'user-1' ? '1px solid #3B82F6' : '1px solid #374151' }}>
                      <span style={{ fontSize: 20, fontWeight: 'bold', color: i === 0 ? '#FBBF24' : i === 1 ? '#9CA3AF' : i === 2 ? '#EF4444' : '#6B7280' }}>{i + 1}</span>
                      <span style={{ fontWeight: 600, color: '#F9FAFB' }}>{p.username}</span>
                      {p.userId === gameState.winner && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#FBBF24' }}>WINNER</span>}
                    </div>
                  ))}
                </div>
                <button onClick={() => window.location.href = '/dashboard'} style={{ width: '100%', padding: '14px 24', borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Back to Dashboard</button>
              </motion.div>
            </motion.div>
          )}
        </div>
        
        <aside className={`sidebar-right ${showChat ? 'open' : ''}`} style={{ width: showChat ? 360 : 0, minWidth: showChat ? 360 : 0, transition: 'width 0.3s ease, min-width 0.3s ease', overflow: 'hidden', background: '#0C0A09', borderLeft: '1px solid #1F2937', display: 'flex', flexDirection: 'column' }}>
          {showChat && <GameChat messages={[]} onSend={handleSendChat} currentUserId={'user-1'} />}
        </aside>
      </main>
    </div>
  );
}

export default GameBoardPage;