import React, { useState } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { SetupPage } from './pages/SetupPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { InventoryPage } from './pages/InventoryPage';
import { WorkflowPage } from './pages/WorkflowPage';
import { NetworkSetupPage } from './pages/NetworkSetupPage';
import { SecurityGroupsPage } from './pages/SecurityGroupsPage';
import { Ec2InstancesPage } from './pages/Ec2InstancesPage';
import { SshConfigPage } from './pages/SshConfigPage';
import { VpcPeeringPage } from './pages/VpcPeeringPage';
import { RouteTablesPage } from './pages/RouteTablesPage';
import { ConnectivityTestsPage } from './pages/ConnectivityTestsPage';
import { ControlledFailurePage } from './pages/ControlledFailurePage';
import { TroubleshootingPage } from './pages/TroubleshootingPage';
import { EvidencePage } from './pages/EvidencePage';
import { EvaluationPage } from './pages/EvaluationPage';
import { FinalReportPage } from './pages/FinalReportPage';
import { CleanupPage } from './pages/CleanupPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'setup':
        return <SetupPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'inventory':
        return <InventoryPage />;
      case 'workflow':
        return <WorkflowPage onNavigate={setCurrentPage} />;
      case 'network-setup':
        return <NetworkSetupPage />;
      case 'security-groups':
        return <SecurityGroupsPage />;
      case 'ec2-instances':
        return <Ec2InstancesPage />;
      case 'ssh-config':
        return <SshConfigPage />;
      case 'vpc-peering':
        return <VpcPeeringPage />;
      case 'route-tables':
        return <RouteTablesPage />;
      case 'connectivity-tests':
        return <ConnectivityTestsPage />;
      case 'controlled-failure':
        return <ControlledFailurePage />;
      case 'troubleshooting':
        return <TroubleshootingPage />;
      case 'evidence':
        return <EvidencePage />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'final-report':
        return <FinalReportPage />;
      case 'cleanup':
        return <CleanupPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-500 selection:text-slate-950">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          currentPage={currentPage}
        />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}

export default App;
