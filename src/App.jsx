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
import ProjectDetailPanel from './components/ProjectDetailPanel';
import { useGameStore } from './store/gameStore';

export default function App() {
  const selectedProject = useGameStore((s) => s.selectedProject);
  const clearSelectedProject = useGameStore((s) => s.clearSelectedProject);

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

      <ProjectDetailPanel
        project={selectedProject}
        onClose={clearSelectedProject}
      />
    </div>
  );
}