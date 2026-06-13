'use client';
import { useState } from 'react';
import { StatefulDataBarkAvatar, AvatarState } from './log-person-avatar';
import { avatarLog } from './avatar-logger';
import { Button } from '@/components/ui/button';

export function AvatarDemo() {
  const [currentState, setCurrentState] = useState<AvatarState>('idle');

  const states: AvatarState[] = ['idle', 'listening', 'thinking', 'talking'];

  const demoMessages = {
    idle: 'DataBark is ready to help!',
    listening: "I'm listening to your input...",
    thinking: 'Let me think about that...',
    talking: "Here's your answer!",
  };

  const handleStateChange = (state: AvatarState) => {
    setCurrentState(state);
    avatarLog.info(demoMessages[state], state);
  };

  const handleTestNotifications = () => {
    setTimeout(() => avatarLog.info('Loading dashboard data...', 'thinking'), 0);
    setTimeout(() => avatarLog.success('Dashboard loaded successfully!', 'idle'), 1000);
    setTimeout(() => avatarLog.warning('Some widgets took longer to load', 'thinking'), 2000);
    setTimeout(() => avatarLog.error('Failed to connect to data source', 'thinking'), 3000);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold">DataBark Avatar Demo</h3>

      <div className="mb-6 flex items-center justify-center">
        <div className="rounded-full bg-blue-600 p-4">
          <StatefulDataBarkAvatar size={64} state={currentState} />
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Current state: <span className="font-semibold">{currentState}</span>
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {states.map((state) => (
          <Button
            key={state}
            variant={currentState === state ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStateChange(state)}
            className="capitalize"
          >
            {state}
          </Button>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={handleTestNotifications} variant="secondary">
          Test Avatar Notifications
        </Button>
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <h4 className="mb-2 font-semibold">Avatar States:</h4>
        <ul className="space-y-1 text-xs">
          <li>
            <strong>Idle:</strong> Gentle floating animation with normal expression
          </li>
          <li>
            <strong>Listening:</strong> Pulsing scale animation with attentive expression
          </li>
          <li>
            <strong>Thinking:</strong> Head tilting with thinking bubbles and concentrated
            expression
          </li>
          <li>
            <strong>Talking:</strong> Bouncing animation with sound waves and animated mouth
          </li>
        </ul>
      </div>
    </div>
  );
}
