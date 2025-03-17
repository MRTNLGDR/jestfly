
import React from 'react';
import { useAuth } from '../../contexts/auth';
import {
  DiagnosticHeader,
  DiagnosticDescription,
  DiagnosticButtons,
  DiagnosticResults
} from './diagnostic';
import useDiagnosticController from './diagnostic/DiagnosticController';

interface ProfileDiagnosticProps {
  userId?: string;
  onRefresh?: () => void;
}

const ProfileDiagnostic: React.FC<ProfileDiagnosticProps> = ({ userId, onRefresh }) => {
  const { currentUser } = useAuth();
  const diagnosticController = useDiagnosticController({ 
    userId: userId || currentUser?.id, 
    onRefresh 
  });

  return (
    <div className="neo-blur rounded-xl border border-white/10 p-6 my-4 space-y-4">
      <DiagnosticHeader />
      
      <div className="space-y-2">
        <DiagnosticDescription />
        
        <DiagnosticButtons 
          isRunningDiagnostic={diagnosticController.isRunningDiagnostic}
          isFixing={diagnosticController.isFixing}
          isForceCreating={diagnosticController.isForceCreating}
          onRunDiagnostic={diagnosticController.handleRunDiagnostic}
          onAttemptFix={diagnosticController.handleAttemptFix}
          onForceCreateProfile={diagnosticController.handleForceCreateProfile}
          onRefreshProfile={diagnosticController.refreshProfile}
          onReloadPage={diagnosticController.reloadPage}
        />
        
        <DiagnosticResults diagnosticResults={diagnosticController.diagnosticResults} />
      </div>
    </div>
  );
};

export default ProfileDiagnostic;
