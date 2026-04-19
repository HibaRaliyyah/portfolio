import './index.css';
import { Suspense } from 'react';
import { World } from './components/World';
import { LoadingScreen } from './components/LoadingScreen';
import { IntroScreen } from './components/IntroScreen';
import { HUD } from './components/HUD';
import { ArrivePrompt } from './components/ArrivePrompt';
import { NewspaperModal } from './components/NewspaperModal';
import { FinalMap } from './components/FinalMap';
import { SocialLinks } from './components/SocialLinks';

export default function App() {
  return (
    <div className="grain" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={null}>
          <World />
        </Suspense>
      </div>

      <LoadingScreen />
      <IntroScreen />
      <HUD />
      <ArrivePrompt />
      <NewspaperModal />
      <FinalMap />
      <SocialLinks />
    </div>
  );
}